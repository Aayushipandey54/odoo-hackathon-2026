# Phase 02 — Core Framework & Shared Infrastructure

Version: 1.0

---

# Objective

Build the reusable backend framework that every future module will rely on.

This phase establishes common patterns, utilities, abstractions, middleware, and shared services to eliminate duplicated code and enforce architectural consistency across the project.

No AssetFlow business features should be implemented during this phase.

The outcome should be a backend framework that enables rapid feature development in subsequent phases.

---

# Dependencies

Required Documents

- 01_CONTEXT.md
- 03_SYSTEM_ARCHITECTURE.md
- 04_DATABASE_DESIGN.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_SECURITY_AND_ENGINEERING_RULES.md

Required Previous Phase

- Phase 01 — Infrastructure & Project Bootstrap

---

# Business Context

Every ERP module shares common backend functionality.

Instead of reimplementing pagination, validation, error handling, API responses, and logging inside every module, these concerns should be centralized into reusable infrastructure.

This phase creates the engineering toolkit used by all future business modules.

---

# Technical Scope

This phase includes:

- Global Error Handling
- API Response Wrapper
- Base Repository Pattern
- Base Service Pattern
- Generic CRUD Helpers
- Pagination Framework
- Filtering Framework
- Sorting Framework
- Search Framework
- Request Context
- Logger Service
- Validation Framework
- Configuration Service
- Constants
- Utility Functions
- Exception Classes
- Async Handler
- API Versioning Structure

---

# Out of Scope

Do NOT implement:

- Authentication
- RBAC
- Assets
- Departments
- Employees
- Bookings
- Maintenance
- Audit
- Notifications
- AI

No business modules should exist yet.

---

# Architecture Decisions

This phase establishes reusable engineering patterns.

### Repository Pattern

Responsible only for persistence.

Never contains business logic.

---

### Service Layer

Responsible for business logic.

Future modules inherit these conventions.

---

### Shared Utilities

Common functionality belongs inside shared utilities instead of individual modules.

---

### Global Error Handler

Every exception should flow through a centralized error middleware.

---

# Folder Structure

```

backend/src/

common/

config/

constants/

errors/

middleware/

repositories/

services/

types/

utils/

validators/

```

Shared folders should remain framework-level.

Business modules will consume them later.

---

# Backend Tasks

### Repository Layer

- Base Repository
- Generic CRUD Methods
- Transaction Helper

---

### Service Layer

- Base Service
- Shared Service Helpers

---

### API Utilities

- Response Wrapper
- Pagination
- Sorting
- Filtering
- Search Builder

---

### Validation

- Zod Validation Framework
- Validation Middleware
- Request Parser

---

### Error Handling

- Global Error Handler
- Custom Exception Classes
- Error Formatter

---

### Logging

- Logger Utility
- Request Logger
- Error Logger

---

### Utilities

- Date Helpers
- UUID Generator
- Response Helpers
- Environment Helpers

---

# API Standards

All future endpoints must return:

```json
{
  "success": true,
  "message": "",
  "data": {},
  "meta": {}
}
```

Errors

```json
{
  "success": false,
  "message": "",
  "errors": []
}
```

No endpoint may return inconsistent response formats.

---

# Pagination Standard

Every list endpoint should support:

```
?page=1

&pageSize=20

&sortBy=name

&sortOrder=asc

&search=laptop
```

Future modules must automatically inherit this behavior.

---

# Search Framework

Generic search builder supporting:

- Partial Text Search
- Multiple Fields
- Sorting
- Filtering
- Pagination

Should be reusable across:

- Assets
- Employees
- Departments
- Bookings

---

# Filtering Framework

Support:

Equals

Contains

Starts With

Ends With

Greater Than

Less Than

Date Range

Boolean

Enum

Future modules should configure filters without writing custom logic.

---

# Validation Framework

Every endpoint must support:

- Request Validation
- Query Validation
- Path Parameter Validation
- Body Validation

Validation errors must use standardized responses.

---

# Error Framework

Create reusable exception classes:

- ValidationError
- UnauthorizedError
- ForbiddenError
- ConflictError
- NotFoundError
- BusinessRuleError
- InternalServerError

No module should define its own exception types.

---

# Configuration

Create centralized configuration loader.

Responsibilities:

- Environment Validation
- Feature Flags
- Runtime Config
- App Constants

Configuration should never be scattered throughout the project.

---

# Database

No business tables.

Only verify:

- Base Prisma Client
- Transaction Helper
- Repository Abstraction

---

# Acceptance Criteria

The phase is complete only if:

- Shared repository pattern exists.
- Shared service layer exists.
- API responses are standardized.
- Global error handling works.
- Validation middleware works.
- Generic pagination works.
- Generic filtering works.
- Generic searching works.
- Logging is centralized.
- Utility library exists.
- Configuration is centralized.
- No duplicated framework code exists.

---

# Testing Checklist

Verify:

- Validation middleware
- Error middleware
- Pagination
- Filtering
- Search
- Response wrapper
- Logger
- Transaction helper

All utilities should be independently testable.

---

# GitHub Issues

CORE-001 Base Repository

CORE-002 Base Service

CORE-003 API Response Wrapper

CORE-004 Global Error Middleware

CORE-005 Exception Classes

CORE-006 Validation Framework

CORE-007 Search Framework

CORE-008 Pagination Framework

CORE-009 Filter Framework

CORE-010 Logger Utility

CORE-011 Configuration Module

CORE-012 Shared Utilities

CORE-013 Transaction Helper

---

# Definition of Success

A backend developer should be able to build a completely new module by only writing:

- Prisma Model
- Service Logic
- Controller
- Routes

Everything else should already exist.

If new modules still require rewriting pagination, validation, response formatting, logging, or filtering, this phase is incomplete.

---

# Coding Agent Instructions

Read:

- 01_CONTEXT.md
- 03_SYSTEM_ARCHITECTURE.md
- 04_DATABASE_DESIGN.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_SECURITY_AND_ENGINEERING_RULES.md

Implementation Rules:

- Build reusable infrastructure only.
- Do not implement business features.
- Avoid premature abstraction.
- Ensure every utility is generic and reusable.
- Keep framework code independent from business modules.
- Follow the documented layered architecture.
- Document reusable components with comments where appropriate.
- Leave the codebase ready for Phase 03 (Authentication & Authorization) without requiring structural changes.