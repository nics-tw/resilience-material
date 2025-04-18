# GitHub Action for Generating SBOM and scanning Open Source Vulnerability

NOTE: 如有需要，可以參照有關 [GitHub Action 的名詞介紹](./ci-cd-guideline.md)。

使用 GitHub Action 自動生成 SBOM 並附加於 Release，並於 Pull Request 自動掃描 Open Source Vulnerability (OSV)。

以下的 GitHub Action 主要依賴於 [trivy](https://trivy.dev/latest/) 與 [trivy-action](https://github.com/aquasecurity/trivy-action)，`trivy-action` 目前可用於掃描 repo 與 container image ，請自行參照文件更改為貴專案需要的形式。

- trivy 支援生成 SBOM 與 掃描漏洞的語言，限制條件請見[此](https://trivy.dev/latest/docs/coverage/language/)，列表最後更新於2025/04/06：
  - Ruby
  - Python
  - PHP
  - Node.js
  - .NET
  - Java
  - Go
  - Rust
  - C/C++
  - Elixir
  - Dart
  - Swift
  - Julia

## 以 petsard 專案為例

[petsard](https://github.com/nics-tw/petsard) GitHub Action 相關檔案結構如下：

```txt
.github/
├── workflows/
│   ├── trivy-sbom-gen.yml
│   └── trivy-vuln-scan.yml
└── dependabot.yml
```

### SBOM Generation

生成 SBOM 檔案

1. 觸發條件：
   - 發布 release 時
1. 觸發動作：
   - 掃描專案程式碼並生成 `dependency.sbom.json`，並更新元件依賴圖（dependency graph）
   - 上傳 `dependency.sbom.json` 至 GitHub Artifact（位於該次Action內），可設定文件保留天數 `retention-days`，預設為90天
   - 上傳 `dependency.sbom.json` 至該次 release 附件

```yml
name: Generate SBOM
on:
  release:
    types: ["published"]
  workflow_dispatch:

## GITHUB_TOKEN authentication, add only if you're not going to use a PAT
permissions:
  contents: write

jobs:
  generate-sbom:
    name: Generating SBOM
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy in GitHub SBOM mode and submit results to Dependency Graph
        uses: aquasecurity/trivy-action@0.30.0
        with:
          scan-type: "fs"
          format: "github"
          output: "dependency.sbom.json"
          github-pat: ${{ secrets.GITHUB_TOKEN }}
          hide-progress: true

      - name: Upload trivy sbom report as a Github artifact
        uses: actions/upload-artifact@v4
        with:
          name: trivy-sbom
          path: "${{ github.workspace }}/dependency.sbom.json"
          # retention-days: 20 # 90 is the default

      - name: Upload trivy sbom report to release
        run: |
          cd ${{github.workspace}}
          gh release upload "${{github.event.release.tag_name}}" dependency.sbom.json
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        shell: bash
```

### Vulnerability Scanning

該 GitHub Action 會掃描專案使用的元件中是否有 CVE 風險的漏洞元件，並提出可以更新的無風險版本，以提升專案安全性。
若有掃描出可修正的弱點時，則會阻攔 Pull Request 被合併。
同時也會在每週一 05：00AM(UTC+8) 定期掃描一次。

1. 觸發條件：
   - 上傳 commit 時掃描
   - 發布 Pull Request，可自行設定條件，目前設定為："ready_for_review", "edited", "reopened", "unlocked"
   - 定時掃描："0 21 \* \* 0" 為 UTC，台灣時間(UTC+8)為每週一 05:00AM
2. 觸發動作：
   - 掃描專案風險元件
   - 匯總成表格，記錄於該次 Action 的 `Scan vulnerabilities summary`，範例請見[此](https://github.com/nics-tw/petsard/actions/runs/14486961328/attempts/1#summary-40634415425)。
   - 當觸發條件為 Pull Request 且有掃描到風險元件時，將阻擋該次 Pull Request 直到風險元件已被移除或是更新到無風險的版本。

````yml
name: Scan Vulnerabilities
on:
  push:
  pull_request:
    types: ["ready_for_review", "edited", "reopened", "unlocked"]
  schedule:
    - cron: "0 21 * * 0"
  workflow_dispatch:

jobs:
  vuln-scan:
    name: Scan vulnerabilities
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@0.30.0
        with:
          scan-type: "fs"
          format: "table"
          vuln-type: "os,library"
          scanners: "vuln"
          output: "trivy-vuln.txt"
          severity: "UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL"
          hide-progress: true
          ignore-unfixed: true
          list-all-pkgs: false
        env:
          TRIVY_FORMAT: table # sometime the `with: format:` does not work, use env var to force assign
          TRIVY_DISABLE_VEX_NOTICE: true

      - name: Publish Trivy Output to Summary
        run: |
          cat trivy-vuln.txt && if [[ -s trivy-vuln.txt ]]; then
            {
              echo "### Security Output"
              echo "<details><summary>Click to expand</summary>"
              echo ""
              echo '```'
              cat trivy-vuln.txt
              echo '```'
              echo "</details>"
            } >> $GITHUB_STEP_SUMMARY
          fi

      - name: Block Pull Requests if there are any vuln issues
        uses: aquasecurity/trivy-action@0.30.0
        with:
          scan-type: "fs"
          vuln-type: "os,library"
          scanners: "vuln"
          severity: "UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL"
          hide-progress: true
          ignore-unfixed: true
          list-all-pkgs: false
          skip-setup-trivy: true
          exit-code: 1
````

### Dependabot version update

在元件依賴圖（dependency graph）更新後自動觸發，嚴格上來說不算 GitHub Action，但會因為 SBOM Generation 更新元件依賴圖後被連帶觸發，故特此一並介紹。

- Supported `package-ecosystem`，限制條件請見[此](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#package-ecosystem-)，列表最後更新於2025/04/06：
  - bun
  - bundler
  - cargo
  - composer
  - devcontainers
  - docker
  - docker-compose
  - dotnet-sdk
  - helm
  - mix
  - elm
  - gitsubmodule
  - github-action
  - gomod
  - gradle
  - maven
  - npm, pnpm, yarn
  - nuget
  - pip, pip-compile, pipenv, poetry
  - pub
  - swift
  - terraform
  - uv
- `directory`：元件記錄檔所在的資料夾，以下例的 gomod 區塊來說，可被更新的檔案位於 `doc_site` 資料夾內，故需設定為 `/doc_site`
- `schedule`：定期掃描之設定
- `reviewers`：Dependabot 檢查出可更新元件，發布 Pull Request 時的審核者，下例就分別設定為"CharlesChiuGit" 與 "matheme-justyn"
- `target-branch`：Dependabot 應掃描的開發分枝，下例設定為 dev，可依專案實際情況自行調整
- `labels`：Dependabot 發布 Pull Request 時帶上的標籤，可依專案實際情況自行調整
- 尚有許多選項可供客製化，詳請見[該文件](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference)，可依專案實際情況自行調整

```yml
# Please see the documentation for all configuration options:
# https://docs.github.com/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file

version: 2
updates:
  - package-ecosystem: "github-actions"
    #NOTE: no need to specify `/.github/workflows` for `directory`. use `directory: "/"`
    directory: "/"
    schedule:
      interval: "weekly"
      time: "07:00"
      timezone: Asia/Taipei
    reviewers:
      - "CharlesChiuGit"
    target-branch: "dev"
    commit-message:
      prefix: "chore(ci.deps)"
    groups:
      actions-dependencies:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"
    labels:
      - "ci"
      - "dependencies"

  - package-ecosystem: "gomod"
    directory: "/doc_site"
    schedule:
      interval: "weekly"
      time: "07:00"
      timezone: Asia/Taipei
    reviewers:
      - "CharlesChiuGit"
    target-branch: "dev"
    commit-message:
      prefix: "chore(doc.deps)"
    groups:
      doc_site-dependencies:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"
    labels:
      - "golang"
      - "dependencies"

  - package-ecosystem: "pip"
    directory: "/"
    insecure-external-code-execution: deny # [deny, allow]
    # set to 0 to disable dependabot version updates
    open-pull-requests-limit: 10
    schedule:
      interval: "weekly"
      time: "07:00"
      timezone: Asia/Taipei
    reviewers:
      - "matheme-justyn"
    target-branch: "dev"
    commit-message:
      prefix: "chore(pip.deps)"
      prefix-development: "chore(pip-dev.deps)"
    groups:
      pip-dependencies:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"
    labels:
      - "pip"
      - "python"
      - "dependencies"
```
