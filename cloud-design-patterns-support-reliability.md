## 支援高可靠性的雲端架構設計模式

在設計系統工作負載 (workload) 的架構時，建議使用經業界驗證過的設計模式 (design
pattern,
即設計解決方案) 來應對常見挑戰。設計模式不僅有助於您在工作負載設計中做出權衡，還能針對預期目標進行改善。設計模式可能有助於緩解諸如影響系統安全性、效能、成本與營運等特定問題所帶來之風險，甚至導致系統可靠性 (Reliability) 問題。設計模式以實務經驗為後盾，專為雲端的擴展性與營運模式而設計，並且不受特定雲端服務供應商 (vendor
agnostic) 限制。將這些廣為人知的模式用於標準化工作負載設計，是實現卓越營運 (operational
excellence) 的關鍵要素之一。

許多設計模式同時支援「良好架構框架」(Well-Architected Framework)
中一個以上的架構原則 (pillar)。其中，專注於處理可靠性原則的設計模式，會優先考慮工作負載的可用性、自我保護能力、復原能力、資料完整性與處理完整性 (processing
integrity) 以及故障隔離 (containment of malfunctions)。

## 目錄

  - [高可靠性設計模式](#高可靠性設計模式)
  - [後續步驟](#後續步驟)

## 高可靠性設計模式

下表歸納了支援可靠性目標的雲端架構設計模式。

| 設計模式 | 摘要 |
|----|----|
| [**大使 (Ambassador)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/ambassador-content.md) | 封裝 (encapsulate) 並管理網路通訊，透過卸載 (offloading) 與網路通訊相關的橫向聯繫 (cross-cutting) 任務，進而建立協助服務 (helper services)，代替使用者端 (client) 傳送網路通訊請求。多了這項中介點 (mediation point)，讓網路通訊中有機會導入可靠性的設計模式，例如重試機制或緩衝。 |
| [**前端的專屬後端 (Backends for Frontends)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/backends-for-frontends-content.md) | 透過為特定前端介面分別建立專屬的後端服務，個別化工作負載的服務層 (service layer)。有別於前端介面，建立專屬後端服務的這種分離做法，可以在其中一個使用者端的服務層故障時，不影響其他使用者端存取之可用性。當您對不同的使用者端採取不同處理方式時，可以預先根據不同的使用者端存取模式，規劃要優先處理哪些可提升可靠性的工作。 |
| [**隔板 (Bulkhead)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/bulkhead-content.md) | 在元件之間刻意分段，以隔離故障的影響範圍。這種故障隔離策略試圖將故障限縮在發生問題的隔板範圍內，進而防止影響其他隔板。 |
| [**另行快取 (Cache-Aside)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/cache-aside-content.md) | 針對頻繁讀取的資料，按需求建立快取，改善系統存取效能，後續對相同資料的請求就可以重複使用這個快取。當原始來源資料存放區 (data store) 暫時不可用時，快取建立資料複寫 (data replicatiom) 即可確保經常存取之資料可用性。此外，如果快取發生故障，工作負載可以退回 (fall back) 原始的資料存放區，確保系統仍持續運作。 |
| [**斷路器 (Circuit Breaker)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/circuit-breaker-content.md) | 防止對故障或不可用的相依元件持續發出請求。這個設計模式在故障發生時，可防止相依元件過載 (overloading)，也可以在工作負載中觸發優雅降級 (graceful degradation) 流程。斷路器模式通常與自動復原功能相結合，以提供自我保護與自我修復。 |
| [**宣告檢查 (Claim Check)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/claim-check-content.md) | 將資料與訊息傳遞的路徑 (messaging flow) 分離，提供一種單獨檢索與訊息相關資料的方法。訊息匯流排 (message bus) 通常不提供具備可靠性與災害復原能力的專用儲存區。因此將資料與訊息分離，將可以提升底層資料的可靠性。這種分離模式也能在災害發生後採用訊息佇列復原方法 (message queue recovery approach)。 |
| [**補償交易 (Compensating Transaction)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/compensating-transaction-content.md) | 因為套用某些操作使系統處在故障狀態，可以透過逆轉這些操作的影響效果復原系統。此設計模式透過補償操作來解決關鍵工作負載路徑中的故障，例如可能涉及直接還原 (rolling back) 資料變更、解除交易鎖定 (transaction lock)，甚至執行原生系統操作 (native system behavior) 等，來逆轉故障造成的影響。 |
| [**競爭取用者 (Competing Consumers)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/competing-consumers-content.md) | 透過分散式與並行的處理方式 (distributed and concurrent processing)，有效處理佇列中的項目。此設計模式將取用者視為複本 (replica)，在佇列中建置備援 (redundancy)，因此執行個體 (instance) 故障時，取用者之間不會互相影響，還是可以處理其他取用者的佇列訊息 (queue message)。 |
| [**事件來源 (Event Sourcing)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/event-sourcing-content.md) | 將狀態變更 (state change) 視為一系列的事件，將這些事件資訊擷取並記錄在不可變、只能增加的日誌紀錄中。複雜的業務流程中需要可靠的變更歷程時，可以使用此設計模式。如果您需要復原狀態 (recover state store)，這設計模式也有助於狀態重建 (state reconstruction)。 |
| [**聯合身分鑑別 (Federated Identity)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/federated-identity-content.md) | 將系統信任工作委託給外部的身分鑑別服務提供者，用於管理使用者，並為應用程式提供權限驗證。透過委託身分鑑別服務提供者的機制，可提高系統元件的可靠性，且這些服務提供者通常具有較高的服務水準協議 (Service-Level Agreement, SLA)。此外，當工作負載進行災害復原時，身分驗證元件則可能不需要列入復原計畫處理。 |
| [**閘道聚合 (Gateway Aggregation)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/gateway-aggregation-content.md) | 調用多個後端服務時聚合在單一請求 (request) 中，簡化使用者端與工作負載的互動。這樣的布局結構 (topology) 才能夠集中式地處理暫時性故障 (transient fault)，避免跨多個使用者端的分散式處理。 |
| [**閘道卸除 (Gateway Offloading)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/gateway-offloading-content.md) | 在請求轉送到後端節點之間的過程，將處理這些請求的工作卸載到閘道裝置 (gateway device)。將此責任卸載給閘道，可以降低後端節點上程式碼的複雜性。在某些情況下，將處理請求的工作卸載到閘道上，會完全取代原本的後端功能，讓整體系統更為可靠。 |
| [**閘道路由 (Gateway Routing)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/gateway-routing-content.md) | 根據請求目的、業務邏輯與後端可用性，將傳入的網路請求導向不同的後端系統。閘道路由能夠控制流量導向系統中正常運行的節點，避免導向故障的節點，確保請求被正確地處理。 |
| [**地理柵欄 (Geode)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/geodes-content.md) | 系統在多個地理位置上部署，並以 active-active 高可用性模式運作。此設計模式之理想狀態是利用資料複寫功能，達到任何使用者端都可以連接到任一地理位置上部署的執行個體，並可以承受一個或多個地理區域性的服務中斷。 |
| [**健康狀態端點監測 (Health Endpoint Monitoring)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/health-endpoint-monitoring-content.md) | 透過發布專為監測系統健康狀態而設計的端點，達成監測系統健康狀態的目的。您可以使用此端點管理工作負載的健康狀態、發出警示與建立儀表板，也可以用此資訊來評估是否啟動自我修復的緩解措施。 |
| [**索引表 (Index Table)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/index-table-content.md) | 透過讓使用者端能查找中繼資料 (metadata)，優化分散式資料存放區的資料檢索效能，以便直接檢索資料，而不需掃描完整的資料存放區。由於使用者端會透過查找流程指向特定的分片 (shard)、分區 (partition) 或端點 (endpoint)，您可以使用此模式來推動資料存取的容錯移轉方法 (failover approach)。 |
| [**領導者遴選 (Leader Election)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/leader-election-content.md) | 分散式應用執行個體，透過設定其中一個執行個體作為*領導者*角色，由領導者負責協調與實現目標相關的工作。此設計模式可透過重新分派工作來緩解節點故障的影響。當領導者失靈時，也能透過共識演算法 (consensus algorithm) 協調、重新分派工作，也就是實行容錯移轉 (failover)。 |
| [**流水線與篩選邏輯 (Pipes and Filters)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/pipes-and-filters-content.md) | 將複雜的資料處理分解為一系列獨立的階段，以實現特定的結果。各個階段專注處理單一任務，避免各種資料處理任務互相干擾。 |
| [**優先順序佇列 (Priority Queue)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/priority-queue-content.md) | 確保高優先權的項目在低優先權項目之前處理完成。根據業務優先處理層級區分項目，讓您專注處理最重要的任務上。 |
| [**發布/訂閱 (Publisher/Subscriber)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/publisher-subscriber-content.md) | 透過將使用者端-服務端 (client-to-service) 直接通訊的方式，替換為透過中介訊息代理程式或事件匯流排方式進行，解耦架構中多個元件的相依性。 |
| [**佇列型負載調節 (Queue-Based Load Leveling)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/queue-based-load-leveling-content.md) | 透過將傳入的請求或任務移至佇列中緩衝，並區分優先序加以處理，讓佇列處理器以規劃的速度處理任務。這種方法可以將接收任務與後續處理分開，以提升應對突發需求 (sudden spike) 的韌性，還可隔離佇列處理中的故障，以免影響接收任務。 |
| [**速率限制 (Rate Limiting)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/rate-limiting-pattern-content.md) | 控制使用者端請求的速率，以避免節流錯誤 (throttling error)、發生錯誤時未受限地重試 (unbounded retry-on-error) 等情況。如果服務有設定不能超過某個數量或大小的存取限制，此設計模式可以透過掌握目前存取是否已達到上限與服務通訊成本，避免節流錯誤與使用者端未受限地重試。它的運作原理是針對特定期間內，控制有多少數量和/或大小的作業可以傳送到服務端。 |
| [**重試機制 (Retry)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/retry-content.md) | 透過規劃中的方式重新嘗試某些作業來解決暫時性或間歇性的故障。緩解分散式系統中的暫時性故障是提高系統工作負載韌性的關鍵技術。 |
| [**Saga 分散式交易 (Saga distributed transactions)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/reference-architectures/saga/saga-content.md) | 透過將工作分解為較小的獨立交易 (transaction) 序列，協調耗時較長且可能較為複雜的交易。每筆交易也必須具有補償操作，以反轉交易執行中的失敗狀況並保持交易紀錄完整性。由於跨多個分散式系統的整合型交易通常是不可能實現的，因此這個設計模式透過實行單元化 (atomicity) 與補償操作，來達成資料的一致性與可靠性。 |
| [**排程器代理程式監督員 (Scheduler Agent Supervisor)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/scheduler-agent-supervisor-content.md) | 根據系統中可監測到的因素，在系統中有效重新分配任務。此設計模式使用健康狀況指標來偵測故障，並將任務重新導向到健康的代理程式，以緩解故障的影響。 |
| [**循序車隊 (Sequential Convoy)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/sequential-convoy-content.md) | 維護系統在接收與處理多條訊息同時傳入的情境，也支援依預定的順序進行處理。此設計模式可以避免一些難以排除故障的狀況，例如競爭情境 (race condition)、有衝突訊息 (contentious message) 的處理，或錯誤排序訊息可能造成的故障因應等，並為這些狀況提供解決方法。 |
| [**分區(片)化 (Sharding)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/sharding-content.md) | 將系統負載工作導向特定的邏輯區塊位置 (logical direction) 來處理特定的請求，實現資料儲存託管 (colocation) 達到最理想的效能。由於資料或請求處理被隔離在各個分片中，因此一個分片中的故障不會影響到其他分片。 |
| [**Strangler Fig**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/strangler-fig-content.md) | 用新元件以系統化方式替換運作中的系統元件，且通常是在系統移轉或更新的期間進行。此設計模式透過增量(疊代)的方法 (incremental approach) 有助於緩解過渡期間的風險。 |
| [**節流(Throttling)**](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/patterns/throttling-content.md) | 限制系統中資源或元件傳入請求的速率或處理量。設計這些限制有助於防止資源耗盡時可能造成的故障。您也可以使用此設計模式作為啟動優雅降級程序的控制機制。 |

## 後續步驟

檢視支援 Azure Well-Architected Framework 其他原則的雲端架構設計模式：

- [支援安全性的雲端架構設計模式](https://learn.microsoft.com/en-us/azure/well-architected/security/design-patterns)

- [支援最理想成本的雲端架構設計模式](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/design-patterns)

- [支援卓越營運的雲端架構設計模式](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/design-patterns)

- [支援效能效率的雲端架構設計模式](https://learn.microsoft.com/en-us/azure/well-architected/performance-efficiency/design-patterns)
