# Phase 01 — Infrastructure & Project Bootstrap

Version: 1.0

---

# Objective

Establish the complete engineering foundation for AssetFlow.

This phase creates the production-ready development environment that every subsequent phase depends on.

No business logic should be implemented in this phase.

By the end of this phase, every team member should be able to clone the repository, install dependencies, run a single command, and have the entire development environment running locally.

This phase focuses exclusively on infrastructure, project organization, tooling, and developer experience.

---

# Dependencies

Required Documents

- 01_CONTEXT.md
- 03_SYSTEM_ARCHITECTURE.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_SECURITY_AND_ENGINEERING_RULES.md

No previous implementation phases are required.

---

# Business Context

AssetFlow is intended to be built as a production-quality ERP application.

Before implementing any feature, the project requires a stable engineering foundation.

This phase ensures every future feature is developed on a consistent, scalable, and maintainable codebase.

---

# Technical Scope

This phase includes:

- Monorepo initialization
- Express.js backend setup
- Next.js frontend setup
- TypeScript configuration
- Prisma integration
- PostgreSQL connection
- Redis connection
- Docker
- Docker Compose
- Nginx configuration
- Environment configuration
- Logging framework
- GitHub Actions
- ESLint
- Prettier
- Husky
- Commit hooks
- Health check endpoint

---

# Out of Scope

Do NOT implement:

- Authentication
- Database models
- Business modules
- RBAC
- Asset APIs
- Booking
- Maintenance
- Audit
- AI

Infrastructure only.

---

# Architecture Decisions

Architecture Pattern

Modular Monolith

Backend

Express.js

ORM

Prisma

Database

PostgreSQL

Cache

Redis

Reverse Proxy

Nginx

Containerization

Docker Compose

Package Manager

npm

Language

TypeScript

---

# Repository Structure

```
assetflow/

frontend/

backend/

docs/

docker/

.github/

scripts/
```

Backend

```
backend/src/

controllers/

services/

repositories/

routes/

middleware/

modules/

config/

utils/

validators/

types/

constants/

events/

socket/
```

Frontend

```
frontend/

app/

components/

hooks/

lib/

services/

types/

styles/
```

---

# Environment Variables

Backend

```
PORT

DATABASE_URL

REDIS_URL

JWT_SECRET

JWT_REFRESH_SECRET

NODE_ENV

CLIENT_URL
```

Frontend

```
NEXT_PUBLIC_API_URL
```

Provide `.env.example` files.

Never commit secrets.

---

# Docker Requirements

Docker Compose should start:

- Frontend
- Backend
- PostgreSQL
- Redis
- Nginx

One command should boot the complete development environment.

```bash
docker compose up
```

---

# Backend Tasks

- Initialize Express
- Configure TypeScript
- Configure Prisma
- Configure Logging
- Configure Error Middleware
- Configure Environment Loader
- Configure Health Route
- Configure Base Routing
- Configure Request Logger
- Configure CORS

---

# Frontend Tasks

- Initialize Next.js
- Configure Tailwind
- Install shadcn/ui
- Configure TanStack Query
- Configure Folder Structure
- Configure API Client
- Create Dashboard Placeholder
- Configure Global Layout

---

# Infrastructure Tasks

- Docker
- Docker Compose
- PostgreSQL Container
- Redis Container
- Nginx
- GitHub Actions
- ESLint
- Prettier
- Husky
- lint-staged

---

# APIs

Health Endpoint

```
GET /health
```

Returns

```json
{
  "status": "ok",
  "service": "assetflow-api",
  "version": "1.0.0"
}
```

No other APIs.

---

# Database

No business tables.

Only initialize Prisma.

Verify successful database connection.

---

# Validation

Verify:

- Express boots
- Next boots
- Prisma connects
- PostgreSQL connects
- Redis connects
- Docker builds
- Environment variables load
- Health endpoint responds

---

# Acceptance Criteria

The phase is complete only if:

- Project builds successfully
- Docker Compose works
- Backend starts
- Frontend starts
- PostgreSQL connects
- Redis connects
- Health endpoint works
- CI passes
- Lint passes
- Formatting passes
- Hot reload works
- Every developer can run the project locally

---

# Testing Checklist

- Docker starts correctly
- Backend reachable
- Frontend reachable
- Database reachable
- Redis reachable
- Health endpoint returns 200
- Environment variables validated
- CI succeeds

---

# GitHub Issues

INF-001 Initialize Repository

INF-002 Setup Express

INF-003 Configure TypeScript

INF-004 Setup Prisma

INF-005 Configure PostgreSQL

INF-006 Configure Redis

INF-007 Configure Docker

INF-008 Configure Docker Compose

INF-009 Configure Nginx

INF-010 Configure GitHub Actions

INF-011 Configure ESLint

INF-012 Configure Prettier

INF-013 Configure Husky

INF-014 Configure Health Endpoint

---

# Coding Agent Instructions

Read before implementation:

- 01_CONTEXT.md
- 03_SYSTEM_ARCHITECTURE.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_SECURITY_AND_ENGINEERING_RULES.md

Implementation rules:

- Do not implement authentication.
- Do not implement business logic.
- Do not create business tables.
- Focus entirely on infrastructure.
- Follow the documented folder structure.
- Use clean, production-ready TypeScript.
- Keep the code modular.
- Ensure Docker Compose works with a single command.
- If architectural improvements are identified, explain the trade-offs before applying them.

Deliverables should leave the project in a state where Phase 02 can begin immediately without restructuring the codebase.