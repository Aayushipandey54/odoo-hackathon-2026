# Phase 08 — Preventive Maintenance & Service Management Engine

Version: 1.0

---

# Objective

Build the enterprise maintenance management engine for AssetFlow.

This phase enables organizations to manage the complete maintenance lifecycle of assets, from issue reporting to work order completion.

The engine should support corrective maintenance, preventive maintenance scheduling, technician assignment, approval workflows, service history, and maintenance analytics.

At the completion of this phase, every maintenance activity should become traceable, auditable, and workflow-driven.

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
- Phase 06
- Phase 07

---

# Business Context

Enterprise assets eventually require maintenance.

Maintenance should never be handled through simple status updates.

Instead, every maintenance activity must follow a structured service workflow.

Examples include

- Laptop Repair
- Projector Service
- Vehicle Servicing
- Air Conditioner Repair
- Generator Inspection
- Printer Cartridge Replacement

Every maintenance request should generate a permanent service history.

---

# Technical Scope

This phase includes

- Maintenance Requests
- Work Orders
- Technician Assignment
- Maintenance Approval
- Preventive Maintenance Scheduler
- Corrective Maintenance
- Maintenance Status Tracking
- Maintenance Attachments
- Maintenance Timeline
- Service History
- Maintenance Notifications
- SLA Tracking

---

# Out of Scope

Do NOT implement

- Audit Cycles
- Analytics
- AI

---

# Architecture Decisions

Maintenance is workflow-driven.

All maintenance operations must reuse

- Workflow Engine
- Approval Engine
- Notification Engine
- Timeline Engine

Assets under maintenance cannot be:

- Allocated
- Reserved
- Booked

---

# Database Changes

Create tables

MaintenanceRequests

WorkOrders

MaintenanceSchedules

Technicians

MaintenanceHistory

Relationships

Asset → Maintenance Requests

Maintenance → Work Orders

Technician → Work Orders

Maintenance → Timeline

---

# Maintenance Workflow

Employee Reports Issue

↓

Maintenance Request

↓

Approval

↓

Work Order Created

↓

Technician Assigned

↓

Repair

↓

Verification

↓

Completed

↓

Asset Available

---

# Maintenance Status

Supported statuses

- Pending
- Approved
- Assigned
- In Progress
- Waiting Parts
- Completed
- Rejected
- Cancelled

Status transitions must be validated.

---

# Preventive Maintenance

Support recurring maintenance schedules.

Examples

- Every Month
- Every Quarter
- Every 6 Months
- Every Year

Use node-cron to generate upcoming maintenance reminders.

---

# Work Orders

Each approved maintenance request creates a work order.

Work orders include

- Technician
- Priority
- Due Date
- Estimated Time
- Status
- Notes
- Attachments

---

# Backend Tasks

Maintenance Service

Work Order Service

Schedule Service

Technician Service

Maintenance Timeline

Notification Service

Scheduler

---

# API Endpoints

Maintenance

```
GET /maintenance

POST /maintenance

PUT /maintenance/:id
```

Work Orders

```
GET /work-orders

POST /work-orders

PUT /work-orders/:id
```

Schedules

```
GET /maintenance/schedules

POST /maintenance/schedules
```

Technicians

```
GET /technicians
```

---

# Frontend Tasks

Pages

- Maintenance Dashboard
- Maintenance Requests
- Work Orders
- Preventive Maintenance
- Technician Assignments

Components

- Work Order Card
- Maintenance Timeline
- Technician Selector
- Priority Badge
- SLA Indicator
- Schedule Calendar

---

# Business Rules

Assets under maintenance cannot be allocated.

Completed maintenance restores asset availability.

Rejected requests create audit history.

Every maintenance request creates timeline events.

Preventive maintenance should generate reminders.

Only Asset Managers may approve maintenance.

Technicians may update work order progress.

---

# Validation Rules

Validate

- Asset Exists
- Technician Exists
- Valid Schedule
- Valid Priority
- Valid Status Transition

Reject

- Duplicate Work Orders
- Invalid Asset
- Invalid Dates
- Invalid State Changes

---

# RBAC

Administrator

- Full Access

Asset Manager

- Approve
- Assign Technician
- Close Work Order

Technician

- Update Assigned Work Orders

Employee

- Submit Maintenance Request
- View Own Requests

---

# Notifications

Generate notifications for

- Maintenance Requested
- Approved
- Technician Assigned
- Work Started
- Work Completed
- Preventive Maintenance Due
- SLA Breach

---

# Scheduler

node-cron responsibilities

- Preventive Maintenance Reminders
- Overdue Work Orders
- SLA Monitoring

---

# Acceptance Criteria

Maintenance requests work.

Work orders generated.

Technicians assigned.

Status workflow enforced.

Recurring maintenance supported.

Notifications generated.

Timeline updated.

Scheduler running.

Assets unavailable during maintenance.

---

# Testing Checklist

Verify

- Request Creation
- Approval
- Rejection
- Technician Assignment
- Work Completion
- Preventive Schedule
- Notifications
- Scheduler
- Timeline
- Status Validation
- RBAC

---

# GitHub Issues

MAIN-001 Maintenance Module

MAIN-002 Work Order Engine

MAIN-003 Technician Module

MAIN-004 Preventive Scheduler

MAIN-005 Timeline

MAIN-006 Notifications

MAIN-007 Scheduler

MAIN-008 Frontend Dashboard

MAIN-009 Validation

MAIN-010 RBAC

---

# Reusable Components Produced

Maintenance Engine

Work Order Engine

Technician Service

Scheduler

Timeline Components

Priority Components

Calendar Components

SLA Service

These become reusable infrastructure for future ERP modules.

---

# Definition of Success

The phase is complete when

✓ Maintenance requests can be submitted.

✓ Work orders are automatically created.

✓ Technicians can be assigned.

✓ Asset lifecycle integrates with maintenance.

✓ Preventive maintenance schedules work.

✓ Notifications and reminders function correctly.

✓ Timeline records every maintenance event.

✓ Assets become unavailable while maintenance is active.

The application now supports enterprise-grade asset servicing.

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

- Reuse the Workflow Engine for all maintenance state transitions.
- Automatically update asset lifecycle based on maintenance status.
- Generate work orders only after approval.
- Implement recurring maintenance using node-cron.
- Emit audit events, notifications, and timeline entries for every maintenance action.
- Keep maintenance services independent and reusable for future ERP modules.