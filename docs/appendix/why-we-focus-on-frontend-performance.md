# 效能問題

為什麼我們要關注前端效能

[原始資料連結](https://technology.blog.gov.uk/2019/04/18/why-we-focus-on-frontend-performance/)

英國政府最近更新了[服務手冊指南](../accessbility/how-to-test-frontend-performance.md)，以幫助政府各部門的開發人員在效能成為使用者問題之前，識別與測試性能問題。

確保 GOV.UK 盡可能具有包容性是持續努力的部分。2016 年的 Google 研究發現，如果行動網站載入時間超過 3 秒，[53% 的使用者就會放棄該網站。](https://www.thinkwithgoogle.com/marketing-resources/data-measurement/mobile-page-speed-new-industry-benchmarks/) 對政府而言，GOV.UK 通常是使用者可以獲得資訊的唯一地方。如果網站表現不佳，將成為單點故障 (single point of failure)。

## 目錄

 - [進一步了解我們的使用者](#進一步了解我們的使用者)
 - [不同的設備](#不同的設備)
 - [連接速度的差異](#連接速度的差異)
 - [行動網路使用可能很昂貴](#行動網路使用可能很昂貴)
 - [使用者的壓力](#使用者的壓力)
 - [我們正在採取哪些措施來提效能](#我們正在採取哪些措施來提效能)
 - [效能是每個人的責任](#效能是每個人的責任)

## 進一步了解我們的使用者

為了幫助人們盡快從 GOV.UK 獲得所需的資訊，我們需要了解我們使用者所處的狀況與環境。

## 不同的設備

不是所有的使用者都負擔得起高階設備，我們已經發現，配備入門級硬體的便宜設備已經難以應對目前的網頁系統。我們定期評估人們使用哪些[設備與瀏覽器來存取 GOV.UK ](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices)，以便確認我們的前端在所有這些裝置與瀏覽器上都能有效運作。

## 連接速度的差異

即使使用者確實擁有現代化的設備，英國各地的連線速度仍有所不同。

雖然[英國 2018 年的平均寬頻速度為 18.57 Mbps，](https://www.cable.co.uk/broadband/speed/worldwide-speed-league/)但網路連線速度可能有很大差異。例如，即使是倫敦這個擁有全球連結與基礎設施的城市，居民網路連線也可能很差。在所謂的「沒有訊號的地方」，居民[連接速度僅有 0.26 Mbps](https://www.london.gov.uk/sites/default/files/digital_connectivity_report_final.pdf)。

在這些情況下，還有一些使用者甚至無法依賴行動網路覆蓋率，因為[英國境內有 15% 的室內空間是沒有行動網路](https://www.ofcom.org.uk/__data/assets/pdf_file/0024/108843/summary-report-connected-nations-2017.pdf)覆蓋。  

> 譯註：英國 15% 的室內空間沒有行動網路的原文 2017 調查連結已失效，並附上 2018 英國室內空間沒有行動網路覆蓋已降到8%。
>
> [https://www.ofcom.org.uk/\_\_data/assets/pdf_file/0020/130736/Connected-Nations-2018-main-report.pdf](https://www.ofcom.org.uk/__data/assets/pdf_file/0020/130736/Connected-Nations-2018-main-report.pdf)

即便使用者有網路，但由於網頁有太多資源，使載入與運行緩慢，因此英國有很多人經常無法存取這些網站。透過壓縮資源，我們可以減少所需的資料傳輸，並為連接速度差與設備較舊的使用者提供更好的服務。

## 行動網路使用可能很昂貴

此外，Ofcom 統計數據顯示，英國[每月行動網路的平均費用為 18.36 英鎊。](https://www.ofcom.org.uk/__data/assets/pdf_file/0030/113898/pricing-report-2018.pdf)該資費每月為使用者提供 1.9 GB 的上網流量。考慮到[行動網頁量中位數接近 1.7 MB](https://httparchive.org/reports/page-weight)，每個月行動上網流量是不夠用的。

透過減少網頁的大小，我們可以改善使用者設備的數據消耗及關聯的電池壽命。

## 使用者的壓力

最重要的是，糟糕的網站效能會增加使用者的壓力並危害他們的工作效率。Glasgow Caledonian University 的一項研究發現，當參與者在連線速度慢的網站內，完成一項簡單任務時，[注意力必須提高 50% 以上。](http://www.tecnostress.it/wp-content/uploads/2010/02/final_webstress_survey_report_229296.pdf)執行任務所需的額外注意力會導致整體壓力平均上升。

當 GOV.UK 是使用者可以獲得政府資訊與服務的唯一途徑時，緩慢的網站效能是無法接受的。

## 我們正在採取哪些措施來提效能

為了對未來有所幫助，除了指導政府開發人員如何提高目前前端的效能外，我們還為所有GOV.UK前端開發尋找更廣泛選擇的技術。

為此，我們正在進行一系列調查，以找出哪些技術對網站效能有重大影響，以便我們可以確定未來工作的優先順序。

我們之前已經討論過[有關字體載入的工作](https://technology.blog.gov.uk/2018/10/04/making-gov-uk-pages-load-faster-and-use-less-data/)，也在研究以下策略，例如：

- 使用現在所有主流瀏覽器都支援的 HTTP/2，以最佳化資源 (asset) 交付到使用者設備

- 更新字體，以獲得更好的整體壓縮以減少資料使用

- 應用現代壓縮方法(例如[Brotli](https://github.com/google/brotli))來減少頁面的大小

隨著調查的進展，我們計畫在部落格中發布我們的調查結果，並將隨著了解更多資訊而更新我們的[前端效能指南。](../accessbility/how-to-test-frontend-performance.md)在這個過程中，我們希望政府各地的開發人員能從已開始的工作中學習，並幫助我們確定下一步要研究的內容。

## 效能是每個人的責任

網站效能可能決定某人是否能夠從政府獲得需要的東西，或完全放棄他們的任務。

因此，效能是我們提供的服務不可或缺的一部分，服務團隊的每個成員都應該參與最佳化過程。即使是微小的更動也能為我們的使用者帶來巨大的改變。
