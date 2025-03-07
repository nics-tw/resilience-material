# 使用CAPTCHAs

[CAPTCHAs](https://en.wikipedia.org/wiki/CAPTCHA) 是用來測試和區分人類和機器人(例如：自動化軟體)的工具，藉由讓使用者執行特定任務來證明自己是人類 - 例如，送出表單前先辨識混淆過的文字並輸入結果。

CAPTCHAs 影響了安全、隱私、可用性和無障礙等議題。除非運用於下列場合，否則切勿使用：

- 用於偵測可疑活動(例如，限制在用於偵測到可疑行為，並且需要測試使用者是否為人類)
- 有證據顯示替代方案不適用

## 目錄

  - [為什麼 CAPTCHAs 造成問題](#為什麼-CAPTCHAs-造成問題)
  - [CAPTCHAs 的替代方案](#CAPTCHAs-的替代方案)
  - [相關指南](#相關指南)
  - [無障礙和輔助數位化 讓您的服務具有無障礙性：簡介](#無障礙和輔助數位化-讓您的服務具有無障礙性簡介)

## 為什麼 CAPTCHAs 造成問題

CAPTCHAs 會讓部分的人較難使用我們的服務，包括身心障礙者。第三方的 CAPTCHA 服務也會帶來額外風險，包括：

- 資安問題 - 如果CAPTCHAs的提供方安全受損，我們的服務也會收到影響
- 隱私疑慮 - 例如，第三方服務可設定cookies，收集分析資料並跨站追蹤使用者
- 效能問題 - 如果我們依賴CAPTCHAs提供者，代表我們將受到第三方會遇到的效能問題或斷線影響
- 即使具備 CAPTCHA 機制，我們的服務仍然可能面臨風險。透過電腦影像技術的進步或使用 CAPTCHA 農場 CAPTCHA farms) 進行破解，使得仍有某些機器人得以存取我們的服務。

## CAPTCHAs 的替代方案

許多CAPTCHAs所設計用來降低的風險，也可以透過其他方式來達到，包括：

- [控制造訪速率和連線數](https://en.wikipedia.org/wiki/Rate_limiting)
- [運用蜜罐誘捕系統 (honey pots)](https://en.wikipedia.org/wiki/Honeypot_(computing))
- [監控資料交換動態](https://www.gov.uk/service-manual/technology/monitoring-the-status-of-your-service)

您也可以和 [前端社群](https://www.gov.uk/service-manual/communities/technology-community-frontend-development) 一起討論關於CAPTCHAs的其他可能方案。

## 相關指南

您可能會發現以下指南也很有用：

- [保護您的服務免受詐騙的指南](https://www.gov.uk/service-manual/technology/protecting-your-service-against-fraud)
- [使用cookies和類似技術的工作指南](https://www.gov.uk/service-manual/technology/working-with-cookies-and-similar-technologies)

## 無障礙和輔助數位化 讓您的服務具有無障礙性：簡介

[https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction#meeting-government-accessibility-requirements](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction#meeting-government-accessibility-requirements)

# 監控交易動態

監控您服務的狀態

[https://www.gov.uk/service-manual/technology/monitoring-the-status-of-your-service](https://www.gov.uk/service-manual/technology/monitoring-the-status-of-your-service)

當您進入公開beta測試階段時，您必須建立監控機制，以識別可能影響您服務的任何問題。

使用適當的工具和流程進行監控可以幫助您：

- 發現使用者可能遇到的問題
- 在技術問題發生時收到警報，以便及時修復
- 在問題發生或加劇之前預見問題
- 改進您的服務，例如使用效能數據來協助[容量規劃](https://www.gov.uk/service-manual/technology/test-your-services-performance)等。

## 規劃您的監控工作

您應該在alpha階段開始規劃如何監控您的服務。在alpha階段，您的團隊應該達成以下協議：

- 監控服務的哪些部分
- 如何監控您的服務
- 如何處理和記錄問題

## 監控指標

您應該追蹤使用者相關的指標，以及技術性的指標。例如，追蹤能夠完成任務的使用者百分比，以及可用的硬碟空間、應用程式介面(API)效能和記憶體使用情況。

## 如何進行監控

一旦您同意監控的內容，您的團隊應該：

- 設定內部和外部的監控檢查(monitoring checks)
- 撰寫監控檢查
- 撰寫警報訊息

## 設定內部和外部監控檢查

您應該設定內部和外部的監控檢查。

內部監控是您應該在您的基礎架構內設定的監控，提供關於記憶體使用量、頁面載入時間和網路流量等指標的即時更新。

外部監控是您應該在您的服務外設定的監控，即使您的基礎架構發生故障，它仍會持續檢查您的系統。

## 撰寫監控檢查

您需要決定哪種監控檢查對您的服務最有用。

監控檢查是一系列測試，您可以執行這些測試來評估您的系統或整體服務的狀態，並通知您是否存在問題。

例如，您可能決定「如果在一小時內有1％的使用者在完成交換資料時遇到問題，則需要收到警報」。

您應該在撰寫程式碼的同時撰寫監控檢查，並將這些檢查視為您實際系統的測試。

## 撰寫警報訊息

請確保您的警報訊息清晰簡潔，易於理解，因為可能會有團隊成員在夜間被叫醒來解決問題。

考慮建立一份作業手冊或文件，以幫助您的團隊快速應對問題。請確保團隊的每個成員在本機上都有檔案的副本，以防雲端文件儲存空間不可用的情況。

## 處理和記錄問題

您應該使用報修單追蹤系統(ticketing system)來管理和追蹤錯誤，以便讓您將問題分配給團隊成員。

錯誤訊息總是包含有用的資訊——它們可以告訴您以下內容：

- 使用者問題
- 對服務的攻擊
- 系統故障
- 容量問題

追蹤錯誤有助於您查看哪些錯誤是重複出現的，以及它們是整體服務的一部分還是與特定應用程式或機器相關。

您可以結合監控測試結果以更了解服務中應修復的問題。例如，比對頁面載入測試中的資料交換失敗和應用程式錯誤，可以讓您：

- 找出更多使用者在服務中遭遇問題的部分
- 確定問題的原因
- 討論如何解決問題的根本原因，例如硬碟空間或效能不佳。

## 讓資料可以被廣泛利用

除非有安全性問題，您應該將監控資訊和資料廣泛分享。

例如，您可以與您部門的其他服務團隊分享效能報告，或使用類似[GOV.UK Notify](https://www.gov.uk/government/publications/govuk-notify/govuk-notify)所使用的作業狀態頁面的狀態儀表板，來告訴使用者問題資訊。

## 定期檢視您的監控流程

每次收到警報時，您都應該檢視您的監控流程。

如果有人在非工作時間被呼叫，您應該確保問題確實需要相應等級的的回應。

例如，如果該問題不影響使用者，並且可以等到早上再處理，請考慮更改您的警報策略，以便將來不再對此類錯誤發出警報。

## 相關指南

您可能也會發現[運作時間和可用性指南](https://www.gov.uk/service-manual/technology/uptime-and-availability-keeping-your-service-online)很有用。