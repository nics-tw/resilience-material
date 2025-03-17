# 透過無障礙性驗收準則提升無障礙性

[原始文章連結](https://insidegovuk.blog.gov.uk/2018/01/24/improving-accessibility-with-accessibility-acceptance-criteria/)

在政府數位服務（Government Digital Service）部門，[我們建立的一切必須具無障礙性](https://gds.blog.gov.uk/2017/10/23/were-making-accessibility-clearer-and-easier/)。這是我們的設計原則之一，「這是[為了每個人](https://www.gov.uk/guidance/government-design-principles#this-is-for-everyone)」：

「無障礙設計是好的設計。我們所建立的一切應盡可能具有包容性、易讀和可閱讀。 …… 最需要我們服務的人通常也是最難使用這些服務的人。讓我們從一開始就考慮到這些人。」

無障礙驗收準則是我們用來確保我們的使用者介面具有無障礙性的工具之一。

## 目錄

 - [無障礙性驗收準則是什麼？](#無障礙性驗收準則是什麼)
   - [提高無障礙性的認知](#提高無障礙性的認知)
   - [維持無障礙性](#維持無障礙性)
 - [無障礙性驗收準則的範例](#無障礙性驗收準則的範例)
   - [GOV.UK 的無障礙性自動完成（autocomplete）功能](#govuk-的無障礙性自動完成autocomplete功能)
   - [GOV.UK 上的翻譯元件](#govuk-上的翻譯元件)
   - [GOV.UK 上的標題元件](#govuk-上的標題元件)
 - [撰寫無障礙性驗收準則的指南](#撰寫無障礙性驗收準則的指南)
   - [以無障礙需求為出發點](#以無障礙需求為出發點)
   - [不要過於通用](#不要過於通用)
   - [不要定義解決方案](#不要定義解決方案)
   - [反覆修改標準](#反覆修改標準)
 - [下一步是什麼？](#下一步是什麼)

## 無障礙性驗收準則是什麼？

它們是使用者介面被認為是無障礙必須符合的條件清單，有助於提升我們對存取需求的認知，以及在反覆設計過程中保持無障礙性。

政府數位服務部（GDS）多年來一直使用驗收準則（例如，[這篇 2015 年的 Verify 部落格文章關於驗收準則](https://gdstechnology.blog.gov.uk/2015/03/04/creating-better-acceptance-criteria-for-user-stories/)，以及 [2014 年的 GOV.UK 樣式指南](http://webarchive.nationalarchives.gov.uk/20141214162055/https://www.gov.uk/guidance/content-design/user-needs#acceptance-criteria)），因此將無障礙相關的驗收準則正式化並加以和擴展似乎是合理的。

請注意，僅有無障礙驗收準則本身並不足以使您的服務具有無障礙性——請閱讀更多[建立無障礙服務的指南](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction)。

### 提高無障礙性的認知

無障礙驗收準則提高了人們在特定情境下無障礙性的含義認知。它們比一般的無障礙性指南更為具體，例如 [Web內容無障礙性指南（WCAG）](https://www.w3.org/WAI/intro/wcag)。

透過提前起草這些準則，強迫我們從一開始就思考無障礙性以及[各種使用者](https://accessibility.blog.gov.uk/2016/05/16/consider-the-range-of-people-that-will-use-your-product-or-service/)的需求。

### 維持無障礙性

無障礙性準則也幫助我們在反覆設計過程中保持無障礙性。如果沒有這些準則，當我們在介面上進行反覆迭代時，容易造成無障礙性的倒退（accessibility regressions）。

即使我們知道一個介面已經建立得很好，並且付出了努力使其具有無障礙性——我們如何在不破壞無障礙性的情況下進行更改？怎樣才能避免新的無障礙性定義不完整或與原始定義不同？

在準則中概述無障礙性問題有助於我們記錄在早期迭代中所做的決策，並使我們能夠制定保持無障礙性的規則。

## 無障礙性驗收準則的範例

### GOV.UK 的無障礙性自動完成（autocomplete）功能

政府數位服務部（GDS）在 2017 年 1 月建立[無障礙性自動完成](https://github.com/alphagov/accessible-autocomplete)時首次使用[無障礙驗收準則](https://github.com/alphagov/accessible-autocomplete/blob/master/accessibility-criteria.md)。負責此項任務的團隊（Theodor Vararu、Léonie Watson 和 Ed Horsford）制定了自動完成的無障礙性準則——自動完成需要滿足的必要行為，以便輔助科技可以使用。自動完成欄位必須：

- 可以使用鍵盤進行焦點（focusable）導覽。
- 在鍵盤聚焦時提示。
- 告知使用者這是可編輯欄位。
- 告知使用者是否有預填的值。
- 告知使用者可以使用自動完成功能。
- 解釋如何使用自動完成。
- 告知使用者內容已被展開。
- 告知使用者是否有匹配項目。
- （可選）告知使用者目前有多少匹配項目。
- 在匹配數量變化時告知使用者。
- 允許使用者使用觸摸或鍵盤導覽來瀏覽可用的匹配項目。
- 告知使用者選擇了哪個匹配項目。
- （可選）必須告知使用者目前選定的匹配項目是第幾個，例如，「2（共3個）」。
- 告知使用者是否有預選的匹配項目。
- 允許使用者確認所選的匹配項目。
- 當匹配項目確認時告知使用者。
- 當確認選擇的匹配項目時，必須把焦點移回至可編輯欄位。

### GOV.UK 上的翻譯元件

當我們連結到 [GOV.UK 頁面的翻譯版本](https://www.gov.uk/government/case-studies/the-role-of-women-in-afghanistan.ur)時，我們確定以下標準：

「翻譯導航連結必須識別連結的語言，以確保螢幕報讀器正確發音。」

雖然這適用於所有不同語言的字詞，但在這個元件中尤其需要考慮這一點。這很有可能引入無障礙阻礙儘管這對所有不同語言的字詞都是正確的，但在這個元件的情境下尤其重要。在這裡，存在著產生無障礙性障礙（accessibility barrier）的高風險。

### GOV.UK 上的標題元件

對於那些將[白色文字放在藍色背景上的標題](https://www.gov.uk/government/publications/the-health-and-care-system-explained/the-health-and-care-system-explained)，我們使用的標準強調了對比度的重要性：

「標題的文字對比度必須至少達到 4.5:1，以符合 [WCAG AA](https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast) 準則。」

雖然所有文字都必須具有足夠的對比度，但這個元件對顏色的使用增加了產生障礙的風險。

## 撰寫無障礙性驗收準則的指南

以下是我們用來撰寫無障礙性驗收準則的指南。

### 以無障礙需求為出發點

識別可能產生無障礙障礙的高風險區域，且導入標準防止障礙產生。

如果已經存在相似的準則，請對其進行審查並與無障礙需求的使用者進行測試。例如，無障礙自動完成功能的原始標準，是由自動完成元件團隊的前端開發者 Theodor Vararu 測試現有的自動完成函式庫所得出的。

通常，關於無障礙的定義已經在像 [WCAG](https://www.w3.org/TR/wai-aria-practices-1.1/) 的指南中有所記錄。提取適用於您正在建立之內容的特定規則，並連結到指南以提供上下文脈絡。考慮哪些規則最容易被違反，並給予它們更高的重要性。

### 不要過於通用

標準應具體且可測試。

當我們開始為元件撰寫無障礙性驗收標準時，我們往往難以確定應該包含哪些內容。例如，對於包含連結的元件，標準是否應列出使連結具有無障礙性的所有內容？其中多少內容與現有指南的重複？

對於翻譯元件，建立一個我們可以連結的無障礙性連結共享定義是有幫助的。這樣既避免了標準過於模糊，同時也提供我們記錄更通用決策的地方。

### 不要定義解決方案

類似於使用者故事中的驗收標準，無障礙性驗收標準描述的是一個結果，而非解決方案。

標準應該提供解釋的空間，允許設計師和開發者隨著時間進行改進。理想情況下，如果技術或設計發生變化，標準仍然適用。

例如，在標題元件的標準中，我們聲明所需的對比度，但我們不會限制設計與實作的具體細節，如字體大小或顏色。

### 反覆修改標準

當某個專案正在建立和測試時，持續依據發現的需求不斷精進您的標準。當發現無障礙性問題——瀏覽器問題、螢幕報讀器問題、新技術出現問題時，請增加進階的標準，並將它們視為未通過的單元測試。

## 下一步是什麼？

為 GOV.UK 上的使用者介面撰寫無障礙性驗收標準是一項新的做法，我們將繼續完善並建立相應的流程。我們將在我們的元件指南和開發者文件中包含無障礙性驗收標準（可以查看[內容列表元件](https://government-frontend.herokuapp.com/component-guide/contents-list)以瞭解範例）。
