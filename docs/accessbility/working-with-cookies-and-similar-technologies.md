# 使用 cookies 和類似技術的工作指南

使用 Cookie 和類似技術

[https://www.gov.uk/service-manual/technology/working-with-cookies-and-similar-technologies](https://www.gov.uk/service-manual/technology/working-with-cookies-and-similar-technologies)

Cookie是網站發送到使用者電腦的小型資料檔，用於儲存有關使用者瀏覽網站的資料。

本指南是介紹如何使用 Cookie，但當採用使用者設備中其他資訊儲存的技術時，您應該遵循相同的指南，例如 HTML5 local storage。

## 目錄

 - [如何使用 Cookie](#如何使用-cookie)
 - [如何建立 Cookie 頁面](#如何建立-cookie-頁面)
 - [應用 Cookie 的範圍](#應用-cookie-的範圍)
 - [相關指南](#相關指南)

## 如何使用 Cookie

儘量減少 Cookie 的使用，並對您使用的 Cookie 透明化。您必須：

- 盡可能使用少量 Cookie，停用任何不再需要的 Cookie
- 儘量儲存所需的最少量資訊，並盡可能縮短保存時間
- 發佈 Cookie 政策，告知使用者使用了哪些 Cookie
- 在設定任何對您所提供服務非必要的 Cookie 前，必須要獲得使用者的同意

## 如何建立 Cookie 頁面

在 GOV.UK 設計系統中提供了以下相關資訊：

- [如何建立 cookie 頁面](https://design-system.service.gov.uk/patterns/cookies-page/)，包括哪些Cookie需要徵得同意
- [如何建立 Cookie 標題](https://design-system.service.gov.uk/components/cookie-banner)

## 應用 Cookie 的範圍

Cookie 必須僅適用於您的原始網域。例如，`www.servicename.service.gov.uk` 而非 `.gov.uk`。

不要在僅托管靜態資源(如圖像或 JavaScript)的網域上使用 Cookie ——它只會降低使用者的回應時間，並且沒有任何好處。

您應該只發送帶有 Secure 屬性且在適當情況下帶有 HttpOnly 屬性的 Cookie。這些旗標 (flag) 提供瀏覽器如何處理 Cookie 提供的額外保證。

## 相關指南

您可能會發現有關[選擇數位分析工具](https://www.gov.uk/service-manual/measuring-success/choosing-digital-analytics-tools)的指南很有用。
