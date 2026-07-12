# AssetFlow — Security & Engineering Rules

Version: 1.0

---

# Document Purpose

This document defines the mandatory engineering standards, security policies, architectural guardrails, and implementation rules for AssetFlow.

Every developer and AI coding agent must follow these rules.

These rules override implementation preferences.

---

# 1. Engineering Philosophy

AssetFlow is designed as a production-quality ERP system.

Every implementation must prioritize:

- Correctness
- Maintainability
- Security
- Modularity
- Reusability
- Explicit Business Logic

Never optimize for writing less code if it compromises architecture.

---

# 2. Layer Rules

Every layer has a single responsibility.

## Controller

Allowed

- Receive Request
- Validate Request
- Authenticate User
- Call Service
- Return Response

Forbidden

- Prisma Queries
- Business Logic
- Workflow Execution
- Permission Decisions
- State Changes

---

## Service

Allowed

- Business Logic
- Transactions
- Workflow
- State Machine
- Validation
- Notifications
- Audit Events

Forbidden

- HTTP Responses
- Direct Request Parsing

---

## Repository

Allowed

- Database Queries
- CRUD Operations

Forbidden

- Business Rules
- RBAC
- Workflow Logic

---

# 3. Authentication Rules

Authentication uses JWT.

Every protected endpoint requires authentication.

Passwords must always be hashed.

Refresh tokens must be supported.

Never expose sensitive user information.

---

# 4. Authorization Rules

RBAC is mandatory.

Every endpoint must verify permissions.

Permissions are role-driven.

Roles cannot be self-assigned.

Only Admins may promote users.

Never hardcode permissions inside controllers.

---

# 5. Database Rules

The database is responsible for correctness.

Mandatory constraints:

- Foreign Keys
- Unique Constraints
- Check Constraints
- EXCLUDE Constraints
- Transactions

Never rely only on frontend validation.

---

# 6. Business Rules

Business rules belong only inside services.

Examples:

- Asset Allocation
- Booking Validation
- Maintenance Approval
- Transfer Approval

Never duplicate business rules.

---

# 7. State Machine Rules

Every asset exists in one valid state.

Allowed transitions only.

Invalid transitions must be rejected.

Never modify status directly.

Always use the Workflow/State Engine.

---

# 8. Audit Rules

Every important action generates an immutable audit event.

Audit history:

- Cannot be edited
- Cannot be deleted
- Cannot be overwritten

Audit events must contain:

- Actor
- Action
- Resource
- Timestamp
- Previous State
- New State

---

# 9. Validation Rules

Validation occurs in two layers.

Request Validation

- Required Fields
- Types
- Formats

Business Validation

- Permissions
- Availability
- Workflow Rules
- State Rules

Never trust client-side validation.

---

# 10. API Rules

Use REST.

Use consistent response format.

Return proper HTTP status codes.

Never expose stack traces.

Never leak internal implementation details.

---

# 11. Security Rules

Always validate input.

Always sanitize user input.

Protect against:

- SQL Injection
- XSS
- CSRF (if applicable)
- Rate Abuse
- Privilege Escalation

Never trust user input.

---

# 12. Error Handling

Use centralized error middleware.

Never swallow exceptions.

Return meaningful errors.

Internal details stay in logs.

---

# 13. Logging Rules

Every request logs:

- User
- Endpoint
- Duration
- Status
- Request ID

Security events must also be logged.

---

# 14. Notification Rules

Business services emit notification events.

Notification delivery is handled separately.

Business logic should never directly emit WebSocket messages.

---

# 15. Realtime Rules

Use Socket.IO.

Realtime is only for:

- Notifications
- Dashboard Updates
- Booking Updates
- Asset Updates

REST remains the source of truth.

---

# 16. AI Rules

AI is optional.

AI must:

- Call existing services
- Respect RBAC
- Respect workflows
- Respect validation

AI must NEVER:

- Execute SQL
- Bypass Services
- Ignore Permissions
- Modify Database Directly
- Change State Directly

No core RAG.

Use Tool Calling only.

---

# 17. Code Quality Rules

Use TypeScript everywhere.

Prefer composition over duplication.

Keep functions small.

Prefer explicit code.

Avoid deeply nested logic.

Use meaningful names.

Write reusable services.

---

# 18. Git Rules

Every feature:

Issue

↓

Feature Branch

↓

Pull Request

↓

Review

↓

Merge

Never push directly to main.

---

# 19. Performance Rules

Avoid N+1 queries.

Index searchable columns.

Use pagination.

Cache only when necessary.

Never optimize prematurely.

---

# 20. Guardrails (Never Do These)

❌ Business logic in Controllers

❌ Prisma access in Controllers

❌ Duplicate validation

❌ Skip RBAC

❌ Skip Audit Logs

❌ Hardcode Roles

❌ Direct status modification

❌ Direct database updates outside repositories

❌ Delete audit history

❌ Ignore database constraints

❌ Bypass transactions

❌ Store plaintext passwords

❌ Return internal server errors to clients

❌ Introduce unnecessary infrastructure (Kubernetes, Microservices, Kafka, RabbitMQ)

---

# 21. Definition of Production Ready

A feature is considered complete only if:

✅ Business Rules Implemented

✅ RBAC Enforced

✅ Validation Complete

✅ Audit Events Generated

✅ Notifications Generated

✅ Transactions Used

✅ Logging Added

✅ Error Handling Complete

✅ Tested

✅ API Documented

If any of these are missing, the feature is incomplete.

---

# 22. Rules for AI Coding Agents

Before implementing any feature:

1. Read `01_CONTEXT.md`
2. Read this document
3. Read the relevant Phase Specification

The AI agent may:

- Refactor code
- Improve implementation
- Suggest better architecture

The AI agent may NOT:

- Change architecture without explanation
- Break module boundaries
- Ignore documented rules
- Introduce new technologies without justification
- Implement undocumented features

Architecture changes must always include:

- Reason
- Benefits
- Trade-offs
- Impact on existing modules