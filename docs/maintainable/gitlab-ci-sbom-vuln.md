# CI/CD - 於 GitLab 上建立自動生成 SBOM 及漏洞掃描

使用 GitLab 平台所提供的 CI/CD 工具 GitLab CI/CD 設定每次程式碼更新自動觸發自動化的生成 SBOM 文件及透過 Trivy 工具進行漏洞掃描的自動化流程。

## 名詞介紹

### GitLab CI/CD

GitLab CI/CD 是 GitLab 內建的持續整合和持續交付（CI/CD）服務。此工具允許使用者在 Git repository 中定義自動化的工作流程，當特定事件發生時自動執行任務。以下簡介 GitLab CI/CD 功能：

1. **Pipeline（管線）**
   - Pipeline 是一系列自動化工作的集合，由 YAML 格式的 `.gitlab-ci.yml` 文件定義，存放在專案根目錄。
   - 每個 Pipeline 由多個 Stage（階段）組成，每個 Stage 包含一個或多個 Job（任務）。

2. **Stage（階段）**
   - Stage 是 Pipeline 中的執行階段，用於組織和控制 Job 的執行順序。
   - 同一個 Stage 中的 Job 會並行執行，而不同 Stage 會按順序執行。
   - 常見的 Stage 包括：build（建置）、test（測試）、deploy（部署）等。

3. **Job（任務）**
   - Job 是 Pipeline 中的基本執行單位，包含一系列要執行的指令。
   - 每個 Job 都在獨立的環境中執行，通常是 Docker 容器。
   - Job 可以設定觸發條件（rules）、依賴關係、並產生產出物（artifacts）。

4. **Runner（執行器）**
   - Runner 是執行 CI/CD Job 的服務，可以是 GitLab 提供的共享 Runner，或是自行架設的專用 Runner。
   - GitLab 提供多種作業系統的 Runner，包括 Linux、Windows 和 macOS。

5. **Artifacts（產出物）**
   - Job 執行完成後產生的文件，可以在不同 Job 間傳遞，或供使用者下載。
   - 可以設定保存期限和存取權限。

6. **Rules（規則）**
   - 用於定義 Job 的觸發條件，例如特定分支、標籤或合併請求時才執行。
   - 取代了舊版的 `only`/`except` 語法，提供更靈活的條件控制。

## 相關工具介紹

### Trivy

Trivy 是由 Aqua Security 開發的全方位安全掃描工具，支援：
- 漏洞掃描：檢測作業系統套件和應用程式依賴中的已知漏洞
- SBOM 生成：產生軟體物料清單，支援多種格式（SPDX、CycloneDX）
- 配置掃描：檢查 Dockerfile、Kubernetes 配置等安全問題
- 秘密掃描：偵測程式碼中的敏感資訊

### 支援的語言和生態系統

根據 Trivy 官方文檔，Trivy 支援廣泛的程式語言和套件管理器。分析的檔案會根據掃描目標而有所不同，主要分為兩類：**Pre-build**（如程式碼倉庫）會分析建置用檔案（如 lock files），**Post-build**（如容器映像檔）會分析已安裝的套件中繼資料。

| 語言 | 檔案類型 | 映像檔掃描 | 檔案系統掃描 |
|------|---------|:--------:|:--------:|
| **Ruby** | Gemfile.lock | ❌ | ✅ |
|          | gemspec | ✅ | ❌ |
| **Python** | Pipfile.lock | ❌ | ✅ |
|            | poetry.lock | ❌ | ✅ |
|            | uv.lock | ❌ | ✅ |
|            | requirements.txt | ❌ | ✅ |
|            | egg/wheel 套件 | ✅ | ❌ |
| **PHP** | composer.lock | ❌ | ✅ |
|         | installed.json | ✅ | ❌ |
| **Node.js** | package-lock.json | ❌ | ✅ |
|             | yarn.lock | ❌ | ✅ |
|             | pnpm-lock.yaml | ❌ | ✅ |
|             | bun.lock | ❌ | ✅ |
|             | package.json | ✅ | ❌ |
| **.NET** | packages.lock.json | ✅ | ✅ |
|          | packages.config | ✅ | ✅ |
|          | .deps.json | ✅ | ✅ |
|          | `*Packages.props` | ✅ | ✅ |
| **Java** | JAR/WAR/PAR/EAR | ✅ | ❌ |
|          | pom.xml | ❌ | ✅ |
|          | `*gradle.lockfile` | ❌ | ✅ |
|          | `*.sbt.lock` | ❌ | ✅ |
| **Go** | Go 二進位檔案 | ✅ | ❌ |
|        | go.mod | ❌ | ✅ |
| **Rust** | Cargo.lock | ✅ | ✅ |
|          | cargo-auditable 二進位 | ✅ | ❌ |
| **C/C++** | conan.lock | ❌ | ✅ |
| **Elixir** | mix.lock | ❌ | ✅ |
| **Dart** | pubspec.lock | ❌ | ✅ |
| **Swift** | Podfile.lock | ❌ | ✅ |
|           | Package.resolved | ❌ | ✅ |
| **Julia** | Manifest.toml | ✅ | ✅ |

**掃描類型說明**：
- **映像檔掃描**：掃描容器映像檔中已安裝的套件和二進位檔案
- **檔案系統掃描**：掃描檔案系統中的依賴描述檔案和鎖定檔案
- ✅ 表示該掃描類型支援此檔案格式
- ❌ 表示該掃描類型不支援此檔案格式

**重要注意事項**：
1. **檔案路徑不限制**：這些檔案可以位於專案的任何位置，Trivy 會自動偵測
2. **套件管理器多樣性**：同一語言可能支援多種套件管理器（如 Python 支援 pip、pipenv、poetry、uv）
3. **建置前後差異**：Pre-build 掃描主要分析 lock files，Post-build 掃描分析已安裝的套件中繼資料
4. **Go 特殊支援**：可以直接掃描 Go 編譯的二進位檔案，但不支援 UPX 壓縮的檔案
5. **自訂檔案模式**：可使用 file-patterns 配置來掃描非預設檔名的依賴檔案

## GitLab CI/CD 配置詳解

以下範例 `.gitlab-ci.yml` 文件包含三個主要功能：

### 整體結構

```yaml
stages:
  - sbom      # SBOM 生成階段
  - release   # 發布階段
  - security  # 安全掃描階段
```

### 1. SBOM 生成（generate-sbom）

此 Job 會在建立新標籤（tag）時自動觸發，生成專案的 SBOM 文件。

**觸發條件**：
- 當專案建立新的 Git 標籤時（相當於 GitHub 的 release）

**執行步驟**：
1. 使用 Trivy 官方 Docker 映像檔（`aquasec/trivy:latest`）
2. 清空 entrypoint 以便執行自定義指令
3. 掃描專案目錄，生成 SPDX JSON 格式的 SBOM 文件
4. 將 SBOM 文件保存為 Artifact，保存 30 天
5. 設定 GitLab 的 dependency_scanning 報告，讓 GitLab 可以解析 SBOM

```yaml
generate-sbom:
  stage: sbom
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]  # 清空 entrypoint 以執行自定義指令
  rules:
    - if: $CI_COMMIT_TAG  # 當有新標籤時觸發
  script:
    - trivy --version  # 顯示版本資訊
    - trivy fs --format spdx-json --output dependency.spdx.json .
  artifacts:
    name: "trivy-sbom-$CI_COMMIT_SHORT_SHA"
    paths:
      - dependency.spdx.json
    expire_in: 30 days
    reports:
      dependency_scanning: dependency.spdx.json  # GitLab 可解析的 SBOM 報告
```

### 2. 附加 SBOM 到發布版本（attach-sbom-to-release）

此 Job 會將生成的 SBOM 文件附加到 GitLab 的 Release 中。

**執行步驟**：
1. 使用 GitLab 官方的 glab CLI 工具
2. 使用 Job Token 進行身份驗證
3. 建立新的 Release
4. 將 SBOM 文件上傳到 Release 附件

```yaml
attach-sbom-to-release:
  stage: release
  image: gitlab/glab:latest
  rules:
    - if: $CI_COMMIT_TAG
  script:
    - glab auth login --job-token $CI_JOB_TOKEN
    - glab release create $CI_COMMIT_TAG
    - glab release upload $CI_COMMIT_TAG dependency.spdx.json
```

### 3. 漏洞掃描（vuln-scan）

此 Job 會掃描專案中的安全漏洞，並在發現高風險漏洞時阻止 Pipeline 繼續執行。

**觸發條件**：
- 程式碼推送時
- 建立合併請求（Merge Request）時
- 定時掃描（需在 GitLab 專案設定中配置排程）

**執行步驟**：
1. 使用 Trivy 官方 Docker 映像檔
2. 進行第一次掃描，產生表格格式報告
3. 顯示掃描結果到 console
4. 進行第二次掃描，如發現漏洞則讓 Job 失敗
5. 在 after_script 中生成 JSON 格式報告
6. 保存掃描結果為 Artifact

```yaml
vuln-scan:
  stage: security
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  rules:
    - if: $CI_PIPELINE_SOURCE == "push"
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_PIPELINE_SOURCE == "schedule"
  script:
    # 第一次掃描：生成表格格式報告
    - |
      echo "Running Trivy vulnerability scanner..."
      trivy fs \
        --format table \
        --vuln-type os,library \
        --scanners vuln \
        --output trivy-vuln.txt \
        --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
        --ignore-unfixed \
        --no-progress \
        .
    
    # 顯示掃描結果
    - |
      echo "=== Trivy Vulnerability Scan Results ==="
      cat trivy-vuln.txt
    
    # 第二次掃描：檢查漏洞並在發現時讓 Job 失敗
    - |
      echo "Checking for vulnerabilities that should block the pipeline..."
      trivy fs \
        --vuln-type os,library \
        --scanners vuln \
        --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
        --ignore-unfixed \
        --no-progress \
        --exit-code 1 \
        .
  artifacts:
    name: "trivy-vuln-$CI_COMMIT_SHORT_SHA"
    paths:
      - trivy-vuln.txt
      - trivy-report.json
    expire_in: 7 days
    when: always  # 即使 Job 失敗也保存 Artifact
  after_script:
    # 生成 JSON 格式報告（即使主要掃描失敗也會執行）
    - |
      trivy fs \
        --format json \
        --vuln-type os,library \
        --scanners vuln \
        --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
        --ignore-unfixed \
        --no-progress \
        --output trivy-report.json \
        . || true
  variables:
    TRIVY_FORMAT: table
    TRIVY_DISABLE_VEX_NOTICE: "true"
  allow_failure:
    exit_codes: 1  # 允許因漏洞發現而失敗，但仍顯示結果
```

### 檢視 Job Log 與 Artifacts

於專案左側欄位的 `Build` -> `Jobs` -> 選擇待檢視的 `Job` ->  Log 中可以檢視 `Job` 執行過程。

於 `Job Log` 右側有 `Job artifacts` 欄位，可根據需求選擇 `Download` 或 `Browse`可檢視 `trivy-vuln.txt` 與 `trivy-report.json`。 

## 重要配置說明

### 環境變數

GitLab CI/CD 提供許多內建環境變數：
- `$CI_COMMIT_TAG`：當前 commit 的標籤名稱
- `$CI_COMMIT_SHORT_SHA`：Git commit 的短版本 SHA
- `$CI_JOB_TOKEN`：Job 執行時的臨時存取權杖
- `$CI_PIPELINE_SOURCE`：Pipeline 觸發來源

### Rules 條件說明

- `if: $CI_COMMIT_TAG`：當 commit 有標籤時觸發
- `if: $CI_PIPELINE_SOURCE == "push"`：程式碼推送時觸發
- `if: $CI_PIPELINE_SOURCE == "merge_request_event"`：合併請求時觸發
- `if: $CI_PIPELINE_SOURCE == "schedule"`：定時任務觸發

### Artifacts 配置

- `name`：Artifact 的名稱，可使用變數
- `paths`：要保存的檔案路徑
- `expire_in`：保存期限
- `when: always`：無論 Job 成功或失敗都保存
- `reports`：特殊報告類型，GitLab 可以解析並在 UI 中顯示

## 與 GitHub Actions 的差異

| 功能 | GitHub Actions | GitLab CI/CD |
|------|----------------|--------------|
| 配置檔案 | `.github/workflows/*.yml` | `.gitlab-ci.yml` |
| 執行單位 | Workflow → Job → Step | Pipeline → Stage → Job |
| 觸發條件 | `on:` | `rules:` |
| 產出物 | `actions/upload-artifact` | `artifacts:` |
| 環境變數 | `${{ github.* }}` | `$CI_*` |
| 條件執行 | `if:` | `rules:` |

## 最佳實踐建議

1. **分階段執行**：將相關的 Job 組織到適當的 Stage 中，確保執行順序
2. **快取使用**：對於重複安裝的套件，可使用 GitLab 的 cache 機制提升效率
3. **安全掃描**：在合併請求階段進行安全掃描，確保程式碼品質
4. **Artifact 管理**：合理設定 Artifact 保存期限，避免佔用過多儲存空間
5. **環境隔離**：使用不同的 Docker image 為不同用途的 Job 提供適當的執行環境

---

## 完整 `.gitlab-ci.yml`

```yaml
# GitLab CI configuration for generating SBOM
stages:
  - sbom
  - release
  - security

generate-sbom:
  stage: sbom
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  rules:
    # 當創建新的 tag 時觸發（相當於 GitHub 的 release published）
    - if: $CI_COMMIT_TAG
  script:
    - trivy --version
    # 生成 SBOM (SPDX JSON 格式)
    - trivy fs --format spdx-json --output dependency.spdx.json .
  artifacts:
    name: "trivy-sbom-$CI_COMMIT_SHORT_SHA"
    paths:
      - dependency.spdx.json
    expire_in: 30 days # 相當於 GitHub 的 retention-days
    reports:
      # GitLab 可以解析 SBOM 報告
      dependency_scanning: dependency.spdx.json

attach-sbom-to-release:
  stage: release
  image: gitlab/glab:latest
  rules:
    - if: $CI_COMMIT_TAG
  script:
    - glab auth login --job-token $CI_JOB_TOKEN
    - glab release create $CI_COMMIT_TAG
    - glab release upload $CI_COMMIT_TAG dependency.spdx.json

vuln-scan:
  stage: security
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  rules:
    # 在所有 push 時觸發
    - if: $CI_PIPELINE_SOURCE == "push"
    # 在 merge request 時觸發（相當於 pull_request）
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    # 定時任務（每週日晚上 9 點）
    - if: $CI_PIPELINE_SOURCE == "schedule"
  script:
    # 第一次掃描：生成報告用於顯示
    - |
      echo "Running Trivy vulnerability scanner..."
      trivy fs \
        --format table \
        --vuln-type os,library \
        --scanners vuln \
        --output trivy-vuln.txt \
        --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
        --ignore-unfixed \
        --no-progress \
        .

    # 顯示掃描結果
    - |
      echo "=== Trivy Vulnerability Scan Results ==="
      cat trivy-vuln.txt

    # 第二次掃描：用於檢查是否有漏洞（會導致 job 失敗）
    - |
      echo "Checking for vulnerabilities that should block the pipeline..."
      trivy fs \
        --vuln-type os,library \
        --scanners vuln \
        --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
        --ignore-unfixed \
        --no-progress \
        --exit-code 1 \
        .
  artifacts:
    name: "trivy-vuln-$CI_COMMIT_SHORT_SHA"
    paths:
      - trivy-vuln.txt
      - trivy-report.json
    expire_in: 7 days
    when: always
  after_script:
    - |
      trivy fs \
        --format json \
        --vuln-type os,library \
        --scanners vuln \
        --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
        --ignore-unfixed \
        --no-progress \
        --output trivy-report.json \
        . || true
  variables:
    TRIVY_FORMAT: table
    TRIVY_DISABLE_VEX_NOTICE: "true"
  # 允許在 merge request 中失敗但仍顯示結果
  allow_failure:
    exit_codes: 1
```

