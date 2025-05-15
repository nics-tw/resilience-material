# 提升高可用性：K6 負載測試

k6 是一款負載測試工具，它能幫助開發人員模擬真實的使用者行為，並測試系統在這些行為下的表現。使用 k6 撰寫測試可以讓您在程式部署到正式環境前，找出潛在問題，例如回應時間過長或系統故障等。

它使用 JavaScript 或 TypeScript 撰寫腳本，除了開發人員容易上手外，也方便整合到現有的程式碼庫與專案中，K6 的測試涵蓋多種面向，可以是檢查效能、可靠性或可擴展性。根據不同的目標，您的腳本需要做不同的設定，例如模擬大量使用者或長時間執行測試。

## 負載測試的種類

負載測試的種類分為：冒煙測試(Smoke Test)、平均負載測試(Average-load Test)、壓力測試(Stress Test)、浸泡測試(Soak Test)、峰值測試(Spike Test)、斷點測試(Breakpoint Test)，簡單的說明如下表，我們可以根據不同的系統類型、系統面對到的狀況來決定要執行哪一種測試。

| 測試類型 | 使用者數/吞吐量 | 持續時間 | 適用時機 |
|----------|----------------|---------|---------|
| 冒煙測試 | 低 | 短（秒或分鐘） | 系統版更時，用來檢查功能邏輯、基準指標和偏差 |
| 平均負載測試 | 平均生產環境負載 | 中（5-60分鐘） | 用於檢查系統在平均使用情況下的效能 |
| 壓力測試 | 高（高於平均） | 中（5-60分鐘） | 用於檢查系統在高於平均負載時的效能及狀況 |
| 浸泡測試 | 平均 | 長（數小時） | 檢查系統在長時間持續使用下的狀況 |
| 峰值測試 | 非常高 | 短（幾分鐘） | 測試瞬間高流量下的系統狀況 |
| 斷點測試 | 增加直到崩潰 | 視需要而定 | 用於找出系統的上限 |

![](https://grafana.com/media/docs/k6-oss/chart-load-test-types-overview.png?w=900)
> 圖片來源：k6 [load-test-types](https://grafana.com/load-testing/types-of-load-testing/)

## K6 負載測試

我們先看一個簡單的範例：

``` javascript
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  iterations: 10,
};

// 預設函數會被 k6 當作測試腳本的進入點。依照 iterations 設定，它會在整個測試期間重複執行 10 次。
export default function () {
  http.get('https://quickpizza.grafana.com');

  // Sleep 1 秒，模擬真實使用情形
  sleep(1);
}
```

K6 會執行預設函數(default function)的程式碼：對 https://quickpizza.grafana.com 發出 get 請求。根據 `options` 的設定，重複執行預設函數 10 次，執行結果如下：

``` console
$ k6 run ./test/load-test.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 
     execution: local
        script: ./test/load-test.js
        output: -
     scenarios: (100.00%) 1 scenario, 1 max VUs, 10m30s max duration (incl. graceful stop):
              * default: 10 iterations shared among 1 VUs (maxDuration: 10m0s, gracefulStop: 30s)
running (00m01.0s), 1/1 VUs, 0 complete and 0 interrupted iterations
default   [   0% ] 1 VUs  00m01.0s/10m0s  00/10 shared iters
...
running (00m12.0s), 1/1 VUs, 9 complete and 0 interrupted iterations
default   [  90% ] 1 VUs  00m12.0s/10m0s  09/10 shared iters
  █ TOTAL RESULTS 
    HTTP
    http_req_duration.............: avg=218.27ms min=217.21ms med=217.44ms max=222.07ms p(90)=221.52ms p(95)=221.79ms
      { expected_response:true }..: avg=218.27ms min=217.21ms med=217.44ms max=222.07ms p(90)=221.52ms p(95)=221.79ms
    http_req_failed...............: 0.00%  0 out of 10
    http_reqs.....................: 10     0.792022/s
    EXECUTION
    iteration_duration............: avg=1.26s    min=1.21s    med=1.21s    max=1.65s    p(90)=1.26s    p(95)=1.45s   
    iterations....................: 10     0.792022/s
    vus...........................: 1      min=1       max=1
    vus_max.......................: 1      min=1       max=1
    NETWORK
    data_received.................: 33 kB  2.6 kB/s
    data_sent.....................: 1.0 kB 82 B/s
running (00m12.6s), 0/1 VUs, 10 complete and 0 interrupted iterations
default ✓ [ 100% ] 1 VUs  00m12.6s/10m0s  10/10 shared iters
```

### 輸出結果說明

``` unset
execution: 在本地端運行
script: 執行的腳本是 ./test/load-test.js
scenarios: 設定 1 個(預設)情境, 最多 1 為虛擬使用者在同一時間執行測試, 測試時間最長為 10 分鐘 30 秒 (超過就會停止測試)
              * default: 重複執行 10 次，只允許最多 1 位虛擬使用者在同一時間執行

測試結果指標
`http_req_duration` 平均回應時間為 218.27 毫秒，95% 的回應在 221.79 毫秒以下
`http_req_failed` 執行 10 次，0 次失敗
`http_reqs` 總共發送出 10 個 http 請求，大約每秒發出 0.79 個請求
`iteration_duration` 平均執行一次時間的為 1.26 秒，95% 的測試在 1.45 毫秒內完成
`iterations` 執行 10 次，大約每秒完成 0.79 次測試
`vus` 目前的執行的虛擬使用者為 1 位
`vus_max` 最多允許 1 位虛擬使用者在同一時間執行
`data_received` 總共收到約 33 kB 的資料，每秒收到 2.6 kB
`data_sent` 總共送出約 1 Kb 的資料，每秒送出 82 B
```

其他指標說明，可以查看[K6 內建指標](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/)

### 視覺化分析結果

K6 測試結果可以另外存到 DB(如 PostgreSQL, InfluxDB)，再匯入到 Grafana 根據時間區段呈現、排序 API 回應時間或過濾出有問題的回應等，做成視覺化分析，您也可以直接使用 [k6 cloud](https://grafana.com/products/cloud/k6/)，不過因為篇幅關係，本文不對這部分多著墨。

![](https://grafana.com/media/products/k6-cloud/run-cloud-tests.png?w=450)
> 圖片來源：k6 cloud

## 參數設定

可以設定平均回應時間的閥值，如 95% 的回應須在 500 毫秒以下，大於 500 毫秒就會失敗。

``` javascript
export const options = {
  iterations: 10,
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95 percent of response times must be below 500ms
  },
};
```

設定執行測試的持續時間與同時執行的虛擬使用者數量，透過設定這些參數來達成不同種類的負載測試

``` javascript
export const options = {
  duration: '1m',
  vus: 50,
};
```

> 更多參數設定，可以參考[如何使用 options](https://grafana.com/docs/k6/latest/using-k6/k6-options/how-to/)

## 整合進 CI

K6 可以很輕易地整合進 CI，以 GitLab 為例，將前面展示的範例存到 `./test/load-test.js`，然後在 `.gitlab-ci.yml` 設定如下，即可在每次 commit 時執行負載測試。

``` yaml
stages:
  - k6-test

image:
  name: ubuntu:latest

k6-test:
  image:
    name: grafana/k6:latest # k6 官方提供的 Docker image
    entrypoint: [""]
  stage: k6-test
  script: 
    - k6 run ./test/load-test.js
  interruptible: true  # 如果有 push 新的 commit，這個 job 可以被自動取消

```

資料夾結構如下：

``` unset
|-- .gitlab-ci.yml      # GitLab CI/CD 設定檔
|
|---/test               # 測試資料夾
|    |--load-test.js    # 測試腳本
```

## 負載測試的幾點注意事項

- 簡單的測試比沒有測試好，可以先從關鍵使用路徑開始撰寫測試
- 關於閥值的訂定，可以參考 [Jakob Nielsen](https://www.nngroup.com/articles/website-response-times/) 的研究：將回應時間分成三階段 0.1 秒、1 秒以及 10 秒，或是參考[PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/about?hl=zh-tw)的標準
- 負載測試應該在預生產環境(pre-production)進行，因為
  - 它可能會造成系統中斷
  - 每次執行負載測試可能都需要自動繞過一些防機器人的驗證，您應該要特別寫一些判斷（如：在測試環境且執行負載測試時，關閉機器人驗證），而不是關閉驗證直接在生產環境中測試。

## 參考資料

- https://grafana.com/docs/k6/latest/using-k6/
- https://docs.gitlab.com/ci/testing/load_performance_testing/
- https://developers.google.com/speed/docs/insights/v5/about?hl=zh-tw
- https://www.nngroup.com/articles/website-response-times/
- https://k6.io/our-beliefs/#load-test-in-a-pre-production-environment
- https://gitlab.com/gitlab-org/quality/performance
