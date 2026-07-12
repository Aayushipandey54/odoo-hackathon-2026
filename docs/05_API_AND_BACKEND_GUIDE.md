# AssetFlow — API & Backend Guide

Version: 1.0

---

# Document Purpose

This document defines the backend architecture, REST API conventions, service structure, validation strategy, and backend engineering standards for AssetFlow.

It serves as the implementation guide for every backend module.

This document should be read after:

- 01_CONTEXT.md
- 02_PRODUCT_REQUIREMENTS.md
- 03_SYSTEM_ARCHITECTURE.md
- 04_DATABASE_DESIGN.md

---

# 1. Backend Philosophy

The backend is responsible for:

- Business Logic
- Security
- Validation
- State Management
- Database Transactions
- Audit Events
- Notifications

The frontend is responsible only for presentation.

Every business rule must exist in the backend.

---

# 2. Layered Architecture

Every request follows the same lifecycle.

```

Request

↓

Middleware

↓

Controller

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL

↓

Response

```

---

# 3. Layer Responsibilities

## Controllers

Responsibilities:

- Receive request
- Validate request
- Authenticate user
- Call service
- Return response

Controllers must NEVER:

- Query Prisma
- Write business logic
- Perform calculations
- Change database state directly

---

## Services

Services are the heart of the application.

Responsibilities:

- Business Rules
- Workflow Execution
- Validation
- Transactions
- Notifications
- Audit Events
- State Transitions

---

## Repositories

Responsibilities:

- Read Database
- Write Database
- Execute Prisma Queries

Repositories must NEVER:

- Perform authorization
- Execute workflows
- Validate business rules

---

# 4. Folder Structure

```

backend/

src/

controllers/

services/

repositories/

routes/

middleware/

validators/

modules/

config/

utils/

types/

constants/

events/

socket/

prisma/

```

Feature modules:

```

modules/

auth/

organization/

assets/

workflow/

booking/

maintenance/

audit/

notification/

analytics/

ai/

```

---

# 5. REST API Standards

Use RESTful endpoints.

Examples

```

GET /assets

GET /assets/:id

POST /assets

PUT /assets/:id

DELETE /assets/:id

```

Never use:

```

/createAsset

/updateAsset

/deleteAsset

```

---

# 6. HTTP Status Codes

Use standard HTTP responses.

| Status | Usage |
|---------|------|
|200|Success|
|201|Created|
|204|Deleted|
|400|Validation Error|
|401|Unauthenticated|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Business Rule Failure|
|500|Internal Error|

---

# 7. Standard API Response

Every endpoint returns the same structure.

Success

```json
{
  "success": true,
  "message": "Asset created successfully",
  "data": {},
  "meta": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Booking conflict detected",
  "errors": []
}
```

---

# 8. Validation

Validation occurs in two stages.

## Stage 1

Request validation

Using Zod.

Checks:

- Required fields
- Types
- Formats

---

## Stage 2

Business validation

Inside services.

Examples:

- Asset Available?
- Booking Conflict?
- Department Exists?
- Permission Granted?

---

# 9. Transactions

The following operations must execute atomically.

Asset Allocation

Transfer

Maintenance Approval

Booking Confirmation

Audit Completion

If any step fails

↓

Rollback

---

# 10. Authentication Flow

```

Login

↓

JWT

↓

Middleware

↓

Authenticated User

↓

RBAC

↓

Controller

```

Unauthenticated requests never reach controllers.

---

# 11. Authorization

Every endpoint requires:

Authentication

↓

Permission Check

↓

Business Validation

↓

Execution

No service should assume permission.

---

# 12. Error Handling

Centralized.

Never use

```

try {

...

}

catch {

...

}

```

inside every controller.

Use global error middleware.

Custom Errors:

- ValidationError
- AuthorizationError
- ConflictError
- NotFoundError
- BusinessRuleError

---

# 13. Logging

Every request logs:

- Request ID
- User ID
- Route
- Method
- Duration
- Status Code

Errors should include stack traces in development and sanitized messages in production.

---

# 14. Audit Events

Every important business action creates an immutable audit event.

Examples:

Asset Created

Asset Allocated

Asset Returned

Booking Created

Maintenance Approved

Transfer Approved

Audit Completed

---

# 15. Notifications

Services generate notification events.

Notification delivery is handled separately.

Business services should not send WebSocket messages directly.

---

# 16. WebSockets

Socket.IO is used only for:

- Dashboard Updates
- Notifications
- Live Asset Changes
- Booking Updates

REST remains the primary communication mechanism.

---

# 17. API Modules

Each module owns its own endpoints.

Examples

Authentication

```

/auth/login

/auth/register

/auth/refresh

```

Assets

```

/assets

/assets/:id

/assets/search

```

Booking

```

/bookings

/bookings/calendar

/bookings/check-availability

```

Maintenance

```

/maintenance

/maintenance/:id/approve

```

Audit

```

/audits

/audits/:id/start

```

Analytics

```

/dashboard

/reports

```

---

# 18. Backend Guardrails

Never access Prisma inside controllers.

Never bypass services.

Never duplicate validation.

Never trust frontend validation.

Never bypass RBAC.

Never skip audit events.

Never update immutable audit history.

Never write business rules inside repositories.

Never hardcode permissions.

Never expose internal errors.

---

# 19. Coding Standards

Prefer async/await.

Use dependency injection where practical.

Keep functions small.

Return early.

Use descriptive names.

Avoid deeply nested code.

Keep services cohesive.

Write reusable utilities.

---

# 20. Definition of Done

A backend feature is complete only if:

- Validation exists
- Business rules exist
- RBAC enforced
- Database transaction implemented
- Audit event generated
- Notification emitted
- Tests pass
- API documented

Implementation without these requirements is considered incomplete.