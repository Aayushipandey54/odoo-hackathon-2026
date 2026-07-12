# AssetFlow — Product Requirements Document (PRD)

Version: 1.0

---

# Document Purpose

This document defines the business requirements for AssetFlow.

It is the single source of truth for:

- Product vision
- Functional requirements
- Business workflows
- User roles
- Business rules
- Success criteria

This document intentionally avoids implementation details.

Implementation decisions belong in:

- System Architecture
- Database Design
- API Design
- Security Guide

---

# 1. Executive Summary

AssetFlow is an Enterprise Asset & Resource Management System designed to help organizations efficiently manage physical assets and shared resources throughout their lifecycle.

The application enables organizations to:

- Register assets
- Allocate assets
- Transfer ownership
- Book shared resources
- Track maintenance
- Perform audit cycles
- Monitor utilization
- Maintain complete historical records

AssetFlow is designed around enterprise-grade engineering principles with a strong focus on:

- Correctness
- Traceability
- Security
- Workflow-driven operations
- Real-time collaboration

---

# 2. Problem Statement

Organizations often struggle with managing shared assets because:

- Asset ownership is unclear
- Double allocations occur
- Resource booking conflicts happen
- Maintenance requests are unmanaged
- Asset history is lost
- Audits become manual
- Managers lack visibility

Most organizations still rely on spreadsheets or disconnected systems.

AssetFlow centralizes the entire asset lifecycle into one secure platform.

---

# 3. Product Vision

AssetFlow should feel like a lightweight ERP module rather than a CRUD application.

Every action should follow a defined business workflow.

Every important action should be auditable.

Every state transition should be validated.

Every user should only access resources they are authorized to manage.

---

# 4. Project Objectives

The application should:

- Centralize asset management
- Eliminate duplicate allocations
- Prevent booking conflicts
- Improve asset visibility
- Simplify maintenance tracking
- Enable audit compliance
- Improve operational efficiency
- Demonstrate production-quality engineering

---

# 5. Target Users

AssetFlow supports four primary user roles.

---

## Administrator

Responsibilities

- Manage organization
- Manage departments
- Manage employees
- Promote users
- Register assets
- View reports
- Configure system

Highest privileges.

---

## Asset Manager

Responsibilities

- Register assets
- Allocate assets
- Transfer assets
- Approve maintenance
- Track utilization

Cannot manage organization settings.

---

## Department Head

Responsibilities

- View department assets
- Approve transfers
- Approve requests
- Monitor utilization

Limited to assigned department.

---

## Employee

Responsibilities

- View assigned assets
- Request assets
- Request maintenance
- Book resources
- Return assets

Lowest privilege level.

---

# 6. Core Modules

AssetFlow consists of the following modules.

## Authentication

Authentication

Authorization

Profile

RBAC

---

## Organization

Departments

Employees

Locations

Roles

Categories

---

## Asset Registry

Asset registration

Asset search

QR code

Documents

Status

History

---

## Allocation

Assign

Return

Transfer

Conflict handling

---

## Booking

Shared resources

Calendar

Availability

Reservations

Overlap validation

---

## Maintenance

Requests

Approval

Assignment

Resolution

History

---

## Audit

Audit cycles

Verification

Discrepancy

Compliance

History

---

## Dashboard

KPIs

Charts

Analytics

Recent Activity

Notifications

---

# 7. Functional Requirements

## FR-001 User Authentication

Users must authenticate before accessing the application.

JWT authentication shall be used.

Sessions shall expire securely.

---

## FR-002 Role-Based Access

Every request must be authorized.

Permissions are determined using RBAC.

No user may elevate privileges themselves.

---

## FR-003 Asset Registration

Users with permission may register assets.

Every asset shall have:

- Unique Asset ID
- Asset Tag
- Category
- Department
- Status
- Purchase Details
- Warranty
- Documents
- QR Code

---

## FR-004 Asset Allocation

Assets may be allocated only when:

- Available
- User has permission

The system must prevent duplicate allocations.

---

## FR-005 Asset Transfer

Transfers require approval.

Every transfer creates:

- Audit event
- Notification
- History record

---

## FR-006 Resource Booking

Shared resources shall support:

- Calendar view
- Time slots
- Availability
- Conflict prevention

Double booking must be impossible.

---

## FR-007 Maintenance

Maintenance workflow:

Request

↓

Approval

↓

Assignment

↓

Repair

↓

Resolution

↓

Asset Available

---

## FR-008 Audit Cycle

Managers may create audit cycles.

Assets must be verified.

Discrepancies recorded.

Reports generated.

---

## FR-009 Dashboard

Dashboard shall display:

- Total Assets
- Allocated Assets
- Available Assets
- Under Maintenance
- Overdue Assets
- Upcoming Maintenance
- Department Statistics

---

## FR-010 Notifications

System shall notify users about:

- Allocation
- Transfer
- Approval
- Maintenance
- Audit
- Overdue Returns

---

# 8. Non-Functional Requirements

Performance

- Dashboard < 2 seconds
- Search < 500ms
- Allocation < 1 second

Security

- JWT
- RBAC
- Input validation
- SQL Injection prevention
- Rate limiting

Scalability

Architecture should support future ERP modules.

Maintainability

Reusable modules.

Reusable services.

Reusable workflows.

Availability

System should remain deployable throughout development.

---

# 9. Business Rules

## Asset Rules

Assets have exactly one active lifecycle state.

Assets cannot be:

- Allocated twice
- Booked twice
- Under maintenance and allocated simultaneously

---

## Allocation Rules

Only Available assets may be allocated.

Allocated assets cannot be allocated again.

Returns restore Available state.

---

## Booking Rules

Overlapping reservations are prohibited.

Bookings require availability validation.

Database must enforce overlap prevention.

---

## Transfer Rules

Transfers require approval.

Transfers create immutable history.

---

## Maintenance Rules

Maintenance changes lifecycle state.

Assets under maintenance cannot be allocated.

Resolution restores availability.

---

## Audit Rules

Audit logs are immutable.

Audit history cannot be modified.

Every business action creates an audit event.

---

# 10. Asset Lifecycle

The asset lifecycle is represented as a state machine.

Available

↓

Allocated

↓

Returned

↓

Available

Available

↓

Reserved

↓

Available

Available

↓

Under Maintenance

↓

Available

Available

↓

Lost

Available

↓

Disposed

Available

↓

Retired

Invalid transitions are prohibited.

---

# 11. Success Criteria

The application is considered successful when:

- Assets can be registered
- Assets can be allocated
- Transfers work
- Booking conflicts are impossible
- Maintenance workflow completes
- Audit logs remain immutable
- Dashboard updates correctly
- Permissions work correctly
- Deployment succeeds

---

# 12. Out of Scope

The following are intentionally excluded.

- Purchasing
- Procurement
- Vendors
- Accounting
- Payroll
- Inventory forecasting
- Predictive AI
- Financial reporting
- ERP accounting modules

---

# 13. Assumptions

- Single organization
- Internal users only
- Browser-based application
- PostgreSQL database
- QR scanner supported by browser
- Modern browsers only

---

# 14. Demo Strategy

The live demonstration should showcase engineering quality rather than simply clicking through screens.

Recommended sequence:

1. Login as Admin.
2. Register a new asset and show automatic QR generation.
3. Allocate the asset to an employee.
4. Open a second browser window to demonstrate real-time dashboard updates.
5. Attempt a conflicting booking and show server-side rejection.
6. Create a maintenance request and walk through the approval workflow.
7. Display the immutable audit history generated from the previous actions.
8. Scan the QR code and navigate directly to the asset details and history.
9. Show role-based access by switching to an Employee account.
10. End with the dashboard summarizing allocations, maintenance, and utilization.

The goal is to demonstrate:

- Correctness
- Security
- Real-time collaboration
- Workflow-driven architecture
- Enterprise-grade engineering

---

# 15. Future Scope

Potential future enhancements include:

- Multi-organization support
- Procurement module
- Vendor management
- Asset depreciation
- Mobile application
- Predictive maintenance
- AI Operations Copilot
- RAG support for manuals and policy documents
- Advanced reporting
- ERP integrations

---

# References

This document should be read together with:

- 01_CONTEXT.md
- 03_SYSTEM_ARCHITECTURE.md
- 04_DATABASE_DESIGN.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_FRONTEND_DESIGN_SYSTEM.md
- 07_SECURITY_AND_ENGINEERING_RULES.md
- 08_AI_AND_IMPLEMENTATION_GUIDE.md