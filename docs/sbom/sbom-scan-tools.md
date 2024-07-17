## 操作流程
使用 Syft 及 Trivy 掃描專案產生 SBOM 檔案
使用 OSV-Scanner 掃描所有 Syft 及 Trivy 產生的 SBOM 檔案，輸出 markdown 格式報告
於 Excel 匯入 OSV-Scanner 產生的 markdown 格式報告，整理後，立即進行元件修補或緩解措施

Syft
v1.8.0
安裝
下載可執行檔 https://github.com/anchore/syft/releases
或執行
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sudo sh -s -- -b /usr/local/bin
產生 SBOM
輸出格式
https://github.com/anchore/syft/wiki/Output-Formats

輸出 SPDX 格式，為了使工具辨識該檔案為 SPDX SBOM，副檔名最好為 *.spdx.json，Syft 預設會最小化輸出檔案，加上 SYFT_FORMAT_PRETTY=true 會讓輸出的檔案比較易讀。
SYFT_FORMAT_PRETTY=true syft ./path/to/repo_dir -o spdx-json=./output_dir/syft.spdx.json

輸出 CycloneDX 格式，為了使工具辨識該檔案為 CycloneDX SBOM，副檔名最好為 *.cdx.json，Syft 預設會最小化輸出檔案，加上 SYFT_FORMAT_PRETTY=true 會讓輸出的檔案比較易讀。
SYFT_FORMAT_PRETTY=true syft ./path/to/repo_dir -o cyclonedx-json@1.5=./output_dir/syft.cdx.json

Trivy
v0.5.3
安裝
Trivy 安裝文件 https://aquasecurity.github.io/trivy/v0.53/getting-started/installation/
下載可執行檔 https://github.com/aquasecurity/trivy/releases
或執行
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sudo sh -s -- -b /usr/local/bin v0.53.0
產生 SBOM
輸出格式
https://google.github.io/osv-scanner/output/#output

輸出 SPDX 格式，為了使工具辨識該檔案為 SPDX SBOM，副檔名最好為 *.spdx.json。
trivy repo --format spdx-json --output ./sbom/trivy.spdx.json ./path/to/repo

輸出 CycloneDX 格式，為了使工具辨識該檔案為 CycloneDX SBOM，副檔名最好為 *.cdx.json。
trivy repo --format cyclonedx --output ./sbom/trivy.cdx.json ./path/to/repo
檢查 License
$ trivy fs --scanners license --license-full ./path/to/project

$ trivy fs --scanners license --license-full --format json -o result.json
 ./path/to/project

注意：建議將相關套件安裝後，trivy 命令才能收集完整相依套件資訊。以 npm 管理專案例，需先使用 npm install 命令後才能收集，若尚未將相依套件安裝，則會顯示以下提示資訊。
$ trivy fs --scanners license --license-full .
2024-07-10T03:51:45Z	INFO	Full license scanning is enabled
2024-07-10T03:51:47Z	INFO	[npm] To collect the license information of packages, "npm install" needs to be performed beforehand   dir="api/node_modules"
2024-07-10T03:51:47Z	INFO	[npm] To collect the license information of packages, "npm install" needs to be performed beforehand   dir="client/node_modules"
2024-07-10T03:51:47Z	INFO	[npm] To collect the license information of packages, "npm install" needs to be performed beforehand   dir="node_modules"
2024-07-10T03:51:47Z	INFO	[npm] To collect the license information of packages, "npm install" needs to be performed beforehand   dir="server/node_modules"
2024-07-10T03:51:47Z	INFO	Suppressing dependencies for development and testing. To display them, try the '--include-dev-deps' flag.
...
...




OSV-Scanner
v1.8.1
安裝
OSV-Scanner 安裝文件https://google.github.io/osv-scanner/installation/#installation
下載可執行檔 https://github.com/anchore/syft/releases
從 SBOM 檔案產生報告
輸出格式
https://google.github.io/osv-scanner/output/#output

輸出成 table 或 markdown 格式會比較易讀。
osv-scanner --sbom=./path/to/sbom/file --format=table --output=report.txt

輸出成 json 格式，資訊則會比較詳細。
osv-scanner --sbom=./path/to/sbom/file --format=json --output=report.json

掃描資料夾內的 SBOM，副檔名需為 *.spdx.json, *.cdx.json，請參考 SPDX 檔案命名規範 https://spdx.github.io/spdx-spec/v2.3/conformance/，以及 CycloneDX 檔案命名規範 https://cyclonedx.org/specification/overview/#recognized-file-patterns。
osv-scanner --format=markdown --output=report.md -r ./path/to/sbom_dir
離線模式
https://google.github.io/osv-scanner/experimental/offline-mode/

使用需要加上 --experimental-offline。
osv-scanner --experimental-offline --sbom=./path/to/sbom/file --format=json --output=report.json

下載資料庫，需再加上 --experimental-download-offline-databases。
osv-scanner --experimental-offline --experimental-download-offline-databases --sbom=./path/to/sbom/file --format=json --output=report.json
或是 手動下載 到 OSV資料庫資料夾。


OSV-Scanner 內建支援掃描一些程式語言，如果專案有使用 package manager，且沒有引用 jar 或 dll，可以考慮直接使用 OSV-Scanner 就好。（註：OSV-Scanner 不支援輸出 SBOM，有輸出 SBOM 檔案的需求，還是需要使用其他工具。）

報告檢視
因為各個 SBOM 掃描工具支援的語言、能解析的二進位檔 (Binary) 以及套件管理工具有所不同，能掃描到的依賴元件亦不盡相同，建議將所有工具產生的 SBOM 檔放在同一個資料夾，讓 OSV-Scanner 一併掃描。

打開 OSV-Scanner 產生的報告，刪除不必要的檔案來源路徑等資訊。



匯入報告：「資料」 -> 「從文字/CSV」 -> 「匯入」（檔案格式需選擇所有檔案）。

資料預覽視窗，點擊「載入」。



匯入完成。

整理資料
欄位調整：刪除空白欄後，用第二列取代第一列作為標題。



移除重複項目：「資料」 -> 「移除重複項」，選取 OSV URL、Package、Version。



排序：篩選 CVSS 分數 （7.0 以上為 High），由高到低排序。
註：若 Version 欄位為空值，表示 SBOM 工具未解析到該元件的版本資訊，可瀏覽 OSV URL，進一步檢視專案目前使用的的元件版本是否有相關漏洞。
