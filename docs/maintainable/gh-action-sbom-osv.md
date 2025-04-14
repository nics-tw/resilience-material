# GitHub Action for Generating SBOM and scanning Open Source Vulnerability

NOTE: 如有需要，可以參照有關 [GitHub Action 的名詞介紹](./ci-cd-guideline.md)。
使用 GitHub Action 自動生成 SBOM 並附加於 Release，並於 Pull Request 自動掃描 Open Source Vulnerability (OSV)。
以下的 GitHub Action 主要依賴於 [trivy](https://trivy.dev/latest/) 與 [trivy-action](https://github.com/aquasecurity/trivy-action)，`trivy-action` 目前可用於掃描 repo 與 container image ，請自行參照文件更改為貴專案需要的形式。

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

該 GitHub Action 會掃描專案中的元件組成並生成 SBOM ，更新元件依賴圖(dependency graph)，附加 `dependency.sbom.json` 於 Release 。

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

### dependabot Version Update

該項不是 Github Action ，但與 SBOM Generation 相關，故特以收錄，如有設定 `dependabot` ，建議可以作為輔助設定。
該項可以設定更新特定語言（本文件以 github-actions、golang 的 `gomod`、python 的 `pip` 為例）的自動更新，但與 dependabot Security Update 無關。

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
      - "XXX"
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
      - "XXX"
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
      - "XXX"
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
