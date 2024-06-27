# CI/CD - 於 GitHub 上建立自動生成 SBOM 及漏洞掃描

使用 GitHub 平台所提供的 CI/CD 工具 GitHub Action 訂立每次程式碼更新自動觸發自動化的生成 SBOM 文件及透過 OSV 工具自動化流程。以下範例將以 [sbom2vans](https://github.com/nics-tw/sbom2vans) 專案為例。

## 名詞介紹

### GitHub Actions

GitHub Actions 是 GitHub 提供的一項持續整合和持續交付（CI/CD）服務。此工具允許使用者於 git repository 中客製化的 workflow ，以便在特定事件發生時自動執行任務。以下簡介 GitHub Actions 功能介紹：

1. Workflow
    - workflow 是一系列定義的自動化步驟，由 YAML 格式文件所紀錄，通常存放在 `.github/workflows/` 目錄下。
    - 每個 workflow 由 Event、Job 和 Step 所組成。
2. Event
    - Event 是指觸發 workflow 的事件。這些事件可以是推送程式碼、pull request、release 等。例如，當有人將程式碼推送到 main branch 時，可以觸發一個 workflow 來進行測試和部署。
3. Job
    - Job 是 workflow 中的一個執行單位，包含一系列的 steps。每個 step 是一個可執行的 Shell 腳本，或是一個可執行的　Action。
    - Job 可以在不同的 runner 上執行，這些 runner 由　GitHub 提供的或是 self-hosted runner
4. Action：
    - GitHub Actions 平台上的自定義應用程式，用於執行複雜但經常重複的任務。
    - GitHub Marketplace　提供了大量預設的 Action，也可以自行開發定義的　Actio　n來滿足特定需求。
5. Runner
    - Runner 是一個在工作流程觸發時運行你的工作流程的伺服器。每個 Runner 一次只能運行一個作業。GitHub 提供 Ubuntu Linux、Microsoft Windows 和 macOS  Runner 來運行你的工作流程


### OSV（Open Source Vulnerability）

一款由 Google 開源漏洞（Open Source Vulnerability，OSV）資料庫，透過 OSV 格式存儲漏洞資訊。OSV-Scanner 會基於 OSV 資料庫評估專案的依賴關係，顯示與專案相關的所有漏洞，開發人員可以快速查詢其軟體組件是否存在已知的安全問題。本示範將使用 [osv-scanner GitHub Action](https://google.github.io/osv-scanner/github-action/) 自動掃描專案是否具有漏洞。

## 以 sbom2vans 專案為例

sbom2vans 專案為　golang 語言撰寫之 CLI 工具。於 [.github/workflows](https://github.com/nics-tw/sbom2vans/tree/main/.github/workflows) 定義了三個 workflow

1. [lint](https://github.com/nics-tw/sbom2vans/blob/main/.github/workflows/lint.yml)
2. [osv-scanner](https://github.com/nics-tw/sbom2vans/blob/main/.github/workflows/osv-scanner-scheduled.yml)
3. [release](https://github.com/nics-tw/sbom2vans/blob/main/.github/workflows/release.yml)

### （一）lint

建議可以依據專案程式語言選定該 linter 工具，多數 linter 工具有都具有檢查是否符合該程式語言最佳實踐寫法，如避免函式名稱過長、是否標示分號、是否有定義變數或函式而沒有使用等常見問題。

此專案 workflow 定義於每次程式碼更新時（[on.push](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushbranchestagsbranches-ignoretags-ignore)）觸發以下 jobs：
1. 使用 golang 選定 [golangci](https://github.com/golangci/golangci-lint) 為 linter 工具。
2. golang 自身提供 [govulncheck](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck) 套件檢視是否具有已知漏洞問題。

```
jobs:
  # From https://github.com/golangci/golangci-lint-action
  golangci:
    permissions:
      contents: read # for actions/checkout to fetch code
      pull-requests: read # for golangci/golangci-lint-action to fetch pull requests
    name: lint
    strategy:
      matrix:
        os:
          - linux
          - mac
          - windows

        include:
        - os: linux
          OS_LABEL: ubuntu-latest

        - os: mac
          OS_LABEL: macos-14

        - os: windows
          OS_LABEL: windows-latest

    runs-on: ${{ matrix.OS_LABEL }}

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '~1.22.3'
          check-latest: true

      - name: golangci-lint
        uses: golangci/golangci-lint-action@v5
        with:
          version: v1.55

          # Windows times out frequently after about 5m50s if we don't set a longer timeout.
          args: --timeout 10m

          # Optional: show only new issues if it's a pull request. The default value is `false`.
          # only-new-issues: true

  govulncheck:
    runs-on: ubuntu-latest
    steps:
      - name: govulncheck
        uses: golang/govulncheck-action@v1
        with:
          go-version-input: '~1.22.3'
          check-latest: true
```

### （二）osv-scanner

參考 [OSV-Scanner GitHub Action](https://google.github.io/osv-scanner/github-action/) 說明，引用 google/osv-scanner-action/.github/workflows/osv-scanner-reusable.yml@v1.7.1 定義 template。

在觸發 Event 上特別多定義：
- on.schedule 定期進行弱點掃描。倘若專案進入維護其後，須定期檢視是否有新的漏洞需要盡早修復。GitHub Action 提供 cronjob 語法，此範例為每週一 00:00 分觸發掃描。
- on.pull_request 及 merge_group：依照一般開發流程通常會分為 main branch 及 dev branch，若在 dev branch 開發完後需要建立 pull request 才能進行 merge，因此也於這兩種場景增加卡關，確認無 CVE 漏洞後才能進行合併進 main branch


```
name: OSV-Scanner Scan

on:
  schedule:
    - cron: "0 0 * * 1" # At 00:00 on Monday
  # Change "main" to your default branch if you use a different name, i.e. "master"
  push:
    branches:
      - main
      - dev
  pull_request:
    branches: [main]
  merge_group:
    branches: [main]

permissions:
  # Require writing security events to upload SARIF file to security tab
  security-events: write
  # Only need to read contents
  contents: read

jobs:
  scan-scheduled:
    uses: "google/osv-scanner-action/.github/workflows/osv-scanner-reusable.yml@v1.7.1"
```

### （三）release

此專案 release workflow 定義於每次程式碼更新時（[on.push.tags](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushbranchestagsbranches-ignoretags-ignore)）（[tag 格式為 semantic](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#patterns-to-match-branches-and-tags)）觸發以下 jobs：
1. 透過 [Trivy 工具產生 SBOM 並自動上傳](https://github.com/aquasecurity/trivy-action?tab=readme-ov-file#using-trivy-to-generate-sbom)至 [GitHub Dependency Graph](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-dependency-graph)。
2. 將此專案 build golang binaries 並上傳至 [release 頁面](https://github.com/nics-tw/sbom2vans/releases/)。



```
jobs:
 name: Release

on:
  push:
    tags:
      - 'v[0-9].[0-9]+.[0-9]+'
      - 'v[0-9].[0-9]+.[0-9]+-dev'

jobs:
  build:
    permissions:
      packages: write
      contents: write
    environment: production
    strategy:
      fail-fast: false
      matrix:
        goos:
          - 'linux'
          - 'windows'
          - 'darwin'
        goarch:
          - 'amd64'
          - 'arm64'
        go:
          - '1.22'

        include:
        # Set the minimum Go patch version for the given Go minor
        # Usable via ${{ matrix.GO_SEMVER }}
        - go: '1.22'
          GO_SEMVER: '~1.22.1'

    runs-on: ubuntu-latest
    continue-on-error: true
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Release
        uses: softprops/action-gh-release@v2

      - name: Run Trivy in GitHub SBOM mode and submit results to Dependency Graph
        uses: aquasecurity/trivy-action@0.20.0
        with:
          scan-type: 'fs'
          format: 'github'
          output: 'dependency-results.sbom.json'
          image-ref: '.'
          github-pat: ${{ secrets.GITHUB_TOKEN }}

      - name: Push binaries to Github Release Assets
        uses: wangyoucao577/go-release-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          goos: ${{ matrix.goos }}
          goarch: ${{ matrix.goarch }}
          goversion: "1.22"
          project_path: "./cmd/sbom2vans"
          binary_name: "sbom2vans"
```
