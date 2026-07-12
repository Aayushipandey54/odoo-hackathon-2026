# Graph Report - odoo-2026  (2026-07-12)

## Corpus Check
- 154 files · ~180,588 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 376 nodes · 324 edges · 31 communities detected
- Extraction: 73% EXTRACTED · 27% INFERRED · 0% AMBIGUOUS · INFERRED: 87 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 23 edges
2. `GenericRepository` - 13 edges
3. `cn()` - 13 edges
4. `AuthService` - 7 edges
5. `AssetCategoryService` - 6 edges
6. `AssetService` - 6 edges
7. `DepartmentService` - 6 edges
8. `EmployeeService` - 6 edges
9. `LocationService` - 6 edges
10. `ResourceService` - 6 edges

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
Nodes (21): AIChatbot(), AIVisualization(), CTA(), FAQ(), FAQItem(), FeatureCard(), Features(), Footer() (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (5): AssetCategoryService, DepartmentService, EmployeeService, LocationService, buildQuery()

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (6): ActivityLogService, AllocationService, AssetService, BookingService, NotificationService, TransferService

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (3): AuthService, OrganizationSettingsService, ResourceService

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (12): Button(), Card(), CardBody(), CardFooter(), CardHeader(), cn(), EmptyState(), Input() (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (3): DashboardService, GenericRepository, paginate()

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (6): DatabaseConnectionError, DatabaseError, DuplicateRecordError, NotFoundError, UnauthorizedError, ValidationError

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (4): AppLayout(), useAuth(), AuthPage(), ProtectedRoute()

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (2): connectDB(), startServer()

### Community 9 - "Community 9"
Cohesion: 0.4
Nodes (1): AuditService

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (1): ErrorBoundary

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (1): MaintenanceService

### Community 12 - "Community 12"
Cohesion: 0.7
Nodes (4): callGroq(), cleanResponse(), getMockResponse(), sendMessage()

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (1): AssetRepository

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (1): ActivityLogRepository

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (1): AllocationRepository

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (1): AssetCategoryRepository

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (1): AuditItemRepository

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (1): AuditRepository

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (1): BookingRepository

### Community 23 - "Community 23"
Cohesion: 0.67
Nodes (1): DepartmentRepository

### Community 24 - "Community 24"
Cohesion: 0.67
Nodes (1): EmployeeRepository

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (1): LocationRepository

### Community 26 - "Community 26"
Cohesion: 0.67
Nodes (1): MaintenanceRepository

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (1): NotificationRepository

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (1): OrganizationSettingsRepository

### Community 29 - "Community 29"
Cohesion: 0.67
Nodes (1): ResourceRepository

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (1): TransferRepository

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (1): UserRepository

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (1): ReportService

### Community 33 - "Community 33"
Cohesion: 0.67
Nodes (1): ApiResponse

## Knowledge Gaps
- **Thin community `Community 8`** (7 nodes): `connection.js`, `server.js`, `connectDB()`, `disconnectDB()`, `isValidObjectId()`, `transaction()`, `startServer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (6 nodes): `AuditService`, `.closeAudit()`, `.create()`, `.getAll()`, `.verifyItem()`, `AuditService.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (6 nodes): `ErrorBoundary`, `.componentDidCatch()`, `.constructor()`, `.getDerivedStateFromError()`, `.render()`, `ErrorBoundary.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (5 nodes): `MaintenanceService.js`, `MaintenanceService`, `.create()`, `.getAll()`, `.updateStatus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (4 nodes): `AssetRepository`, `.constructor()`, `.findByTag()`, `AssetRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (3 nodes): `ActivityLogRepository`, `.constructor()`, `ActivityLogRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (3 nodes): `AllocationRepository`, `.constructor()`, `AllocationRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (3 nodes): `AssetCategoryRepository`, `.constructor()`, `AssetCategoryRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (3 nodes): `AuditItemRepository`, `.constructor()`, `AuditItemRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (3 nodes): `AuditRepository`, `.constructor()`, `AuditRepository.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (3 nodes): `BookingRepository.js`, `BookingRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (3 nodes): `DepartmentRepository.js`, `DepartmentRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (3 nodes): `EmployeeRepository.js`, `EmployeeRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (3 nodes): `LocationRepository.js`, `LocationRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (3 nodes): `MaintenanceRepository.js`, `MaintenanceRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (3 nodes): `NotificationRepository.js`, `NotificationRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (3 nodes): `OrganizationSettingsRepository.js`, `OrganizationSettingsRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (3 nodes): `ResourceRepository.js`, `ResourceRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (3 nodes): `TransferRepository.js`, `TransferRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (3 nodes): `UserRepository.js`, `UserRepository`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (3 nodes): `ReportService.js`, `ReportService`, `.getReports()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (3 nodes): `ApiResponse`, `.constructor()`, `apiResponse.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GenericRepository` connect `Community 5` to `Community 1`, `Community 2`, `Community 3`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `Community 0` to `Community 4`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 4` to `Community 7`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useTheme()` (e.g. with `AIChatbot()` and `AIVisualization()`) actually correct?**
  _`useTheme()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `cn()` (e.g. with `Button()` and `Card()`) actually correct?**
  _`cn()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._