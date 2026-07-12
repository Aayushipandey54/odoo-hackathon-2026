# AssetFlow — Project Context
Version: 1.0

> This is the **authoritative source of truth** for the AssetFlow project.
>
> Every developer, reviewer, and AI coding agent **must read this document first** before implementing any feature.
>
> This document explains **why the project exists, how it is architected, engineering principles, development philosophy, constraints, and implementation strategy.**
>
> It intentionally does **not** contain implementation details. Those belong in the subsequent documents.

---

# 1. Project Overview

AssetFlow is an enterprise-grade **Asset & Resource Management System** built as an ERP module for organizations.

The purpose of the system is to enable organizations to efficiently manage physical assets, shared resources, allocations, transfers, bookings, maintenance, audits, and role-based workflows while maintaining complete traceability and data integrity.

The project is being developed specifically for the **Odoo Hackathon**.

Although it is a hackathon project, the engineering standard should resemble production software.

---

# 2. Engineering Philosophy

AssetFlow is **not** being developed as a CRUD application.

AssetFlow is an **Enterprise Workflow Platform**.

Every engineering decision must prioritize:

- Maintainability
- Modularity
- Security
- Scalability
- Correctness
- Reusability
- Production Readiness

The objective is not to demonstrate the largest technology stack.

The objective is to demonstrate excellent engineering decisions.

---

# 3. Vision

We are not building an Asset Management System.

We are building a reusable enterprise workflow platform whose first implementation happens to be AssetFlow.

Every feature should be designed so that the underlying engineering can be reused by future ERP modules.

Examples include:

- Workflow Engine
- State Machine
- Approval Engine
- Notification Engine
- Audit Engine
- Registry Engine

Business modules consume these engines rather than implementing their own logic.

---

# 4. Project Goals

The primary goals are:

- Build a production-quality ERP module.
- Demonstrate excellent software architecture.
- Showcase backend engineering.
- Showcase database engineering.
- Demonstrate secure role-based workflows.
- Demonstrate enterprise-grade lifecycle management.
- Deliver a polished live demo.

---

# 5. Non Goals

The following are intentionally out of scope.

- Accounting
- Purchasing
- Vendor Management
- Financial Systems
- Payroll
- Kubernetes
- Microservices
- API Gateway
- Event Streaming Platforms
- Kafka
- RabbitMQ
- CQRS
- Event Sourcing
- Complex distributed systems

The application should remain a clean modular monolith.

---

# 6. Technology Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Recharts

Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM

Database

- PostgreSQL

Infrastructure

- Redis
- Docker
- Docker Compose
- Nginx

Authentication

- JWT
- Refresh Tokens
- RBAC

Realtime

- Socket.IO

Scheduling

- node-cron

AI

- Groq
- LangGraph (Tool Calling)

Deployment

- Vercel (Frontend)
- Railway/Fly.io + Managed PostgreSQL (subject to hackathon rules)

---

# 7. Architecture

Architecture Pattern

Modular Monolith

The application consists of independent internal modules while remaining a single deployable backend.

High-Level Layers

Frontend

↓

Controllers

↓

Services

↓

Repositories

↓

Prisma ORM

↓

PostgreSQL

Every layer has a single responsibility.

Controllers never contain business logic.

Business logic always lives in Services.

Repositories are responsible only for persistence.

---

# 8. Core Engineering Principles

The following principles are mandatory.

## Single Responsibility

Every module should have one responsibility.

---

## Separation of Concerns

Presentation

Business Logic

Persistence

Infrastructure

must remain independent.

---

## Reusable Components

Never duplicate functionality.

If two modules need similar logic, build a reusable service.

---

## Explicit Business Rules

Business rules should never be hidden inside controllers or UI logic.

---

## Database Integrity

Whenever correctness can be guaranteed by the database, prefer database constraints over application checks.

Example:

Booking overlap prevention should use PostgreSQL exclusion constraints.

---

## Security First

Security is not an afterthought.

Every endpoint is assumed hostile until validated.

---

# 9. Core Modules

AssetFlow consists of the following modules.

Authentication

Organization

Assets

Allocation

Transfer

Booking

Maintenance

Audit

Notifications

Analytics

AI Copilot

Each module has clearly defined responsibilities.

---

# 10. Core Engineering Engines

Instead of building isolated features, AssetFlow is composed of reusable engines.

Authentication Engine

Master Data Engine

Registry Engine

Workflow Engine

State Machine Engine

Approval Engine

Notification Engine

Audit Engine

Analytics Engine

AI Copilot Engine

These engines power all business modules.

---

# 11. Database Philosophy

PostgreSQL is the source of truth.

Business correctness should be enforced using database constraints whenever possible.

Examples include:

- Foreign Keys
- Check Constraints
- Unique Constraints
- Partial Indexes
- Exclusion Constraints

The database should prevent invalid states.

---

# 12. Backend Philosophy

The backend follows layered architecture.

Controllers

↓

Services

↓

Repositories

↓

Database

Controllers

- Parse request
- Validate request
- Call services
- Return response

Services

- Business rules
- Workflow
- Validation
- State transitions

Repositories

- Persistence only

---

# 13. Frontend Philosophy

Frontend should remain presentation-focused.

Frontend responsibilities:

- Forms
- Tables
- Dashboards
- Validation
- User Experience

Frontend should never implement business rules.

---

# 14. AI Philosophy

AI is an optional enhancement.

The ERP must function completely without AI.

AI is never responsible for correctness.

AI only orchestrates existing business services.

Architecture

User

↓

AI Copilot

↓

Planner

↓

Tool Calling

↓

Business Services

↓

PostgreSQL

The AI must never:

- Bypass RBAC
- Execute SQL
- Modify database directly
- Ignore workflow validation

RAG is intentionally not part of the core architecture.

RAG may only be introduced for querying uploaded manuals or policy documents.

---

# 15. Security Philosophy

Authentication

JWT

Authorization

RBAC

Every endpoint must:

- Authenticate
- Authorize
- Validate
- Audit

No endpoint may bypass permission checks.

---

# 16. Deployment Philosophy

The application should always remain deployable.

Target deployment:

Frontend

↓

Vercel

Backend

↓

Railway/Fly.io

Database

↓

Managed PostgreSQL

Every commit should preserve deployability.

---

# 17. Development Workflow

Development follows specification-driven engineering.

The workflow is:

Context

↓

Architecture

↓

Database

↓

API

↓

Phase Specification

↓

Implementation

↓

Review

↓

Merge

Implementation never precedes design.

---

# 18. Phase Roadmap

Development is divided into thirteen phases.

Phase 0

Engineering Foundation

↓

Phase 1

Infrastructure

↓

Phase 2

Core Framework

↓

Phase 3

Authentication

↓

Phase 4

Master Data

↓

Phase 5

Asset Registry

↓

Phase 6

Workflow Engine

↓

Phase 7

Booking Engine

↓

Phase 8

Maintenance Engine

↓

Phase 9

Audit Engine

↓

Phase 10

Dashboard & Realtime

↓

Phase 11

Deployment & Hardening

↓

Phase 12

AI Copilot

Each phase has its own specification document.

---

# 19. Engineering Rules

Controllers never contain business logic.

Repositories never contain business logic.

Services own all business rules.

Business rules never exist only in the frontend.

Never duplicate validation.

Never bypass RBAC.

Never bypass the State Machine.

Never mutate audit logs.

Never call Prisma directly from controllers.

Never call AI providers outside AIService.

Never write raw SQL unless absolutely required and documented.

Always prefer explicit code over magic abstractions.

---

# 20. Success Criteria

AssetFlow is considered complete when:

- All core ERP workflows function correctly.
- Business rules are enforced server-side.
- Database guarantees correctness.
- Architecture remains modular.
- Security is enforced consistently.
- Audit trails are immutable.
- Deployment is successful.
- The application demonstrates enterprise-grade engineering.
- AI (if implemented) enhances workflows without compromising correctness.

---

# 21. References

The following documents provide implementation details.

- 02_PRODUCT_REQUIREMENTS.md
- 03_SYSTEM_ARCHITECTURE.md
- 04_DATABASE_DESIGN.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_FRONTEND_DESIGN_SYSTEM.md
- 07_SECURITY_AND_ENGINEERING_RULES.md
- 08_AI_AND_IMPLEMENTATION_GUIDE.md

This document should always be read before any implementation begins.

22. Guiding Principles for Technical Decisions

This section would encode how decisions are made when something isn't explicitly documented.

For example:

Correctness over convenience — prefer designs that prevent invalid states, even if they require more code.
Database-enforced integrity over application-only checks — if PostgreSQL can guarantee a rule, use the database.
Simplicity over unnecessary infrastructure — avoid technologies unless they solve a demonstrated problem.
Modularity over premature microservices — keep modules cleanly separated within a modular monolith.
Security by default — every new endpoint, service, or feature should assume untrusted input until validated and authorized.
AI augments workflows, never replaces business logic — AI may recommend or automate actions but must always go through the same service layer and permission checks as the UI.
Production-ready defaults — logging, validation, error handling, and documentation are part of the feature, not post-feature work.