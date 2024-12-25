# 支援卓越營運的雲端架構設計模式

設計工作負載 (workload) 架構時，建議使用經業界驗證過的設計模式 (design
pattern) 來因應常見挑戰。設計模式不僅有助於您在工作負載設計中做出權衡取捨，還能針對預期目標進行改善。設計模式有助於緩解工作負載營運可能出現的問題，諸如影響系統可靠性、安全性、效能和成本等特定面向所帶來之風險。設計模式以實務經驗為後盾，專門針對雲端環境的擴展性與營運需求設計，並且不受限於特定雲端服務供應商 (vendor
agnostic)。將這些廣為人知的設計模式用於標準化工作負載設計，是實現卓越營運 (operational
excellence) 的關鍵要素之一。

許多設計模式同時支援「良好架構框架」 (Well-Architected Framework)
中的多個架構原則 (pillar)。支援卓越營運原則的設計模式，其布局結構 (topology) 為安全部署實踐 (safe
deployment practice,
SDP) 提供了堅實的基礎，並促進架構隨著時間、遷移情境 (migration
scenario) 和可監測性 (observability) 的變動而演進。

## 目錄

  - [卓越營運的設計模式](#卓越營運的設計模式)
  - [後續步驟](#後續步驟)

## 卓越營運的設計模式

下表歸納了支援卓越營運目標的雲端設計模式。

| 設計模式 | 摘要 |
|----|----|
| [**防損毀層（Anti-Corruption Layer）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/anti-corruption-layer-content.md) | 在舊元件與新元件互動過程之間加入中介層，透過中介層代理兩者的互動，保護新系統元件不受現有系統的行為或實作選擇的影響。此模式有助於確保新元件整合到現有系統時，即便現有系統採用不同資料模型、或業務規則，新元件功能依然不會受影響。這個模式在漸進式系統遷移中特別實用，可以減少新元件的技術負債，同時維持對現有元件的支援。 |
| [**編排（Choreography）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/choreography-content.md) | 透過使用分散、事件導向的通訊，協調工作負載中自主分散式元件的行為。此模式適用於需頻繁更新或發佈版本的工作負載，因分散式元件具備自主運作能力，能以對系統變更最少的方式來調整工作負載。 |
| [**運算資源整合（Compute Resource Consolidation）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/compute-resource-consolidation-content.md) | 透過增加密度，將運算資源進行最理想配置和整合。此模式將多個應用程式或工作負載的多個元件整合在共享的基礎架構上。運算資源整合帶來了同質性更高的運算平台，可以簡化管理與監測任務，集中式處理營運任務，並降低所需的工具數量。 |
| [**部署戳記（Deployment Stamps）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/deployment-stamp-content.md) | 假設環境中可能部署單一種版本，或同時存在多種不同版本，這個方法可將特定版本的應用程式連同其依賴的系統架構發布成可以操控的部署單元。「部署戳記」與「不可變的基礎架構」(immutable infrastructure) 目標都是能夠支援進階部署模型，並有利於實踐安全部署。 |
| [**外部組態設定存放區（External Configuration Store）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/external-configuration-store-content.md) | 將組態設定擷取到外部服務，使得應用程式無需變更程式碼或重新部署即可動態更新組態設定。這種將應用程式組態設定與程式碼分離的方法，可以達到針對特定環境設定不同組態值，並對組態值進行版本控制。外部組態設定存放區也常用來管理功能標示 (feature flag)，以實踐安全部署。 |
| [**閘道聚合（Gateway Aggregation）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/gateway-aggregation-content.md) | 將多個後端服務聚合後發送單一請求，簡化使用者端 (client) 與工作負載的互動。這樣的布局結構 (topology) 使後端邏輯能夠獨立於使用者端發展，就算不變更使用者端接觸點，還是可讓您變更一連串彼此相依的服務實作、或單純變更資料來源。 |
| [**閘道卸除（Gateway Offloading）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/gateway-offloading-content.md) | 在請求轉送到後端節點之前的處理工作卸載到閘道裝置 (gateway device)，使得卸除功能可集中於單點維護與管理，不需於多個節點進行分散管理。 |
| [**閘道路由（Gateway Routing）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/gateway-offloading-content.md) | 根據請求意圖、業務邏輯和後端可用性，將網路傳入的請求路由到各種後端系統。閘道路由讓您能將請求與後端解耦，使您的後端能支援進階部署模型、平台轉換，以及網域解析和傳輸中加密的單點管理。 |
| [**健康狀態端點監測（Health Endpoint Monitoring）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/health-endpoint-monitoring-content.md) | 透過發布專為監測系統健康狀態而設計的端點，達成監測系統健康狀態的目的。整個工作負載中哪些健康狀態端點應該公開，以及監測結果應該分為哪些層級分析，都加以標準化，可以幫助您將問題分級並進行處置。 |
| [**傳訊網橋（Messaging Bridge）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/messaging-bridge-content.md) | 提供一個中介服務，讓使用不同通訊協定或格式的系統能夠互相通訊。當您在工作負載中轉換訊息傳遞技術，或遇到來自外部的異質需求時，這種解耦方式能提供彈性。 |
| [**發布/訂閱（Publisher/Subscriber）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/publisher-subscriber-content.md) | 透過將使用者端與服務之間的直接通訊，替換為使用中介訊息代理程式或事件匯流排，可以有效解耦架構中的元件。這種中介層級允許安全地進行變更發布端或訂閱端，而無需同步調整雙方元件。 |
| [**隔離（Quarantine）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/quarantine-content.md) | 確保工作負載使用到的外部元件符合服務水準協議 （service-level agreement, SLA）。這些檢查的自動化和一致性，是工作負載的軟體開發生命週期和安全部署實踐的一部分。 |
| [**邊車（Sidecar）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/sidecar-content.md) | 透過將非主要的功能或跨多個元件 （cross-cutting） 的任務，封裝在與主應用程式共存的附加程式中，可以擴展應用程式的功能。此模式提供一種能彈性整合工具的方法，主應用程式不需要直接實作一些非主要的功能、或跨多個元件的任務，就可以增強應用程式的可監測性。邊車功能能夠獨立於主應用程式的生命週期外進行開發與維護。 |
| [**逐步更新（Strangler Fig）**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/strangler-fig-content.md) | 以系統化方式逐步用新元件替換現有系統元件，且通常是在系統移轉或更新的期間進行。此設計模式透過增量(疊代)的方法 (incremental approach) 有助於緩解過渡期間的風險。 |

## 後續步驟

檢視支援 Azure Well-Architected Framework 其他原則的雲端架構設計模式：

- [支援可靠性的雲端架構設計模式](https://learn.microsoft.com/en-us/azure/well-architected/reliability/design-patterns)

- [支援安全性的雲端架構設計模式](https://learn.microsoft.com/en-us/azure/well-architected/security/design-patterns)

- [支援最理想成本的雲端架構設計模式](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/design-patterns)

- [支援效能效率的雲端架構設計模式](https://learn.microsoft.com/en-us/azure/well-architected/performance-efficiency/design-patterns)
