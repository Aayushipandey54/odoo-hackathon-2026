# Phase 06 — Enterprise Workflow & Asset Lifecycle Engine

Version: 1.0

---

# Objective

Build the enterprise workflow engine that manages the complete lifecycle of every asset.

This phase transforms AssetFlow from a registry into a business process management system by implementing allocation, return, transfer, approval workflows, lifecycle management, and server-side business rules.

Every asset operation must flow through this engine.

At the completion of this phase, assets should move through controlled workflows instead of direct CRUD operations.

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
- Phase 04
- Phase 05

---

# Business Context

Registering an asset is only the beginning.

Organizations manage assets through business workflows.

Example:

Available

↓

Allocated

↓

Returned

↓

Available

Every transition must be:

- Valid
- Authorized
- Auditable
- Transactional

Users should never directly edit an asset's lifecycle state.

---

# Technical Scope

This phase includes

- Asset Allocation
- Asset Return
- Asset Transfer
- Approval Workflow
- Asset Lifecycle State Machine
- Workflow History
- Assignment History
- Business Rule Validation
- Database Transactions
- Conflict Prevention
- Domain Events
- Workflow Notifications

---

# Out of Scope

Do NOT implement

- Booking
- Maintenance
- Audit Cycles
- Reports
- AI

---

# Architecture Decisions

All asset lifecycle changes must go through the Workflow Engine.

Never update an asset status directly.

The Workflow Engine owns:

- Allocation
- Transfer
- Return
- Approval
- Lifecycle Validation

Future modules (Booking, Maintenance, Audit) will reuse the same workflow infrastructure.

---

# Database Changes

Create tables

Allocations

Transfers

WorkflowHistory

ApprovalRequests

Relationships

Asset → Allocation

Asset → Transfer

Asset → Workflow History

Employee → Allocation

Employee → Transfer

---

# Workflow Engine

Supported workflows

Asset Allocation

↓

Asset Return

↓

Asset Transfer

↓

Approval

↓

Completion

Every workflow generates:

- Audit Event
- Timeline Entry
- Notification
- WebSocket Event

---

# Asset Lifecycle

Allowed States

- Available
- Reserved
- Allocated
- Under Maintenance
- Lost
- Retired
- Disposed

Valid Transitions

Available

↓

Allocated

Allocated

↓

Returned

Returned

↓

Available

Available

↓

Reserved

Reserved

↓

Available

Available

↓

Under Maintenance

Under Maintenance

↓

Available

Invalid transitions must always fail.

---

# Asset Allocation

Workflow

Employee Requests

↓

Validation

↓

Approval (optional)

↓

Allocation

↓

Timeline

↓

Notification

↓

Dashboard Update

Validation

- Asset Exists
- Asset Available
- Employee Exists
- Employee Active
- Permission Granted

---

# Asset Return

Workflow

Employee Returns

↓

Validation

↓

Inspection (future)

↓

Available

↓

Timeline

↓

Notification

---

# Asset Transfer

Workflow

Transfer Request

↓

Department Approval

↓

Ownership Change

↓

Timeline

↓

Notification

Transfers should never bypass approval.

---

# Approval Engine

Generic approval service.

Future modules should reuse this.

Supported approvals

- Transfers
- Maintenance
- Booking (future)

---

# Database Constraints

Prevent

- Multiple Active Allocations
- Invalid Lifecycle States
- Duplicate Transfers

Use PostgreSQL constraints where possible.

Application validation alone is insufficient.

---

# Backend Tasks

Allocation Service

Transfer Service

Return Service

Workflow Service

Approval Service

Lifecycle Validator

Conflict Validator

Workflow Repository

---

# API Endpoints

Allocation

```
POST /allocations

GET /allocations

POST /allocations/:id/return
```

Transfers

```
POST /transfers

GET /transfers

PATCH /transfers/:id/approve

PATCH /transfers/:id/reject
```

Workflow

```
GET /workflow/history/:assetId
```

---

# Frontend Tasks

Pages

- Allocation
- Transfer Requests
- Workflow History

Components

- Allocation Table
- Transfer Dialog
- Approval Dialog
- Workflow Timeline
- Lifecycle Badge
- Assignment History

---

# Business Rules

Asset must be Available before allocation.

Allocated assets cannot be allocated again.

Returned assets become Available.

Transfers require approval.

Workflow history is immutable.

Every transition creates a timeline event.

Every transition creates an audit event.

Status changes only occur through the Workflow Engine.

---

# Validation Rules

Allocation

- Asset Exists
- Employee Exists
- Asset Available

Return

- Allocation Exists
- Employee Owns Asset

Transfer

- Allocation Exists
- Approval Required

Reject all invalid lifecycle transitions.

---

# RBAC

Administrator

- Full Access

Asset Manager

- Allocate
- Return
- Transfer

Department Head

- Approve Transfers

Employee

- Request Return

---

# Transactions

Every workflow executes atomically.

Example

Validate

↓

Create Allocation

↓

Update Asset Status

↓

Create Timeline

↓

Create Audit Event

↓

Create Notification

↓

Commit

Failure

↓

Rollback

---

# Domain Events

Generate events

AssetAllocated

AssetReturned

AssetTransferred

TransferApproved

TransferRejected

WorkflowCompleted

Future modules subscribe to these events.

---

# Acceptance Criteria

Assets can be allocated.

Assets can be returned.

Transfers require approval.

Lifecycle transitions are validated.

Workflow history exists.

Timeline updates automatically.

Notifications generated.

Database constraints prevent invalid states.

Transactions rollback on failure.

---

# Testing Checklist

Verify

- Allocation
- Duplicate Allocation
- Return
- Transfer
- Approval
- Rejection
- Invalid Status Transition
- Rollback
- Timeline
- Notifications
- RBAC

---

# GitHub Issues

WF-001 Allocation Engine

WF-002 Return Engine

WF-003 Transfer Engine

WF-004 Approval Engine

WF-005 Lifecycle State Machine

WF-006 Workflow History

WF-007 Timeline Updates

WF-008 Notifications

WF-009 Transactions

WF-010 Frontend Workflow Screens

---

# Reusable Components Produced

Workflow Engine

Approval Engine

Lifecycle Validator

Allocation Service

Transfer Service

Return Service

Workflow Repository

Domain Event Publisher

Workflow Timeline

Lifecycle Components

These become the foundation for Booking, Maintenance, Audit, Analytics, and AI.

---

# Definition of Success

The phase is complete when

✓ Assets can be allocated securely.

✓ Assets can be returned.

✓ Transfers require approval.

✓ Invalid lifecycle transitions are rejected.

✓ Database integrity is maintained.

✓ Workflow history is immutable.

✓ Notifications are generated.

✓ Timeline updates automatically.

✓ Transactions guarantee consistency.

The system now behaves like an enterprise ERP rather than a CRUD application.

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

- Never change asset status directly.
- All lifecycle transitions must pass through the Workflow Engine.
- Use PostgreSQL constraints and transactions to guarantee correctness.
- Keep approval logic generic so it can be reused by Booking and Maintenance.
- Emit domain events for every completed workflow.
- Ensure timeline, audit events, and notifications are automatically generated.
- Design the Workflow Engine as reusable infrastructure, not asset-specific code.