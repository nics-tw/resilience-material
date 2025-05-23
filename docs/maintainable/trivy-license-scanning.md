# 如何透過 trivy 掃描專案內元件授權

為確保專案符合所使用元件之授權範圍，使用者應具備獨立驗證授權的流程。建議使用者參考以下流程與範本，管理並確認專案元件所使用的授權。

注意事項，以下三種情形會導致 trivy 無法完整掃描專案元件：

1. 元件安裝環境混亂：部分開發習慣不佳的開發人員於電腦上安裝元件時，有些安裝在專案資料夾，有些安裝在整台電腦的共用空間，導致不清楚專案實際使用哪些元件，也就無法確認元件的授權。如有些元件用 `npm install`，有些則用 `npm install --global`，則用 `npm install --global` 安裝的元件不會顯示專案依賴列表內。
2. 網路引用但未紀錄：在開發一些網路專案時，有時會使用已經分佈在內容交付網路（CDN）上的元件，該種元件因不需安裝於專案資料夾也可能導致無法正確透過 trivy 確認其授權。
3. 直接複製元件檔案：部分法律意識淡薄的開發人員在開發專案時會直接講其他人的部分元件檔案（如DLL檔與函式庫檔案等）複製至專案內使用，而不是透過正當管道安裝，這會無法確認元件是否允許該種使用方式，極容易造成侵權問題。

為什麼以上三種情形容易造成風險？

- 可能在不知情的情況下使用付費軟體
- 可能違法元件使用條款，面臨法律風險
- 上級單位無法準確評估專案成本和合規風險
- 元件出現安全漏洞時，無法即時更新或修補

## 流程簡介

1. 建立專案正式環境
2. 掃描元件在正式環境所使用的授權
3. 結果分析

## 名詞介紹

- 正式環境（production environment）：專案正式運作的軟體環境，包含元件, 執行檔, 動態連結庫等。為確保運作時不受到作業系統的影響，會盡可能使用環境管理工具製造虛擬環境（virtual environment）與作業系統隔離。
- 依賴文件（lock file）：在不同程式碼生態系統中，依賴文件有不同的名稱，如 npm 的 package-lock.json, Cargo 的 Cargo.lock。主要功能為使不同開發環境保持依賴版本一致，防止意外升級依賴套件，提供可重現的軟體環境。總體而言，依賴文件是一種用於版本固定和依賴管理的特殊配置文件。
- 授權（license）：指軟體套件的使用授權模式，規定軟體的使用、分發和修改權限。常見授權類型：
  - 開源授權：可自由使用、修改、分發，需遵守特定條件
  - 商業授權：需付費使用，有明確使用限制
  - 免費授權：無需付費，可能有使用範圍限制
- 授權感染：因某些元件的授權要求使用該元件開發的軟體也保持開源，若不開源則違反元件授權。授權感染也具備連鎖性，若是元件的元件使用該種授權，則專案也必須必須保持開源。

## 建立專案正式環境

以 [PETsARD](https://github.com/nics-tw/petsard) 專案為例:

透過 `uv` 設定 python 環境

```sh
uv python install 3.11
uv venv
source .venv/bin/activate
```

透過 `uv` 與依賴文件（此處為 requirments.txt）安裝 python 元件

```sh
uv pip install -r requirments.txt
```

## 掃描元件在正式環境所使用的授權

以 `trivy` 掃描元件所使用的授權

```sh
trivy repo . --scanners license --license-full
```

掃描後的結果

```txt
2025-05-22T15:20:28+08:00       INFO    [license] Full license scanning is enabled
2025-05-22T15:21:38+08:00       INFO    [python] Licenses acquired from one or more METADATA files may be subject to additional terms. Use `--debug` flag to see all affected packages.
2025-05-22T15:21:38+08:00       INFO    Suppressing dependencies for development and testing. To display them, try the '--include-dev-deps' flag.

Report Summary

┌───────────────────────┬──────┬──────────┐
│        Target         │ Type │ Licenses │
├───────────────────────┼──────┼──────────┤
│ requirements.txt      │  -   │    44    │
├───────────────────────┼──────┼──────────┤
│ Loose File License(s) │  -   │   149    │
└───────────────────────┴──────┴──────────┘
Legend:
- '-': Not scanned
- '0': Clean (no security findings detected)


requirements.txt (license)

Total: 44 (UNKNOWN: 5, LOW: 37, MEDIUM: 2, HIGH: 0, CRITICAL: 0)

┌───────────────┬──────────────────────────────────────┬────────────────┬──────────┐
│    Package    │               License                │ Classification │ Severity │
├───────────────┼──────────────────────────────────────┼────────────────┼──────────┤
│ anonymeter    │ BSD License                          │ Notice         │ LOW      │
├───────────────┼──────────────────────────────────────┤                │          │
│ boto3         │ Apache Software License              │                │          │
├───────────────┤                                      │                │          │
│ botocore      │                                      │                │          │
├───────────────┼──────────────────────────────────────┼────────────────┼──────────┤
│ certifi       │ Mozilla Public License 2.0 (MPL 2.0) │ Reciprocal     │ MEDIUM   │
├───────────────┼──────────────────────────────────────┼────────────────┼──────────┤
│ cloudpickle   │ BSD License                          │ Notice         │ LOW      │
├───────────────┼──────────────────────────────────────┼────────────────┼──────────┤
│ copulas       │ Free for non-commercial use          │ Non Standard   │ UNKNOWN  │
├───────────────┤                                      │                │          │
│ ctgan         │                                      │                │          │
├───────────────┤                                      │                │          │
│ deepecho      │                                      │                │          │
├───────────────┼──────────────────────────────────────┼────────────────┼──────────┤
│ faker         │ MIT License                          │ Notice         │ LOW      │
├───────────────┼──────────────────────────────────────┼────────────────┤          │
│ filelock      │ Unlicense                            │ Unencumbered   │          │
├───────────────┼──────────────────────────────────────┼────────────────┤          │
│ fsspec        │ BSD License                          │ Notice         │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ graphviz      │ MIT License                          │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ idna          │ BSD License                          │                │          │
├───────────────┤                                      │                │          │
│ jinja2        │                                      │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ jmespath      │ MIT License                          │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ joblib        │ BSD License                          │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ llvmlite      │ BSD                                  │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ markupsafe    │ BSD License                          │                │          │
├───────────────┤                                      │                │          │
│ mpmath        │                                      │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ narwhals      │ MIT License                          │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ networkx      │ BSD License                          │                │          │
├───────────────┤                                      │                │          │
│ numba         │                                      │                │          │
├───────────────┤                                      │                │          │
│ numpy         │                                      │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ packaging     │ Apache Software License              │                │          │
│               ├──────────────────────────────────────┤                │          │
│               │ BSD License                          │                │          │
├───────────────┤                                      │                │          │
│ pandas        │                                      │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ platformdirs  │ MIT                                  │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ plotly        │ MIT License                          │                │          │
├───────────────┤                                      │                │          │
│ pytz          │                                      │                │          │
├───────────────┤                                      │                │          │
│ pyyaml        │                                      │                │          │
├───────────────┼──────────────────────────────────────┼────────────────┼──────────┤
│ rdt           │ Free for non-commercial use          │ Non Standard   │ UNKNOWN  │
├───────────────┼──────────────────────────────────────┼────────────────┼──────────┤
│ requests      │ Apache Software License              │ Notice         │ LOW      │
├───────────────┤                                      │                │          │
│ s3transfer    │                                      │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ scipy         │ BSD License                          │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ sdmetrics     │ MIT License                          │                │          │
├───────────────┼──────────────────────────────────────┼────────────────┼──────────┤
│ sdv           │ Free for non-commercial use          │ Non Standard   │ UNKNOWN  │
├───────────────┼──────────────────────────────────────┼────────────────┼──────────┤
│ six           │ MIT License                          │ Notice         │ LOW      │
├───────────────┼──────────────────────────────────────┤                │          │
│ sympy         │ BSD License                          │                │          │
├───────────────┤                                      │                │          │
│ threadpoolctl │                                      │                │          │
├───────────────┤                                      │                │          │
│ torch         │                                      │                │          │
├───────────────┼──────────────────────────────────────┤                │          │
│ tqdm          │ MIT License                          │                │          │
│               ├──────────────────────────────────────┼────────────────┼──────────┤
│               │ Mozilla Public License 2.0 (MPL 2.0) │ Reciprocal     │ MEDIUM   │
├───────────────┼──────────────────────────────────────┼────────────────┼──────────┤
│ tzdata        │ Apache Software License              │ Notice         │ LOW      │
├───────────────┼──────────────────────────────────────┤                │          │
│ urllib3       │ MIT                                  │                │          │
└───────────────┴──────────────────────────────────────┴────────────────┴──────────┘

Loose File License(s) (license)

Total: 149 (UNKNOWN: 21, LOW: 119, MEDIUM: 2, HIGH: 7, CRITICAL: 0)

┌────────────────┬──────────┬──────────────────────────────┬──────────────────────────────────────────────────────────────┐
│ Classification │ Severity │           License            │                        File Location                         │
├────────────────┼──────────┼──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Restricted     │ HIGH     │ GPL-3.0                      │ .venv/lib/python3.11/site-packages/numpy-1.26.4.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy-1.15.2.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ GPL-3.0-with-GCC-exception   │ .venv/lib/python3.11/site-packages/numpy-1.26.4.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy-1.15.2.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ LGPL-2.1                     │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          ├──────────────────────────────┤                                                              │
│                │          │ LGPL-3.0                     │                                                              │
│                │          │                              │                                                              │
├────────────────┼──────────┼──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Reciprocal     │ MEDIUM   │ MPL-2.0                      │ .venv/lib/python3.11/site-packages/certifi-2025.1.31.dist-i- │
│                │          │                              │ nfo/LICENSE                                                  │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/tqdm-4.67.1.dist-info/LI- │
│                │          │                              │ CENCE                                                        │
├────────────────┼──────────┼──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Unencumbered   │ LOW      │ Unlicense                    │ .venv/lib/python3.11/site-packages/filelock-3.18.0.dist-inf- │
│                │          │                              │ o/licenses/LICENSE                                           │
├────────────────┤          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Notice         │          │ Apache-2.0                   │ .venv/lib/python3.11/site-packages/boto3-1.37.36.dist-info/- │
│                │          │                              │ LICENSE                                                      │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/botocore-1.37.36.dist-in- │
│                │          │                              │ fo/LICENSE.txt                                               │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/pandas-2.2.3.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/python_dateutil-2.9.0.po- │
│                │          │                              │ st0.dist-info/LICENSE                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/requests-2.32.3.dist-inf- │
│                │          │                              │ o/LICENSE                                                    │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/s3transfer-0.11.5.dist-i- │
│                │          │                              │ nfo/LICENSE.txt                                              │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/utils/viz/_cycles.- │
│                │          │                              │ py                                                           │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/tzdata-2025.2.dist-info/- │
│                │          │                              │ licenses/LICENSE                                             │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ BSD-2-Clause                 │ .venv/lib/python3.11/site-packages/llvmlite-0.44.0.dist-inf- │
│                │          │                              │ o/LICENSE                                                    │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/numba-0.61.2.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/numpy/_utils/_pep440.py   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/pandas-2.2.3.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/_lib/_pep440.py     │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/_lib/decorator.py   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/integrate/_lebedev- │
│                │          │                              │ .py                                                          │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sklearn/externals/_packa- │
│                │          │                              │ ging/_structures.py                                          │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sklearn/externals/_packa- │
│                │          │                              │ ging/version.py                                              │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ BSD-3-Clause                 │ .venv/lib/python3.11/site-packages/MarkupSafe-3.0.2.dist-in- │
│                │          │                              │ fo/LICENSE.txt                                               │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/cloudpickle/cloudpickle.- │
│                │          │                              │ py                                                           │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/fsspec-2025.3.2.dist-inf- │
│                │          │                              │ o/licenses/LICENSE                                           │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/idna-3.10.dist-info/LICE- │
│                │          │                              │ NSE.md                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/jinja2-3.1.6.dist-info/l- │
│                │          │                              │ icenses/LICENSE.txt                                          │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/joblib-1.4.2.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/joblib/externals/cloudpi- │
│                │          │                              │ ckle/cloudpickle.py                                          │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/mpmath-1.3.0.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/networkx-3.4.2.dist-info- │
│                │          │                              │ /LICENSE.txt                                                 │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/numba/cloudpickle/cloudp- │
│                │          │                              │ ickle.py                                                     │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/numpy-1.26.4.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/numpy/ma/LICENSE          │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/numpy/random/LICENSE.md   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/pandas-2.2.3.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/python_dateutil-2.9.0.po- │
│                │          │                              │ st0.dist-info/LICENSE                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy-1.15.2.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/_lib/_uarray/LICEN- │
│                │          │                              │ SE                                                           │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/cluster/hierarchy.- │
│                │          │                              │ py                                                           │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/cluster/tests/test- │
│                │          │                              │ _hierarchy.py                                                │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/fft/_pocketfft/LIC- │
│                │          │                              │ ENSE.md                                                      │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/interpolate/_bary_- │
│                │          │                              │ rational.py                                                  │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/interpolate/_rbf.py │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/interpolate/tests/- │
│                │          │                              │ test_bary_rational.py                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/linalg/interpolati- │
│                │          │                              │ ve.py                                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/linalg/tests/test_- │
│                │          │                              │ interpolative.py                                             │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/ndimage/__init__.py │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/ndimage/_filters.py │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/ndimage/_fourier.py │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/ndimage/_interpola- │
│                │          │                              │ tion.py                                                      │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/ndimage/_measureme- │
│                │          │                              │ nts.py                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/ndimage/_morpholog- │
│                │          │                              │ y.py                                                         │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/ndimage/_ni_suppor- │
│                │          │                              │ t.py                                                         │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/signal/_upfirdn.py  │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/signal/tests/test_- │
│                │          │                              │ upfirdn.py                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/sparse/linalg/_iso- │
│                │          │                              │ lve/lsqr.py                                                  │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/spatial/tests/test- │
│                │          │                              │ _distance.py                                                 │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/special/_spfun_sta- │
│                │          │                              │ ts.py                                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/stats/_qmvnt.py     │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/stats/tests/data/_- │
│                │          │                              │ mvt.py                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sklearn/cluster/_hdbscan- │
│                │          │                              │ /hdbscan.py                                                  │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sklearn/svm/src/liblinea- │
│                │          │                              │ r/COPYRIGHT                                                  │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sympy-1.13.1.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/threadpoolctl-3.6.0.dist- │
│                │          │                              │ -info/licenses/LICENSE                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/include/ATen/core/- │
│                │          │                              │ MT19937RNGEngine.h                                           │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/include/ATen/nativ- │
│                │          │                              │ e/Math.h                                                     │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/include/c10/util/i- │
│                │          │                              │ nt128.h                                                      │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/utils/_sympy/funct- │
│                │          │                              │ ions.py                                                      │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ BSD-3-Clause-Clear           │ .venv/lib/python3.11/site-packages/anonymeter-1.0.0.dist-in- │
│                │          │                              │ fo/LICENSE.md                                                │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/networkx/algorithms/cent- │
│                │          │                              │ rality/second_order.py                                       │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ BSD-4-Clause                 │ .venv/lib/python3.11/site-packages/torch/utils/benchmark/ut- │
│                │          │                              │ ils/valgrind_wrapper/callgrind.h                             │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/utils/benchmark/ut- │
│                │          │                              │ ils/valgrind_wrapper/valgrind.h                              │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ BSL-1.0                      │ .venv/lib/python3.11/site-packages/scipy/special/xsf/cephes- │
│                │          │                              │ /scipy_iv.h                                                  │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/include/c10/util/h- │
│                │          │                              │ ash.h                                                        │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ MIT                          │ .venv/bin/activate.fish                                      │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/bin/activate_this.py                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/PyYAML-6.0.2.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/_plotly_utils/png.py      │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/botocore/vendored/six.py  │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/charset_normalizer-3.4.1- │
│                │          │                              │ .dist-info/LICENSE                                           │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/faker-37.1.0.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/functorch/einops/_parsin- │
│                │          │                              │ g.py                                                         │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/graphviz-0.20.3.dist-inf- │
│                │          │                              │ o/LICENSE.txt                                                │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/jmespath-1.0.1.dist-info- │
│                │          │                              │ /LICENSE.txt                                                 │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/narwhals-1.35.0.dist-inf- │
│                │          │                              │ o/licenses/LICENSE.md                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/numba/cpython/new_hashin- │
│                │          │                              │ g.py                                                         │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/numba/cpython/old_hashin- │
│                │          │                              │ g.py                                                         │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/packaging/licenses/__ini- │
│                │          │                              │ t__.py                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/pandas-2.2.3.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/platformdirs-4.3.7.dist-- │
│                │          │                              │ info/licenses/LICENSE                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/plotly-6.0.1.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/pytz-2025.2.dist-info/LI- │
│                │          │                              │ CENSE.txt                                                    │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/io/_idl.py          │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/optimize/_lbfgsb_p- │
│                │          │                              │ y.py                                                         │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy/optimize/_tnc.py    │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sdmetrics-0.18.0.dist-in- │
│                │          │                              │ fo/LICENSE                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/six-1.17.0.dist-info/LIC- │
│                │          │                              │ ENSE                                                         │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/six.py                    │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sklearn/externals/_arff.- │
│                │          │                              │ py                                                           │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sympy-1.13.1.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sympy/ntheory/bbp_pi.py   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sympy/parsing/latex/LICE- │
│                │          │                              │ NSE.txt                                                      │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/_appdirs.py         │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/include/ATen/nativ- │
│                │          │                              │ e/Distributions.h                                            │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/include/ATen/nativ- │
│                │          │                              │ e/Math.h                                                     │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/include/c10/util/B- │
│                │          │                              │ Float16-math.h                                               │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/utils/data/_utils/- │
│                │          │                              │ worker.py                                                    │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/utils/hipify/hipif- │
│                │          │                              │ y_python.py                                                  │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/tqdm-4.67.1.dist-info/LI- │
│                │          │                              │ CENCE                                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/urllib3-2.4.0.dist-info/- │
│                │          │                              │ licenses/LICENSE.txt                                         │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ PostgreSQL                   │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ Python-2.0                   │ .venv/lib/python3.11/site-packages/pandas-2.2.3.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/sklearn/utils/_pprint.py  │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/typing_extensions-4.13.2- │
│                │          │                              │ .dist-info/licenses/LICENSE                                  │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ Zlib                         │ .venv/lib/python3.11/site-packages/numpy/core/include/numpy- │
│                │          │                              │ /random/LICENSE.txt                                          │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/include/ATen/nativ- │
│                │          │                              │ e/cpu/avx_mathfun.h                                          │
├────────────────┼──────────┼──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Non Standard   │ UNKNOWN  │ Apache-with-LLVM-Exception   │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ BSD-0-Clause                 │ .venv/lib/python3.11/site-packages/pandas-2.2.3.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/typing_extensions-4.13.2- │
│                │          │                              │ .dist-info/licenses/LICENSE                                  │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ BSD-3-Clause-OpenMPI         │ .venv/lib/python3.11/site-packages/numpy-1.26.4.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy-1.15.2.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ BeOpen                       │ .venv/lib/python3.11/site-packages/pandas-2.2.3.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/typing_extensions-4.13.2- │
│                │          │                              │ .dist-info/licenses/LICENSE                                  │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ CNRI-Python-GPL-Compatible   │ .venv/lib/python3.11/site-packages/pandas-2.2.3.dist-info/L- │
│                │          │                              │ ICENSE                                                       │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/typing_extensions-4.13.2- │
│                │          │                              │ .dist-info/licenses/LICENSE                                  │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ Copyright                    │ .venv/lib/python3.11/site-packages/joblib/parallel.py        │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/pandas/core/generic.py    │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/pandas/core/indexes/base- │
│                │          │                              │ .py                                                          │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/plotly/graph_objs/_figur- │
│                │          │                              │ e.py                                                         │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/plotly/graph_objs/_figur- │
│                │          │                              │ ewidget.py                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/torch/include/ATen/nativ- │
│                │          │                              │ e/Distributions.h                                            │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ Entenssa                     │ .venv/lib/python3.11/site-packages/numpy-1.26.4.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          │                              ├──────────────────────────────────────────────────────────────┤
│                │          │                              │ .venv/lib/python3.11/site-packages/scipy-1.15.2.dist-info/L- │
│                │          │                              │ ICENSE.txt                                                   │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ GPL-3.0-with-bison-exception │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
│                │          ├──────────────────────────────┤                                                              │
│                │          │ Khronos                      │                                                              │
│                │          │                              │                                                              │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ Qhull                        │ .venv/lib/python3.11/site-packages/scipy/spatial/qhull_src/- │
│                │          │                              │ COPYING.txt                                                  │
│                │          ├──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                │          │ X11-Lucent                   │ .venv/lib/python3.11/site-packages/torch-2.6.0.dist-info/LI- │
│                │          │                              │ CENSE                                                        │
└────────────────┴──────────┴──────────────────────────────┴──────────────────────────────────────────────────────────────┘
```

## 結果分析

### Report Summary

```txt
Report Summary

┌───────────────────────┬──────┬──────────┐
│        Target         │ Type │ Licenses │
├───────────────────────┼──────┼──────────┤
│ requirements.txt      │  -   │    44    │
├───────────────────────┼──────┼──────────┤
│ Loose File License(s) │  -   │   149    │
└───────────────────────┴──────┴──────────┘
Legend:
- '-': Not scanned
- '0': Clean (no security findings detected)
```

該表格為**依賴文件掃描**（該專案的依賴文件僅有 requirements.txt）與**全環境掃描**掃描出來的授權數量。全環境掃描掃出授權數量較多通常原因為該專案所使用的元件本身也使用了其他元件，形成隱性的感染，使用者掃描時應盡量注意此種授權感染方式。

### requirements.txt (license) 與 Loose File License(s) (license)

```txt
requirements.txt (license)

Total: 44 (UNKNOWN: 5, LOW: 37, MEDIUM: 2, HIGH: 0, CRITICAL: 0)
```

```txt
Loose File License(s) (license)

Total: 149 (UNKNOWN: 21, LOW: 119, MEDIUM: 2, HIGH: 7, CRITICAL: 0)
```

該依賴文件掃描中的授權統計。

- UNKNOWN 為無法判別，需人工檢閱。
- LOW 為不需要公開任何原始碼，但是否需要保留元件的授權檔案需要依各項授權而定。
- MEDIUM 為需要公開修改過的元件原始碼與維持相同授權，專案原始碼則不需公開，專案授權也可以自行決定。
- HIGH 與 CRITICAL 為必須公開所有源代碼並保持相同授權。

註：[trivy version 0.62 授權種類分級對照表，時間截至2025/05/22](https://trivy.dev/latest/docs/scanner/license/#license-scanning)

#### 常見授權列舉

專案在選擇元件時**務必考量專案情況**選擇適合該案的開源授權，以免造成侵權行為。

另外也有部分專案會使用某些授權的變體（如 PostgreSQL License 為 MIT/BSD license 的變體），或雙重授權機制（如 MySQL 和 Qt 使用商業授權＋GPL license），又或是將產品線區分為開源版與企業版，在無法判斷授權是否適用該案的情況下，強烈建議諮詢法律專業人士，確保充分了解所選授權的法律影響。

- 寬鬆授權
  - AFL-1.1
  * AFL-1.2
  * AFL-2.0
  * AFL-2.1
  * AFL-3.0
  * Apache-1.0
  * Apache-1.1
  * Apache-2.0
  * Artistic-1.0-cl8
  * Artistic-1.0-Perl
  * Artistic-1.0
  * Artistic-2.0
  * BSL-1.0
  * BSD-2-Clause-FreeBSD
  * BSD-2-Clause-NetBSD
  * BSD-2-Clause
  * BSD-3-Clause-Attribution
  * BSD-3-Clause-Clear
  * BSD-3-Clause-LBNL
  * BSD-3-Clause
  * BSD-4-Clause
  * BSD-4-Clause-UC
  * BSD-Protection
  * CC-BY-1.0
  * CC-BY-2.0
  * CC-BY-2.5
  * CC-BY-3.0
  * CC-BY-4.0
  * FTL
  * ISC
  * ImageMagick
  * Libpng
  * Lil-1.0
  * Linux-OpenIB
  * LPL-1.02
  * LPL-1.0
  * MS-PL
  * MIT
  * NCSA
  * OpenSSL
  * PHP-3.01
  * PHP-3.0
  * PIL
  * Python-2.0
  * Python-2.0-complete
  * PostgreSQL
  * SGI-B-1.0
  * SGI-B-1.1
  * SGI-B-2.0
  * Unicode-DFS-2015
  * Unicode-DFS-2016
  * Unicode-TOU
  * UPL-1.0
  * W3C-19980720
  * W3C-20150513
  * W3C
  * X11
  * Xnet
  * Zend-2.0
  * zlib-acknowledgement
  * Zlib
  * ZPL-1.1
  * ZPL-2.0
  * ZPL-2.1
  * CC0-1.0
  * Unlicense
  * 0BSD
- 中度限制授權
  - Mozilla Public License 2.0 (MPL 2.0)
  - Eclipse Public License (EPL)
- 嚴格限制授權
  - GNU General Public License (GPL)
  - GNU Lesser General Public License (LGPL)
  - GNU Affero General Public License (AGPL)
