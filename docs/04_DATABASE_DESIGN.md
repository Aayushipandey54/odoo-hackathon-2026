# AssetFlow — Database Design

Version: 1.0

---

# Document Purpose

This document defines the database architecture for AssetFlow.

It serves as the single source of truth for:

- Database philosophy
- Entity relationships
- Constraints
- Indexing strategy
- Data integrity
- Transaction boundaries
- Naming conventions
- Database guardrails

This document intentionally does not define Prisma models in code. It defines the design principles that those models must follow.

---

# 1. Database Philosophy

AssetFlow uses **PostgreSQL** as its primary relational database.

The database is responsible for enforcing correctness, not just storing data.

Whenever possible, business rules should be enforced using database constraints instead of relying solely on application logic.

Examples:

- Foreign Keys
- Unique Constraints
- Check Constraints
- Partial Indexes
- EXCLUDE Constraints
- Transactions

The application should never depend solely on frontend validation.

---

# 2. Database Design Principles

The database follows these principles:

- Normalized relational design (3NF where practical)
- Strong referential integrity
- Immutable audit history
- Transactional consistency
- Explicit foreign key relationships
- Minimal data duplication
- Predictable naming conventions

---

# 3. Core Entities

The primary entities are:

Organization

↓

Departments

↓

Employees

↓

Roles

↓

Categories

↓

Assets

↓

Bookings

↓

Allocations

↓

Transfers

↓

Maintenance Requests

↓

Audit Cycles

↓

Audit Events

↓

Notifications

---

# 4. High-Level ER Diagram

```

Organization
│
├── Departments
│ │
│ ├── Employees
│ │
│ └── Assets
│
├── Categories
│
├── Bookings
│
├── Allocations
│
├── Transfers
│
├── Maintenance
│
├── Audit Cycles
│
└── Notifications

5. Entity Relationships
Department

One department has many employees.

One department owns many assets.

Employee

Belongs to one department.

Can own many asset allocations.

Can create bookings.

Can create maintenance requests.

Asset

Belongs to one category.

Belongs to one department.

May have:

Allocations
Bookings
Maintenance Records
Audit History
Documents
Booking

Belongs to:

Asset
Employee

Must never overlap.

Allocation

Links:

Employee ↔ Asset

Only one active allocation is allowed.

Maintenance

Belongs to:

Asset

Requested By

Assigned To

Audit Event

Every business action creates exactly one immutable audit event.

6. Data Integrity Rules

The following must always be true.

✅ Asset IDs are unique.

✅ Asset Tags are unique.

✅ Users cannot own duplicate active allocations.

✅ Booking overlaps are impossible.

✅ Departments cannot be deleted while employees exist.

✅ Assets cannot be deleted if history exists.

✅ Audit events are immutable.

7. Constraints

Mandatory database constraints include:

Primary Keys
Foreign Keys
Unique Constraints
Check Constraints
NOT NULL
Cascading rules

Special constraints:

Booking

Use PostgreSQL EXCLUDE constraints to prevent overlapping reservations.

Allocation

Use partial unique indexes to prevent multiple active allocations.

8. Transactions

The following operations must execute atomically.

Asset Allocation

Validate
Allocate
Update Status
Create Audit Event
Send Notification

Transfer

Validate
Update Owner
Create History
Notify

Maintenance

Approve
Change Status
Assign
Audit

If one operation fails, the transaction rolls back.

9. Indexing Strategy

Indexes should exist for:

Asset Tag
Employee ID
Department
Category
Status
Booking Time Range
Allocation Status
Created At

Composite indexes should be added where frequent filtering occurs.

10. Soft Delete Strategy

Business records should generally use soft deletes.

Never physically delete:

Assets
Audit Logs
Allocations
Transfers
Maintenance History

Only reference/master data may be archived where appropriate.

11. Audit Philosophy

Every important action creates an immutable event.

Events include:

Actor
Resource
Action
Previous State
New State
Timestamp

Audit events are append-only.

They must never be updated or deleted.

12. Naming Conventions

Tables:

snake_case plural

Examples:

employees

assets

bookings

Columns:

snake_case

Foreign Keys:

department_id

asset_id

employee_id

Timestamps:

created_at

updated_at

deleted_at

13. Database Guardrails

The following situations must never occur.

❌ Two active allocations for one asset.

❌ Two overlapping bookings.

❌ Orphan records.

❌ Invalid asset states.

❌ Deleted audit history.

❌ Duplicate asset tags.

❌ Missing foreign keys.

❌ Invalid status transitions.

14. Future Scalability

The schema should support future modules:

Procurement
Vendors
Inventory
Finance
Multi-Organization
Asset Depreciation
AI Insights

without requiring major schema redesign.

15. References

This document should be read with:

01_CONTEXT.md
02_PRODUCT_REQUIREMENTS.md
03_SYSTEM_ARCHITECTURE.md

Implementation details:

Prisma Schema
Migration Files
Repository Layer

