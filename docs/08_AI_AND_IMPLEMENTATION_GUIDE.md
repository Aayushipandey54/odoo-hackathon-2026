# AssetFlow — AI & Implementation Guide

Version: 1.0

---

# Document Purpose

This document defines the implementation methodology for AssetFlow.

It serves as the primary instruction manual for AI coding agents and developers, ensuring consistent engineering decisions throughout the project.

Every implementation session should begin by reading this document.

---

# 1. Project Philosophy

AssetFlow is a production-quality ERP application built for the Odoo Hackathon.

The objective is **not** to build features quickly.

The objective is to build software that demonstrates:

- Excellent Architecture
- Clean Engineering
- Strong Database Design
- Secure Backend Design
- Maintainability
- Correctness

Engineering quality is prioritized over feature quantity.

---

# 2. Documents Reading Order

Before implementing any feature, always read the documentation in this order.

```

01_CONTEXT.md

↓

02_PRODUCT_REQUIREMENTS.md

↓

03_SYSTEM_ARCHITECTURE.md

↓

04_DATABASE_DESIGN.md

↓

05_API_AND_BACKEND_GUIDE.md

↓

06_SECURITY_AND_ENGINEERING_RULES.md

↓

07_FRONTEND_DESIGN_SYSTEM.md

↓

Current Phase Specification

```

The documentation hierarchy must always be respected.

---

# 3. Development Workflow

Every feature follows the same lifecycle.

```

Understand Phase

↓

Read Documentation

↓

Analyze Dependencies

↓

Design Solution

↓

Implement

↓

Test

↓

Review

↓

Merge

```

Implementation should never begin before understanding the phase completely.

---

# 4. Engineering Priorities

Always optimize for:

1. Correctness

2. Maintainability

3. Security

4. Readability

5. Reusability

6. Performance

Never sacrifice architecture for writing less code.

---

# 5. AI Responsibilities

The AI coding agent should:

- Implement requested features
- Follow documented architecture
- Respect module boundaries
- Suggest improvements
- Write production-quality code
- Generate clean folder structures
- Write reusable services
- Follow existing naming conventions

---

# 6. AI Limitations

The AI coding agent must NOT:

- Change architecture without justification
- Introduce new technologies
- Ignore documentation
- Break module boundaries
- Add unnecessary complexity
- Implement undocumented features
- Skip validation
- Skip RBAC
- Skip audit logging

---

# 7. Architecture Changes

If the AI believes a better solution exists, it should:

1. Explain the current approach

2. Explain the proposed approach

3. Compare trade-offs

4. Wait for approval before changing architecture

Architecture changes should never happen silently.

---

# 8. Coding Principles

Write code that is:

- Modular
- Predictable
- Explicit
- Reusable
- Easy to Debug

Avoid:

- Clever code
- Deep nesting
- Magic abstractions
- Hidden behavior

---

# 9. Feature Implementation Order

Every feature should be implemented in this order.

1. Database

↓

2. Repository

↓

3. Service

↓

4. Validation

↓

5. Controller

↓

6. Routes

↓

7. Frontend

↓

8. Testing

Never begin with the frontend.

---

# 10. Backend Checklist

Every backend feature must include:

- Validation
- Business Rules
- RBAC
- Database Transactions
- Audit Events
- Notifications
- Error Handling
- Logging

If any are missing, the feature is incomplete.

---

# 11. Frontend Checklist

Every frontend feature must include:

- Loading State
- Error State
- Empty State
- Validation
- Responsive Layout
- Accessibility
- Proper API Integration

---

# 12. Database Checklist

Every database change must include:

- Foreign Keys
- Constraints
- Indexes
- Transactions
- Migration
- Seed Data (if required)

Database correctness is preferred over application-only validation.

---

# 13. Testing Checklist

Before marking a phase complete, verify:

- Happy Path
- Invalid Inputs
- Permission Checks
- Business Rules
- Edge Cases
- Database Constraints
- API Responses

Every critical workflow should be manually verified.

---

# 14. Git Workflow

Every implementation follows:

Issue

↓

Feature Branch

↓

Commit

↓

Pull Request

↓

Review

↓

Merge

Never commit directly to the main branch.

---

# 15. Pull Request Checklist

Every PR should answer:

- What was implemented?
- Why was it implemented?
- Which APIs changed?
- Which database tables changed?
- Which business rules changed?
- Any breaking changes?

---

# 16. AI Feature Philosophy

AI is an enhancement.

It is never responsible for business correctness.

AI interacts only through existing services.

Architecture

```

User

↓

AI Copilot

↓

Tool Calling

↓

Business Services

↓

Database

```

The AI never:

- Executes SQL
- Calls Prisma
- Bypasses RBAC
- Bypasses Services
- Changes Workflow State Directly

---

# 17. RAG Policy

RAG is NOT part of the core architecture.

RAG may only be added for:

- Manuals
- Warranty Documents
- Policies
- SOPs

Never use RAG for structured ERP data.

---

# 18. Deployment Strategy

Development Environment

↓

Docker Compose

Production

↓

Frontend

Vercel

Backend

Railway / Fly.io

Database

Managed PostgreSQL

Deployment should remain functional throughout development.

---

# 19. Phase Completion Criteria

A phase is complete only if:

- Code Compiles
- APIs Work
- Database Migrates Successfully
- Business Rules Pass
- Frontend Integrated
- Deployment Still Works
- No Critical Bugs
- Documentation Updated

---

# 20. Definition of Success

AssetFlow is successful when:

- The architecture remains clean.
- Database integrity is guaranteed.
- Business rules are enforced server-side.
- Security is consistently applied.
- Every workflow is auditable.
- The application is production deployable.
- The codebase is maintainable.
- The project demonstrates enterprise-grade engineering.

---

# 21. Master Prompt for AI Coding Agent

Before implementing any phase:

1. Read all project documentation in the prescribed order.
2. Understand the current phase completely.
3. Identify dependencies on previous phases.
4. Do not assume undocumented behavior.
5. Follow the documented architecture and engineering rules.
6. If an improvement is identified, explain it with trade-offs before changing the architecture.
7. Implement only the scope of the current phase.
8. Generate clean, modular, production-quality code.
9. Ensure all business rules, RBAC, validation, audit logging, and transactions are respected.
10. Verify the implementation against the phase acceptance criteria before considering the work complete.

The objective is not merely to generate working code, but to build a maintainable, secure, and enterprise-grade ERP application that reflects strong software engineering principles.
