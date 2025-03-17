# 使用 CAPTCHAs

[CAPTCHAs](https://en.wikipedia.org/wiki/CAPTCHA) 是用來測試和區分人類和機器人(例如：自動化軟體)的工具，藉由讓使用者執行特定任務來證明自己是人類 - 例如，送出表單前先辨識混淆過的文字並輸入結果。

CAPTCHAs 影響了安全、隱私、可用性和無障礙等議題。除非運用於下列場合，否則切勿使用：

- 用於偵測可疑活動(例如，限制在用於偵測到可疑行為，並且需要測試使用者是否為人類)
- 有證據顯示替代方案不適用

## 目錄

  - [為什麼 CAPTCHAs 造成問題](#為什麼-captchas-造成問題)
  - [CAPTCHAs 的替代方案](#captchas-的替代方案)
  - [相關指南](#相關指南)
  - [無障礙和輔助數位化 讓您的服務具有無障礙性：簡介](#無障礙和輔助數位化-讓您的服務具有無障礙性簡介)

## 為什麼 CAPTCHAs 造成問題

CAPTCHAs 會讓部分的人較難使用我們的服務，包括身心障礙者。第三方的 CAPTCHA 服務也會帶來額外風險，包括：

- 資安問題 - 如果 CAPTCHAs 的提供方安全受損，我們的服務也會收到影響
- 隱私疑慮 - 例如，第三方服務可設定 cookies，收集分析資料並跨站追蹤使用者
- 效能問題 - 如果我們依賴 CAPTCHAs 提供者，代表我們將受到第三方會遇到的效能問題或斷線影響
- 即使具備 CAPTCHA 機制，我們的服務仍然可能面臨風險。透過電腦影像技術的進步或使用 CAPTCHA 農場 CAPTCHA farms) 進行破解，使得仍有某些機器人得以存取我們的服務。

## CAPTCHAs 的替代方案

許多 CAPTCHAs 所設計用來降低的風險，也可以透過其他方式來達到，包括：

- [控制造訪速率和連線數](https://en.wikipedia.org/wiki/Rate_limiting)
- [運用蜜罐誘捕系統 (honey pots)](https://en.wikipedia.org/wiki/Honeypot_(computing))
- [監控資料交換動態](../accessbility/monitor-service-status.md)

您也可以和 [前端社群](https://www.gov.uk/service-manual/communities/technology-community-frontend-development) 一起討論關於 CAPTCHAs 的其他可能方案。

## 相關指南

您可能會發現以下指南也很有用：

- [保護您的服務免受詐騙的指南](../appendix/protecting-your-service-against-fraud.md)
- [使用 cookies 和類似技術的工作指南](../accessbility/working-with-cookies-and-similar-technologies.md)

## 無障礙和輔助數位化 讓您的服務具有無障礙性：簡介

[https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction#meeting-government-accessibility-requirements](./making-your-service-accessible-an-introduction.md)
