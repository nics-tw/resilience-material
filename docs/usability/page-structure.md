# 網頁結構教學

> 本文翻譯自：英國政府數位服務設計手冊之參考資料  
> 原文連結：https://www.w3.org/WAI/tutorials/page-structure/  
> 翻譯日期：2023-12-27  

良好結構的內容可以實現更有效率的導覽與處理。使用 HTML 與 WAI-ARIA 改進網頁與應用程式中的導覽與定向。

- [頁面區域](https://www.w3.org/WAI/tutorials/page-structure/regions/)：**使用 HTML5 與 WAI-ARIA 識別與標記網頁上的區域。

- [標記區域](https://www.w3.org/WAI/tutorials/page-structure/labels/)：標記區域以允許使用者區分與存取它們。

- [標題](https://www.w3.org/WAI/tutorials/page-structure/headings/)：新增標題並根據標題的關係與重要性對網頁部分進行邏輯巢狀與標記。

- [內容結構](https://www.w3.org/WAI/tutorials/page-structure/content/)：使用適當且有意義的元素來標記頁面上的內容。

## 為什麼這很重要？

內容結構良好的頁面對於許多網路使用者來說至關重要，例如：

- **有認知與學習障礙的人**可以更輕鬆地找並優先處理到頁面內容。
- **使用螢幕報讀的使用者**可以直接跳到主要內容並導覽到對他們來說重要的段落。
- **鍵盤使用者**可以更有效地瀏覽頁面及其段落。否則，使用者必須多次按 Tab 鍵才能瀏覽每個段落中的所有連結。
- **使用僅顯示**網頁主要內容的軟體的人(例如有認知障礙的人)如果正確標記頁面結構，將會獲得更好的結果。
- **有視覺障礙的人**(含視力低下的人)可以在頁面與內容中找到提供定位的提示。
- **行動網路使用者**通常可以使用所謂的「閱讀器」或「閱讀」模式，該模式僅在正確標記的情況下顯示頁面的主要內容。
- **使用某些瀏覽器外掛程式的使用者**可以使用標誌性作用跳到頁面上的特定段落。
- 良好的、無障礙性的頁面結構還有其他好處，超越了身心障礙者的體驗。例如，搜尋引擎可以使用這些資料來更好地索引頁面內容。

## 相關 WCAG 資源

這些教學提供了在不同情況下實現輔助功能的最佳實踐指南。本網頁結合了以下 WCAG 成功標準與來自不同一致性等級的技術：

### 成功標準：

- [1.3.1 資訊與關係：](https://www.w3.org/WAI/WCAG21/quickref/#qr-content-structure-separation-programmatic)透過簡報傳達的訊息、結構與關係可以透過程式設計方式確定或以文字形式提供。(A 級)
- [2.4.1 繞過區塊：](https://www.w3.org/WAI/WCAG21/quickref/#qr-navigation-mechanisms-skip)提供一個機制，可以繞過多個網頁上重複的內容區塊。(A 級)
- [2.4.6 標題與標籤：](https://www.w3.org/WAI/WCAG21/quickref/#qr-navigation-mechanisms-descriptive)標題與標籤描述主題或目的。(AA 級)
- [2.4.10 段落標題：](https://www.w3.org/WAI/WCAG21/quickref/#qr-navigation-mechanisms-headings)段落標題用於組織內容。(AAA 級)
