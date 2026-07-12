# Graph Report - odoo-2026  (2026-07-12)

## Corpus Check
- 193 files · ~281,493 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 597 nodes · 619 edges · 37 communities detected
- Extraction: 73% EXTRACTED · 27% INFERRED · 0% AMBIGUOUS · INFERRED: 169 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 23 edges
2. `AssetRepository` - 15 edges
3. `AssetService` - 15 edges
4. `GenericRepository` - 13 edges
5. `cn()` - 13 edges
6. `NotificationService` - 12 edges
7. `WorkflowEngine` - 11 edges
8. `AssetTimelineRepository` - 10 edges
9. `ApprovalService` - 10 edges
10. `DomainEventService` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AIChatbot()` --calls--> `useTheme()`  [INFERRED]
  frontend\components\AIChatbot.jsx → frontend\hooks\useTheme.js
- `AIVisualization()` --calls--> `useTheme()`  [INFERRED]
  frontend\components\AIVisualization.jsx → frontend\hooks\useTheme.js
- `CTA()` --calls--> `useTheme()`  [INFERRED]
  frontend\components\CTA.jsx → frontend\hooks\useTheme.js
- `Footer()` --calls--> `useTheme()`  [INFERRED]
  frontend\components\Footer.jsx → frontend\hooks\useTheme.js
- `Hero()` --calls--> `useTheme()`  [INFERRED]
  frontend\components\Hero.jsx → frontend\hooks\useTheme.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (6): ApprovalService, AssetForm(), AssetImageRepository, AuthService, OrganizationSettingsService, TransferService

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (6): AssetDocumentRepository, AssetTimelineRepository, DashboardService, GenericRepository, NotificationService, paginate()

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (21): AIChatbot(), AIVisualization(), CTA(), FAQ(), FAQItem(), FeatureCard(), Features(), Footer() (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (6): AssetCategoryService, DepartmentService, EmployeeService, LocationService, buildQuery(), ResourceService

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (16): AppLayout(), useAuth(), AuthPage(), Button(), Card(), CardBody(), CardFooter(), CardHeader() (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (5): ActivityLogService, AllocationService, AuditService, BookingService, MaintenanceService

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (2): AssetNumberService, AssetService

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (2): StateMachine, WorkflowEngine

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (4): AllocationForm(), TransferRequestForm(), useAllocateAsset(), useRequestTransfer()

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (1): AssetRepository

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (6): DatabaseConnectionError, DatabaseError, DuplicateRecordError, NotFoundError, UnauthorizedError, ValidationError

### Community 11 - "Community 11"
Cohesion: 0.2
Nodes (1): DomainEventService

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (1): NotificationRepository

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (1): WorkflowValidator

### Community 14 - "Community 14"
Cohesion: 0.39
Nodes (1): FileStorageService

### Community 15 - "Community 15"
Cohesion: 0.36
Nodes (1): QRCodeService

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (2): connectDB(), startServer()

### Community 17 - "Community 17"
Cohesion: 0.53
Nodes (1): TimelineService

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (1): ErrorBoundary

### Community 19 - "Community 19"
Cohesion: 0.6
Nodes (3): executeInTransaction(), executeWithSavepoint(), handleTransactionError()

### Community 20 - "Community 20"
Cohesion: 0.7
Nodes (4): callGroq(), cleanResponse(), getMockResponse(), sendMessage()

### Community 26 - "Community 26"
Cohesion: 0.67
Nodes (1): ActivityLogRepository

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (1): AllocationRepository

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (1): AssetCategoryRepository

### Community 29 - "Community 29"
Cohesion: 0.67
Nodes (1): AuditItemRepository

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (1): AuditRepository

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (1): BookingRepository

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (1): DepartmentRepository

### Community 33 - "Community 33"
Cohesion: 0.67
Nodes (1): EmployeeRepository

### Community 34 - "Community 34"
Cohesion: 0.67
Nodes (1): LocationRepository

### Community 35 - "Community 35"
Cohesion: 0.67
Nodes (1): MaintenanceRepository

### Community 36 - "Community 36"
Cohesion: 0.67
Nodes (1): OrganizationSettingsRepository

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (1): ResourceRepository

### Community 38 - "Community 38"
Cohesion: 0.67
Nodes (1): TransferRepository

### Community 39 - "Community 39"
Cohesion: 0.67
Nodes (1): UserRepository

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (1): ReportService

### Community 41 - "Community 41"
Cohesion: 0.67
Nodes (1): ApiResponse

## Knowledge Gaps
- **Thin community `Community 6`** (25 nodes): `AssetNumberService`, `.generateAssetNumber()`, `.isAssetNumberUnique()`, `.validateAssetNumber()`, `.assetTagExists()`, `.serialNumberExists()`, `AssetService`, `.create()`, `.delete()`, `.deleteDocument()`, `.deleteImage()`, `.getById()`, `.getQRCode()`, `.getStatistics()`, `.getTimeline()`, `.regenerateQRCode()`, `.update()`, `.uploadDocument()`, `.uploadImage()`, `.deleteById()`, `AssetNumberService.js`, `AssetService.js`, `.deleteFile()`, `.findById()`, `.createTimelineEvent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (24 nodes): `.returnAsset()`, `StateMachine.js`, `WorkflowEngine.js`, `StateMachine`, `.getAllStates()`, `.getValidTransitions()`, `.getWorkflowType()`, `.isTerminalState()`, `.validateCanAllocate()`, `.validateCanReturn()`, `.validateCanStartMaintenance()`, `.validateCanTransfer()`, `.validateTransition()`, `WorkflowEngine`, `.emitWorkflowEvent()`, `.executeWorkflow()`, `.generateWorkflowId()`, `.getValidTransitions()`, `.validateAllocationPreconditions()`, `.validateApprovalPreconditions()`, `.validatePreconditions()`, `.validateReturnPreconditions()`, `.validateStateTransition()`, `.validateTransferPreconditions()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (13 nodes): `AssetRepository`, `.assetNumberExists()`, `.constructor()`, `.countByStatus()`, `.findByAssetNumber()`, `.findByDepartment()`, `.findBySerialNumber()`, `.findByStatus()`, `.findByTag()`, `.findWarrantyExpiryWarning()`, `.getAssetWithFullDetails()`, `.getStatistics()`, `AssetRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (10 nodes): `DomainEventService.js`, `DomainEventService`, `.clearSubscribers()`, `.constructor()`, `.createPayload()`, `.generateEventId()`, `.getSubscriberCount()`, `.subscribe()`, `.subscribeOnce()`, `.unsubscribe()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (9 nodes): `NotificationRepository.js`, `NotificationRepository`, `.constructor()`, `.countUnread()`, `.deleteOldNotifications()`, `.findByUser()`, `.markAllUserAsRead()`, `.markAsRead()`, `.markMultipleAsRead()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (9 nodes): `WorkflowValidator.js`, `WorkflowValidator`, `.validateAllocationRequest()`, `.validateFilters()`, `.validatePagination()`, `.validateReturnRequest()`, `.validateTransferApprovalRequest()`, `.validateTransferRejectionRequest()`, `.validateTransferRequest()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (8 nodes): `FileStorageService.js`, `FileStorageService`, `.constructor()`, `.formatFileSize()`, `.initializeDirectories()`, `.uploadDocument()`, `.uploadImage()`, `.validateFile()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (8 nodes): `QRCodeService.js`, `QRCodeService`, `.constructor()`, `.generateQRCode()`, `.generateQRCodeFile()`, `.initializeDirectories()`, `.regenerateQRCode()`, `.validateQRData()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (7 nodes): `connection.js`, `server.js`, `connectDB()`, `disconnectDB()`, `isValidObjectId()`, `transaction()`, `startServer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (6 nodes): `TimelineService.js`, `TimelineService`, `.formatTimeline()`, `.getEventsByType()`, `.getLatestEvent()`, `.getTimeline()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (6 nodes): `ErrorBoundary`, `.componentDidCatch()`, `.constructor()`, `.getDerivedStateFromError()`, `.render()`, `ErrorBoundary.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (3 nodes): `ActivityLogRepository`, `.constructor()`, `ActivityLogRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (3 nodes): `AllocationRepository`, `.constructor()`, `AllocationRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (3 nodes): `AssetCategoryRepository`, `.constructor()`, `AssetCategoryRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (3 nodes): `AuditItemRepository`, `.constructor()`, `AuditItemRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (3 nodes): `AuditRepository`, `.constructor()`, `AuditRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (3 nodes): `BookingRepository.js`, `BookingRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (3 nodes): `DepartmentRepository.js`, `DepartmentRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (3 nodes): `EmployeeRepository.js`, `EmployeeRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (3 nodes): `LocationRepository.js`, `LocationRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (3 nodes): `MaintenanceRepository.js`, `MaintenanceRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (3 nodes): `OrganizationSettingsRepository.js`, `OrganizationSettingsRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (3 nodes): `ResourceRepository.js`, `ResourceRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (3 nodes): `TransferRepository.js`, `TransferRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (3 nodes): `UserRepository.js`, `UserRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (3 nodes): `ReportService.js`, `ReportService`, `.getReports()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (3 nodes): `ApiResponse`, `.constructor()`, `apiResponse.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GenericRepository` connect `Community 1` to `Community 0`, `Community 3`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `AssetRepository` connect `Community 9` to `Community 5`, `Community 6`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useTheme()` (e.g. with `AIChatbot()` and `AIVisualization()`) actually correct?**
  _`useTheme()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `cn()` (e.g. with `Button()` and `Card()`) actually correct?**
  _`cn()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._