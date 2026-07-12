# Graph Report - backend  (2026-07-12)

## Corpus Check
- 101 files · ~14,554 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 329 nodes · 354 edges · 29 communities detected
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 93 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]

## God Nodes (most connected - your core abstractions)
1. `AssetRepository` - 15 edges
2. `AssetService` - 15 edges
3. `GenericRepository` - 13 edges
4. `AssetTimelineRepository` - 10 edges
5. `AssetDocumentRepository` - 9 edges
6. `AssetImageRepository` - 8 edges
7. `FileStorageService` - 8 edges
8. `AuthService` - 7 edges
9. `QRCodeService` - 7 edges
10. `AssetCategoryService` - 6 edges

## Surprising Connections (you probably didn't know these)
- `startServer()` --calls--> `connectDB()`  [INFERRED]
  server.js → core\connection.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (6): AssetDocumentRepository, AssetTimelineRepository, DashboardService, GenericRepository, paginate(), TimelineService

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (5): AssetCategoryService, DepartmentService, EmployeeService, LocationService, buildQuery()

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (4): AssetImageRepository, AuthService, OrganizationSettingsService, ResourceService

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (6): ActivityLogService, AllocationService, BookingService, MaintenanceService, NotificationService, TransferService

### Community 4 - "Community 4"
Cohesion: 0.24
Nodes (1): AssetService

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (1): AssetRepository

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (6): DatabaseConnectionError, DatabaseError, DuplicateRecordError, NotFoundError, UnauthorizedError, ValidationError

### Community 7 - "Community 7"
Cohesion: 0.39
Nodes (1): FileStorageService

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (2): connectDB(), startServer()

### Community 9 - "Community 9"
Cohesion: 0.38
Nodes (1): QRCodeService

### Community 10 - "Community 10"
Cohesion: 0.4
Nodes (1): AuditService

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (1): AssetNumberService

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (1): ActivityLogRepository

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (1): AllocationRepository

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (1): AssetCategoryRepository

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (1): AuditItemRepository

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (1): AuditRepository

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (1): BookingRepository

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (1): DepartmentRepository

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (1): EmployeeRepository

### Community 23 - "Community 23"
Cohesion: 0.67
Nodes (1): LocationRepository

### Community 24 - "Community 24"
Cohesion: 0.67
Nodes (1): MaintenanceRepository

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (1): NotificationRepository

### Community 26 - "Community 26"
Cohesion: 0.67
Nodes (1): OrganizationSettingsRepository

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (1): ResourceRepository

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (1): TransferRepository

### Community 29 - "Community 29"
Cohesion: 0.67
Nodes (1): UserRepository

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (1): ReportService

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (1): ApiResponse

## Knowledge Gaps
- **Thin community `Community 4`** (21 nodes): `.assetTagExists()`, `.serialNumberExists()`, `AssetService`, `.create()`, `.delete()`, `.deleteDocument()`, `.deleteImage()`, `.getById()`, `.getQRCode()`, `.getStatistics()`, `.getTimeline()`, `.regenerateQRCode()`, `.update()`, `.uploadDocument()`, `.uploadImage()`, `.deleteById()`, `.deleteFile()`, `.findById()`, `.generateQRCode()`, `AssetService.js`, `.createTimelineEvent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (16 nodes): `AssetRepository`, `.assetNumberExists()`, `.constructor()`, `.countByStatus()`, `.findByAssetNumber()`, `.findByDepartment()`, `.findBySerialNumber()`, `.findByStatus()`, `.findByTag()`, `.findWarrantyExpiryWarning()`, `.getAssetWithFullDetails()`, `.getStatistics()`, `.searchWithFilters()`, `.getAll()`, `.search()`, `AssetRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (8 nodes): `FileStorageService`, `.constructor()`, `.formatFileSize()`, `.initializeDirectories()`, `.uploadDocument()`, `.uploadImage()`, `.validateFile()`, `FileStorageService.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (7 nodes): `connectDB()`, `disconnectDB()`, `isValidObjectId()`, `transaction()`, `connection.js`, `server.js`, `startServer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (7 nodes): `QRCodeService`, `.constructor()`, `.generateQRCodeFile()`, `.initializeDirectories()`, `.regenerateQRCode()`, `.validateQRData()`, `QRCodeService.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (6 nodes): `AuditService`, `.closeAudit()`, `.create()`, `.getAll()`, `.verifyItem()`, `AuditService.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (5 nodes): `AssetNumberService`, `.generateAssetNumber()`, `.isAssetNumberUnique()`, `.validateAssetNumber()`, `AssetNumberService.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (3 nodes): `ActivityLogRepository`, `.constructor()`, `ActivityLogRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (3 nodes): `AllocationRepository`, `.constructor()`, `AllocationRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (3 nodes): `AssetCategoryRepository`, `.constructor()`, `AssetCategoryRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (3 nodes): `AuditItemRepository`, `.constructor()`, `AuditItemRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (3 nodes): `AuditRepository`, `.constructor()`, `AuditRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (3 nodes): `BookingRepository`, `.constructor()`, `BookingRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (3 nodes): `DepartmentRepository`, `.constructor()`, `DepartmentRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (3 nodes): `EmployeeRepository`, `.constructor()`, `EmployeeRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (3 nodes): `LocationRepository`, `.constructor()`, `LocationRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (3 nodes): `MaintenanceRepository`, `.constructor()`, `MaintenanceRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (3 nodes): `NotificationRepository`, `.constructor()`, `NotificationRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (3 nodes): `OrganizationSettingsRepository`, `.constructor()`, `OrganizationSettingsRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (3 nodes): `ResourceRepository.js`, `ResourceRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (3 nodes): `TransferRepository.js`, `TransferRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (3 nodes): `UserRepository.js`, `UserRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (3 nodes): `ReportService`, `.getReports()`, `ReportService.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (3 nodes): `ApiResponse`, `.constructor()`, `apiResponse.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GenericRepository` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `AssetRepository` connect `Community 5` to `Community 4`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `FileStorageService` connect `Community 7` to `Community 4`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._