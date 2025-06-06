# 利用輔助科技進行測試

您必須讓服務與輔助科技可以搭配使用，這樣每個人可以透過他們所依賴的技術(例如螢幕報讀器或語音辨識軟體)來使用您的服務。

使用輔助科技進行[整體無障礙測試](https://www.gov.uk/service-manual/technology/testing-for-accessibility)應該成為您服務的一部分。

## 可以使用哪些輔助科技進行測試

在整個開發過程中使用輔助科技測試您的服務，尤其是在引入重要功能或進行重大變更時。

## 符合服務標準

為了滿足服務標準，您的服務在進入公開測試版之前，必須至少與以下輔助科技和瀏覽器組合一起使用。

| 輔助科技 | 軟體版本 | 瀏覽器 |
|------|------|------|
| JAWS(桌面螢幕報讀器) | 2019 年或之後 | Chrome 或 Edge(最新版本) |
| NVDA(桌面螢幕報讀器) | 最新版本 | Chrome 或 Edge(最新版本) |
| iOS 上的 VoiceOver (行動螢幕報讀器) | 最新版本 | Safari(版本 12 或更高版本) |
| TalkBack (行動螢幕報讀器) | 最新版本 | Chrome(最新版本) |
| Windows 放大鏡或 Apple Zoom(螢幕放大鏡) | 最新版本 | 任何 |
| Dragon(語音辨識) | 15或以上 | Chrome(最新版本) |

此表基於 [2016 年於 GOV.UK 使用輔助科技的調查](https://accessibility.blog.gov.uk/2016/11/01/results-of-the-2016-gov-uk-assistive-technology-survey/)
以及最近的 [WebAIM 螢幕報讀器調查](https://webaim.org/projects/screenreadersurvey9/) 。

您可以自行進行此測試，或要求將其作為[無障礙稽核](https://www.gov.uk/service-manual/helping-people-to-use-your-service/getting-an-accessibility-audit)的一部分。

## 您可能想要測試的其他輔助科技

在可能的情況下，最好使用其他輔助科技、瀏覽器和作業系統設定進行測試。我們建議優先考慮以下項目：

- 舊版的輔助科技——特別是 JAWS 和 TalkBack
- 其他輔助科技——特別是 macOS 上的 VoiceOver (螢幕報讀器)以及 Safari 和 ZoomText (螢幕放大鏡)
- 更改顏色——使用 Windows 高對比模式和 Firefox 瀏覽器設置
- 使用瀏覽器和輔助科技的其他組合進行測試

其他需要優先考慮的瀏覽器和輔助科技組合含：

- Firefox (最新版本)和 JAWS
- Firefox (最新版本)和 NVDA
- Firefox (最新版本)和 Dragon

## 持續測試

在開發過程中越頻繁的測試，就越有可能識別出任何無障礙問題。如果可以的話，最好採用使用者常用的輔助科技持續測試。

但如果這無法落實，[請採用您可以使用的輔助科技進行測試](https://accessibility.blog.gov.uk/2018/09/27/assistive-technology-tools-you-can-use-at-no-cost/)。嘗試包含桌面螢幕報讀器、行動螢幕報讀器、螢幕放大器和一些語音辨識軟體。

## 如何測試

盡可能使用實際設備或技術進行測試。如果您無法存取設備或技術，請考慮使用虛擬機。

測試時，您應該檢查：

- 您可以存取資訊
- 該資訊是可以理解的
- 介面上的所有內容都可用

### 螢幕報讀器

您應該使用螢幕報讀器進行以下測試：

- 讀取每個元素和標題
- 逐一瀏覽每個連結
- 檢查每個地標 (landmark)，例如頁尾 (footer) 和任何導覽列 (navigation)
- 檢查您對無障礙網際網路應用程式 (ARIA) 的使用情況
- 檢查您是否可以填寫任何可編輯欄位，例如編寫和提交表單

有關使用螢幕報讀器(含鍵盤命令)的更多資訊，請閱讀以下 WebAim 文章：

- [使用 JAWS 評估網站的無障礙](https://webaim.org/articles/jaws/)性

- [使用 NVDA 評估網站的無障礙](https://webaim.org/articles/nvda/)性

- [使用 VoiceOver 評估網站的無障礙](https://webaim.org/articles/voiceover/)性

### 螢幕放大鏡

使用螢幕放大鏡時，測試放大倍率至少為 4 倍。查看：

- 元素之間的間距，例詳見表單標籤和欄位之間的間隙
- 頁面元素在不同的頁面布局上能一致地顯示——例如，放大頁面的人總是可以找到搜尋框
- 使用者可以知道視區 (viewport) 之外發生的事情——例如，使用互動視窗 (modal) 或顯示錯誤訊息

### 語音辨識

若要使用語音辨識技術測試您的服務，請使用語音：

- 導覽至每個功能
- 啟動每個連結、按鈕或互動元素，例詳見表單控制或媒體播放器
- 如果適用於您的服務，請在任何表格中輸入文字

確保您說話清晰、自然。您還應該使用高品質的耳機麥克風，而不是電腦的內建麥克風，並確定您與麥克風的距離保持一致。大聲說出標點符號並更正任何口誤。

請查看 [Dragon 使用者指南，](https://www.nuance.com/dragon/user-documentation.html)以了解有關如何安裝、發出語音命令和聽寫不同類型文字的更多資訊。

## 如果發現問題該怎麼辦

如果您在測試時發現問題，請清楚地記錄下來，以便可以複製和重新測試。

在記錄問題或花時間嘗試解決問題之前，請確保：

- 已正確使用輔助科技
- [程式碼沒有任何漏洞或錯誤](https://www.gov.uk/service-manual/technology/quality-assurance-testing-your-service-regularly) (bugs or errors)
- 瀏覽器或輔助科技中沒有已知可能會影響測試的問題

記錄問題時，您應該描述：

- 問題
- 問題影響的對象
- 測試時使用的瀏覽器、作業系統和技術版本
- 附上螢幕截圖可能會很有幫助。

如果您正在記錄多個問題，將它們按嚴重程度分類以便進行優先處理可能有所幫助。例如，如果您發現一個問題阻礙了某一組使用者的使用，您可能會希望將此問題列為比使用者可以輕鬆解決的問題更高的優先順序。

考慮：

- 與更廣泛的[無障礙社群](https://www.gov.uk/service-manual/communities/accessibility-community)分享您的發現以便其他人可以從您的測試中學習
- 向瀏覽器或輔助科技供應商報告任何錯誤

## 將輔助科技使用者納入您的使用者研究中

您還應該將輔助科技的使用者納入您的使用者研究中。參與者不需要使用任何特定的軟體組合——任何設置都有助於了解您的服務與輔助科技一起運作的情況。

[原始資料連結](https://www.gov.uk/service-manual/technology/testing-with-assistive-technologies)
