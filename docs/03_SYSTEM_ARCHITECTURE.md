# AssetFlow — System Architecture

Version: 1.0

---

# Document Purpose

This document defines the overall architecture of AssetFlow.

It describes how the system is organized, how modules interact, and the architectural principles that every implementation must follow.

This document intentionally avoids implementation-specific code and focuses on high-level engineering decisions.

---

# 1. Architecture Philosophy

AssetFlow follows a **Modular Monolith Architecture**.

The application is deployed as a single backend service but internally organized into independent business modules.

Reasons:

- Faster development
- Easier deployment
- Simple debugging
- Clear module boundaries
- Better suited for hackathons
- Easy future migration to microservices if required

The objective is modularity, **not** distributed complexity.

---

# 2. High-Level Architecture

```
                 Client (Next.js)

                        │

               REST API + WebSockets

                        │

              Express.js Backend

                        │

 ┌──────────────────────────────────────┐
 │              Modules                 │
 │                                      │
 │ Auth                                │
 │ Organization                         │
 │ Assets                              │
 │ Workflow                            │
 │ Booking                             │
 │ Maintenance                         │
 │ Audit                               │
 │ Analytics                           │
 │ Notifications                       │
 │ AI Copilot                          │
 └──────────────────────────────────────┘

                        │

                 Prisma ORM

                        │

                 PostgreSQL

                        │

                    Redis
```

---

# 3. Layered Architecture

Every request flows through the same layers.

```
Client

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
```

Responsibilities

### Controller

- Receive request
- Validate input
- Authenticate user
- Call service
- Return response

Controllers must never contain business logic.

---

### Service

Responsible for:

- Business rules
- Workflow execution
- Validation
- State transitions
- Notifications
- Audit events

This is where the application logic lives.

---

### Repository

Responsible only for database operations.

Repositories must never contain business rules.

---

### Database

The database is responsible for enforcing data integrity using:

- Foreign Keys
- Unique Constraints
- Check Constraints
- Exclusion Constraints
- Indexes

Correctness should be guaranteed at the database whenever possible.

---

# 4. Core Modules

AssetFlow consists of independent business modules.

### Authentication

- Login
- JWT
- RBAC
- User sessions

---

### Organization

- Departments
- Employees
- Roles
- Categories
- Locations

---

### Asset Registry

- Assets
- Documents
- QR Codes
- Asset History

---

### Workflow

- Allocation
- Transfers
- Approval
- State Machine

---

### Booking

- Calendar
- Reservations
- Availability
- Conflict Detection

---

### Maintenance

- Requests
- Assignment
- Resolution
- Maintenance History

---

### Audit

- Audit Cycles
- Verification
- Immutable Event Log

---

### Analytics

- Dashboard
- KPIs
- Reports

---

### Notifications

- Real-time updates
- Activity Feed
- Alerts

---

### AI Copilot (Optional)

Tool-calling assistant that interacts with existing business services.

AI never bypasses application logic.

---

# 5. Workflow Architecture

AssetFlow is workflow-driven.

Most business processes follow the same pattern.

```
Request

↓

Validation

↓

Approval

↓

Execution

↓

Completion

↓

Audit

↓

Notification
```

Examples:

- Asset Allocation
- Transfer
- Booking
- Maintenance
- Audit

The Workflow Engine should be reusable across all modules.

---

# 6. State Machine

Assets always exist in one valid lifecycle state.

```
Available

↓

Allocated

↓

Returned

↓

Available
```

Other valid states include:

- Reserved
- Under Maintenance
- Lost
- Retired
- Disposed

Invalid transitions must always be rejected by the backend.

---

# 7. Data Flow

Typical request lifecycle

```
User

↓

Frontend

↓

REST API

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Audit Event

↓

Notification

↓

WebSocket Broadcast

↓

Frontend Refresh
```

Every important business action should generate:

- Audit Event
- Notification
- Updated Dashboard

---

# 8. Realtime Architecture

Realtime communication uses Socket.IO.

Used for:

- Asset Allocation Updates
- Booking Updates
- Dashboard Refresh
- Notifications

Polling should be avoided.

---

# 9. Security Architecture

Every request follows the same pipeline.

```
Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Business Logic

↓

Audit Logging

↓

Response
```

Security principles:

- JWT Authentication
- RBAC
- Input Validation
- Rate Limiting
- Immutable Audit Logs

---

# 10. Deployment Architecture

```
Users

↓

Vercel

↓

Express Backend

↓

PostgreSQL

↓

Redis
```

The backend remains a single deployable service.

Docker Compose is used for local development.

---

# 11. Engineering Principles

The following principles are mandatory.

- Modular over complex
- Correctness over convenience
- Explicit over magic
- Database-enforced integrity
- Reusable services
- Thin controllers
- Fat services
- Immutable audit history
- Security by default
- Production-ready code

---

# 12. Engineering Rules

Controllers must never contain business logic.

Repositories only access the database.

Business logic belongs in services.

Never bypass RBAC.

Never bypass the workflow engine.

Never bypass the state machine.

Never write duplicate validation.

Never modify audit logs.

Never access Prisma directly from controllers.

Every business action must generate an audit event.

Every API must validate inputs.

Every module must remain independent.

---

# 13. Future Extensibility

The architecture should allow future modules such as:

- Procurement
- Vendors
- Inventory
- Finance
- Mobile App
- AI Copilot
- Multi-Organization Support

without requiring major architectural changes.

---

# References

This document should be read after:

- 01_CONTEXT.md
- 02_PRODUCT_REQUIREMENTS.md

Implementation details are covered in:

- 04_DATABASE_DESIGN.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_FRONTEND_DESIGN_SYSTEM.md
- 07_SECURITY_AND_ENGINEERING_RULES.md
- 08_AI_AND_IMPLEMENTATION_GUIDE.md