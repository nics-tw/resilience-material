# 使用漸進增強策略打造有韌性的前端頁面

漸進增強是一種建立網站與應用程式的策略，它的核心概念是：先讓網頁能單純以HTML運作後，再加入其他，如 CSS 與 JavaScript 等技術。

因為 HTML 是最具韌性的前端技術，當 HTML 出錯時，就沒有網頁；但如果 CSS 或 JavaScript 出錯時，HTML 仍會正確地呈現。

使用漸進增強意味著，即使 HTML 網頁中所加入 CSS 與 JavaScript 等技術出現問題時，使用者仍可以完成他們所需執行的操作。使用漸進增強建構服務有以下好處：

- 使您的服務更具韌性
- 確保您服務的最基礎功能可以運作並滿足使用者核心需求
- 透過鼓勵最佳實作方式來提高無障礙性，例如：編寫語意標記
- 讓設備或網路條件不佳的使用者也能使用您的服務

## 目錄

 - [從 HTML 開始](#從-html-開始)
 - [使用互動性元素 (interactive elements)](#使用互動性元素-interactive-elements)
 - [增添更多層次元素](#增添更多層次元素)
 - [創造更複雜的服務](#創造更複雜的服務)
   - [使用 JavaScript 框架](#使用-javascript-框架)
   - [使用 JavaScript 伺服器端渲染 (server-side rendering, SSR)](#使用-javascript-伺服器端渲染-server-side-rendering-ssr)
 - [測試您的服務](#測試您的服務)
 - [不要假設使用者關閉 CSS 或 JavaScript](#不要假設使用者關閉-css-或-javascript)

## 從 HTML 開始

大部分政府網站的服務應該僅使用 HTML 即可運作，這些包含以下類型服務：

- 交換資料性 (transactional) 服務，例如：使用者填寫資訊並提交給政府的表單

- smart answers服務，例如：GOV.UK 的[海外出生登記服務](https://www.gov.uk/register-a-birth)

- 基於內容的網站，例如：GOV.UK 的[國際旅遊建議](https://www.gov.uk/foreign-travel-advice)

## 使用互動性元素 (interactive elements)

您可以選擇使用互動性元素 (interactive elements)，但必須要有一個相同核心功能的備援方案。例如，讓動態自動完成元素可退回到 \<select\> 或其他類似元素。即便互動元素失效了，使用者仍可以進行他們需要做的事情。

您還必須合理地組織原始碼 (source) 順序與文件大綱。這種方法會為服務提供堅韌的基礎，同時意味著您的網站將可以與大多數的新舊設備與瀏覽器相容。此策略有助於確保網站具有無障礙性 (accessible)，因為使用者將能透過 HTML 存取他們所需的一切。

## 增添更多層次元素

一旦您的服務已經使用了 HTML 打造基礎後，您可以開始新增以下內容：

- 圖片
- 風格樣式
- 影音媒體
- 腳本 (script)，例如：JavaScript
- 更順暢、快速且不必重新整理整個頁面的互動體驗
- 實際送出資料前預先確認資料有效性的驗證方式
- 互動式圖表

## 創造更複雜的服務

使用漸進增強來建構服務為您提供一個具有韌性的基礎，可以用來建構更複雜的服務。在這種情況下，將服務視為一體考量不見得有幫助，而應將服務拆分為不同的互動模式，並決定使用 JavaScript 是否提供更好的使用體驗。

某些政府服務的特殊功能無法僅憑 HTML 實現。例如：「英國環境小組」的[洪水地圖服務](https://flood-map-for-planning.service.gov.uk/)，需要使用 JavaScript 呈現洪水的風險區域。但這樣做會造成一些問題，例如：

- 身心障礙者將無法使用部分的功能
- 您的服務可能因依賴 JavaScript 而不可靠 (reliable)

為了避免這些缺點，首先應嘗試在不使用 JavaScript 的情況下，網頁功能也能正常運作。若行不通，則需要有一個替代機制取代 JavaScript 所提供的互動效果。雖然效果可能不如啟用 JavaScript 的互動體驗好，但使用者也因此仍然可以使用您的服務達成目的。例如，資料可呈現為無障礙性 (accessible) 的資料表格。

如果以上方法都行不通，您需證明已考慮到輔助科技的使用者如何使用您的服務，含透過非數位途徑，例如打電話或臨櫃辦理。

###  使用 JavaScript 框架

有些開發者認為使用 [JavaScript 框架](https://en.wikipedia.org/wiki/JavaScript_framework)開發服務很方便。但某些 JavaScript 框架會要求使用者下載大量的資料，特別是使用者的網路速度較慢或使用較老舊的設備時，可能會導致效能問題。因此，我們應該權衡使用 JavaScript 框架的好處，以及是否值得承擔這些潛在的效能問題。

使用 JavaScript 框架可能導致其他問題，例如：

- 您的開發者依賴於無法掌握的第三方程式碼。
- 當框架的受歡迎程度下降時，則難以找到維護框架的技術資源。

您需要確保 JavaScript 框架將元素作為獨立的元件載入。如果 JavaScript 載入失敗，僅會是特定的單一元件失效，網頁其餘部分仍可運作如常。如果您的服務使用 JavaScript 框架來呈現整個頁面，一旦框架載入發生問題，將會立即導致服務的中斷。

這些獨立的元件也需要有備援策略，即使 JavaScript 失效了，使用者仍然能夠使用服務。

伺服器應該能退回以 HTML 進行渲染網頁，並照常將原始碼交付至瀏覽器，於必要時再使用 JavaScript 來增強元件。

###  使用 JavaScript 伺服器端渲染 (server-side rendering, SSR)

您可以使用伺服器端渲染 (server-side rendering) 或稱 [Isomorphic JavaScript 或 Universal JavaScript](https://en.wikipedia.org/wiki/Isomorphic_JavaScript)。然而，您仍需要在用戶端 (client-side) 停用 JavaScript 測試服務是否正常運作。當 JavaScript 失效時，仍能透過伺服器端渲染 HTML 來維持服務的正常運作。

## 測試您的服務

您須測試服務中大量依賴 JavaScript 或 JavaScript 框架的元件，來確保其無障礙性，由實際(身心障礙)的使用者進行測試更為理想。您也需要測試前端的效能。

## 不要假設使用者關閉 CSS 或 JavaScript

不要只因為預想使用者會選擇停用這些功能，便設計一個無 CSS 或 JavaScript 運作的服務，還有許多可能的情境使得這些附加層失效或遭到濾除，例如：

- 短暫性的網路中斷
- 第三方瀏覽器擴充軟體的介入，例如：廣告遮擋軟體等
- 第三方供應商中斷服務，例如：內容傳遞網路 (content delivery network, CDN) 的服務異常
- DNS 查詢失敗
- 瀏覽器更新後導致的錯誤
- 企業防火牆阻擋、刪除或修改某些內容(常見於銀行、政府部門等大型機構)
- 行動網路供應商為加快載入速度及節省頻寬用量而修改內容
- 個人防火牆或是防毒軟體修改或阻擋某些內容
- 使用不安全的網路連線，網路供應商將自己的網頁程式碼插入到頁面中，導致與原本內容發生衝突

某些使用者刻意關閉瀏覽器的部分功能，您應該尊重他們的決定，並確保這些使用者仍然可以使用您的服務。

[原始文章連結](https://www.gov.uk/service-manual/technology/using-progressive-enhancement)
