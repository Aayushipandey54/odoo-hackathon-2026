# Phase 04 — Organization Management Engine

Version: 1.0

---

# Objective

Build the organizational foundation of AssetFlow.

This phase establishes the company's organizational hierarchy, employee directory, departments, locations, asset categories, and administrative management features.

Every future ERP module depends on this data.

At the completion of this phase, the organization should be fully configured and ready for asset registration.

---

# Dependencies

Required Documents

- 01_CONTEXT.md
- 02_PRODUCT_REQUIREMENTS.md
- 03_SYSTEM_ARCHITECTURE.md
- 04_DATABASE_DESIGN.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_SECURITY_AND_ENGINEERING_RULES.md

Required Previous Phases

- Phase 01
- Phase 02
- Phase 03

---

# Business Context

Every enterprise ERP begins with organizational master data.

Assets belong to departments.

Employees belong to departments.

Managers supervise departments.

Categories classify assets.

Locations define where assets exist.

Without organizational data, no business workflow can function correctly.

---

# Technical Scope

This phase includes

- Department Management
- Employee Directory
- Organization Locations
- Asset Categories
- Department Hierarchy
- Employee Profiles
- Organization Settings
- Employee Search
- Department Search
- Role Assignment UI
- Master Data Management

---

# Out of Scope

Do NOT implement

- Assets
- Asset Allocation
- Booking
- Maintenance
- Audit
- Reports
- AI

Only organization master data.

---

# Architecture Decisions

The Organization Module owns all master data.

Other modules consume organization data but never manage it.

Examples

Assets reference Departments.

Bookings reference Employees.

Maintenance references Employees.

Audit references Users.

Master data should remain centralized.

---

# Database Changes

Create tables

Departments

Employees

Locations

AssetCategories

OrganizationSettings

Relationships

Department → Employees

Department → Assets (future)

Location → Assets (future)

Category → Assets (future)

---

# Backend Tasks

Departments

- Create
- Update
- Archive
- Search
- List

Employees

- Create
- Update
- View
- Search
- Assign Department

Locations

- Create
- Update
- Delete
- Search

Categories

- Create
- Update
- Archive

Organization

- Settings API

---

# API Endpoints

Departments

```

GET /departments

POST /departments

PUT /departments/:id

DELETE /departments/:id

```

Employees

```

GET /employees

GET /employees/:id

POST /employees

PUT /employees/:id

```

Locations

```

GET /locations

POST /locations

PUT /locations/:id

```

Categories

```

GET /categories

POST /categories

PUT /categories/:id

```

Organization

```

GET /organization

PUT /organization

```

---

# Frontend Tasks

Pages

- Departments
- Employees
- Locations
- Categories
- Organization Settings

Components

- Department Table
- Employee Table
- Category Table
- Search Filters
- Pagination
- Create Dialogs
- Edit Dialogs

---

# Business Rules

Department names must be unique.

Category names must be unique.

Employees belong to exactly one department.

Archived departments cannot receive new employees.

Locations cannot be deleted while assets reference them.

Categories cannot be deleted if assets use them.

Role changes require Administrator permissions.

---

# Validation Rules

Departments

- Name Required
- Unique Name

Employees

- Name
- Email
- Department
- Role

Locations

- Name
- Address

Categories

- Name
- Description

---

# RBAC

Administrator

- Full Access

Asset Manager

- Read Organization Data

Department Head

- View Own Department

Employee

- View Own Profile

---

# Search & Filtering

Departments

- Name
- Status

Employees

- Name
- Email
- Department
- Role

Locations

- Name

Categories

- Name

Pagination required.

---

# Acceptance Criteria

Departments can be managed.

Employees can be managed.

Locations can be managed.

Categories can be managed.

Search works.

Pagination works.

RBAC enforced.

Validation enforced.

Organization Settings persist correctly.

---

# Testing Checklist

Verify

- Department CRUD
- Employee CRUD
- Category CRUD
- Location CRUD
- Search
- Filters
- Pagination
- RBAC
- Validation
- Duplicate Names
- Archived Departments

---

# GitHub Issues

ORG-001 Department Module

ORG-002 Employee Directory

ORG-003 Location Management

ORG-004 Category Management

ORG-005 Organization Settings

ORG-006 Search & Filtering

ORG-007 Pagination

ORG-008 Frontend Screens

ORG-009 Validation

ORG-010 RBAC

---

# Reusable Components Produced

Department Service

Employee Service

Category Service

Location Service

Master Data Repository

Organization Settings Service

Search Components

Table Components

Form Components

Pagination Components

These components become dependencies for every remaining ERP module.

---

# Definition of Success

The phase is complete when

✓ Organization hierarchy is fully configured.

✓ Departments exist.

✓ Employees exist.

✓ Locations exist.

✓ Categories exist.

✓ Organization settings are configurable.

✓ Search and filtering work.

✓ Role-based permissions are enforced.

✓ Every future module can reference organization data without additional setup.

---

# Coding Agent Instructions

Read

- 01_CONTEXT.md
- 02_PRODUCT_REQUIREMENTS.md
- 03_SYSTEM_ARCHITECTURE.md
- 04_DATABASE_DESIGN.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_SECURITY_AND_ENGINEERING_RULES.md

Implementation Rules

- Treat organization data as the source of truth.
- Build reusable master data services.
- Ensure all CRUD operations include validation, RBAC, audit events, and standardized responses.
- Do not implement any asset or workflow logic in this phase.
- Design APIs and services so future modules can consume organization data without modification.