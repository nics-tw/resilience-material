# 無障礙性測試

[原始文章連結](https://www.gov.uk/service-manual/helping-people-to-use-your-service/testing-for-accessibility)

您需要確保您的服務至少達到[網站內容無障礙性指南 2.2（WCAG 2.2）AA等級。](https://www.gov.uk/service-manual/helping-people-to-use-your-service/understanding-wcag)

如果服務不符合 WCAG 2.2 AA 等級，您可能會違法。

政府數位服務部（Government Digital Service, GDS）正在研究如何評估 [WCAG 2.2 中的新成功標準（Success Criteria）](https://www.w3.org/TR/WCAG22/)，並將於 2024 年 10 月開始監控額外標準。在
2024 年 10 月前，英國政府將監控網站和應用程式是否達到 [WCAG 2.1 AA 級的](https://www.w3.org/TR/WCAG21/)無障礙性。

如果您努力符合[服務標準](https://www.gov.uk/service-manual/service-standard)，您還需要：

- 確保該服務和最常見的[輔助科技](./testing-with-assistive-technologies.md)相容——例如螢幕報讀器或語音辨識軟體
- 與身心障礙使用者和年長使用者一起[測試服務](./running-research-sessions-with-people-with-disabilities.md)

符合無障礙性要求的最佳方法是：

- 從一開始就考慮無障礙
- 在整個開發過程中定期執行您自己的無障礙性測試
- 在進入公開測試版之前進行正式的無障礙稽核

## 目錄

 - [從一開始就考慮無障礙性](#從一開始就考慮無障礙性)
 - [測試你的程式碼](#測試你的程式碼)
 - [自動化測試](#自動化測試)
 - [手動測試](#手動測試)
 - [使用輔助科技進行測試](#使用輔助科技進行測試)
 - [進行無障礙性稽核](#進行無障礙性稽核)
 - [有用的資源](#有用的資源)
 - [相關指南](#相關指南)

## 從一開始就考慮無障礙性

考慮每個階段的無障礙性。您可能會發現這些[無障礙使用者設定檔](https://www.gov.uk/government/publications/understanding-disabilities-and-impairments-user-profiles)很有用。

開始考慮 alpha
測試階段的技術無障礙性。當團隊討論想法和發展概念時，請考慮：

- 您所考慮的是否符合 [WCAG 設計原則](https://www.gov.uk/service-manual/helping-people-to-use-your-service/understanding-wcag-20#wcag-20-design-principles)
- 視力、聽力、行動不便、思考與理解有障礙的人如何使用它

一旦開始撰寫正式環境程式碼，您就應該執行定期測試。一旦您的服務進入公開測試版，請在每次新增功能時執行測試。

當您進行初步的原型開發時，無需擔心程式碼的無障礙性，但檢查您正在使用的顏色對比度是否無障礙是很有用的。

以這種方式工作可以幫助您儘早發現並解決問題，在後期拆分並修復它們的成本更高。

## 測試你的程式碼

使用自動測試和手動測試定期測試您的程式碼。這些測試也會揭露設計和內容的問題。

進行這兩種類型的測試很重要——如果您只進行自動化測試，您會忽略一些問題。

## 自動化測試

有各種自動化測試工具，包括：

- [Axe](https://www.deque.com/axe/)
- [WAVE](http://wave.webaim.org/extension/)
- [ARC Toolkit](https://www.tpgi.com/arc-platform/arc-toolkit/)
- [SiteImprove](https://www.siteimprove.com/integrations/browser-extensions/)

## 手動測試

[如果您無法進行詳細的測試](https://www.gov.uk/government/publications/doing-a-basic-accessibility-check-if-you-cant-do-a-detailed-one/doing-a-basic-accessibility-check-if-you-cant-do-a-detailed-one)，那麼進行基本的無障礙性檢查是為了幫助您測試常見的無障礙性問題，包括：

- 缺乏鍵盤無障礙性（重要，因為一些人依賴使用鍵盤來瀏覽網站）
- 連結文字不具描述性（例如：「點擊這裡」連結）
- 文字和重要圖形和控制項的顏色對比度不夠
- （在需要替代文字的情況下）圖片沒有具意義的替代文字
- 未正確標記[線上表單](https://design-system.service.gov.uk/components/)，以便關聯正確的控制與正確的標籤

一些瀏覽器具有工具，可以更容易找到文件物件模型（Document Object Model，DOM）中的無障礙性問題。例如，[Mozilla Firefox 的無障礙性檢查工具](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)和 [Chrome 開發者工具(DevTools)中的無障礙性功能](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference)。

還有一些工具，如 [Microsoft 的 Accessibility Insights](https://accessibilityinsights.io/)，也可幫助進行手動檢查。

## 使用輔助科技進行測試

您的服務需要在人們用來存取您的服務的[最常見的瀏覽器和裝置](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices)上運作。

您還必須確保您的服務和[常見的輔助科技](./testing-with-assistive-technologies.md)相容。

這意味著：

- 在可能的情況下，自己使用輔助科技進行一些測試
- 尋找使用輔助科技的[使用者參與研究](https://www.gov.uk/service-manual/user-research/find-user-research-participants)
- 要求將輔助科技測試納入您的無障礙稽核中

## 進行無障礙性稽核

在您的服務進入公開測試版之前，您必須進行[無障礙稽核並解決所有問題。](https://www.gov.uk/service-manual/helping-people-to-use-your-service/getting-an-accessibility-audit)

## 有用的資源

您可以透過以下方式開始一些簡單的測試：

- [如果您無法進行詳細的無障礙性測試，請進行基本的無障礙性測試](https://www.gov.uk/government/publications/doing-a-basic-accessibility-check-if-you-cant-do-a-detailed-one/doing-a-basic-accessibility-check-if-you-cant-do-a-detailed-one)
- [W3C Easy Checks](https://www.w3.org/WAI/test-evaluate/preliminary/)——一些快速的方法可以幫助您開始評估網頁的無障礙性
- TPGi 提供的[用於輔助功能測試的基本螢報讀器指令](https://developer.paciellogroup.com/blog/2015/01/basic-screen-reader-commands-for-accessibility-testing/)
- [WCAG 報告產生器](https://www.w3.org/WAI/eval/report-tool/#/)

您也可以閱讀一些部落格文章：

- [您可以免費測試的輔助科技工具](https://accessibility.blog.gov.uk/2018/09/27/assistive-technology-tools-you-can-use-at-no-cost/)
- [為什麼與真實使用者進行無障礙性測試如此重要](https://accessibility.blog.gov.uk/2018/03/20/why-accessibility-testing-with-real-users-is-so-important/)
- [使用角色設定檔進行無障礙性測試](https://accessibility.blog.gov.uk/2019/02/11/using-persona-profiles-to-test-accessibility/)
- [遠端無障礙性角色測試](https://accessibility.blog.gov.uk/2021/03/30/remote-accessibility-persona-testing/)
- [在世界上最具障礙的網頁上測試工具時，我們發現了什麼](../accessbility/tools-cannot-covering-all-situation.md)

## 相關指南

您可能還會發現這些指南很有用：

- [讓您的服務具有無障礙性：簡介](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction)
- [使用、調整和建立模式](https://www.gov.uk/service-manual/design/using-adapting-and-creating-patterns)
- [使用漸進增強](https://www.gov.uk/service-manual/technology/using-progressive-enhancement)
