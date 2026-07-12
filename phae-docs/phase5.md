# Phase 05 — Asset Registry & Digital Asset Identity

Version: 1.0

---

# Objective

Build the central Asset Registry of AssetFlow.

This phase creates the digital identity of every physical asset within the organization. Every asset should have a unique identity, complete metadata, supporting documents, QR code, lifecycle status, and searchable records.

The Asset Registry serves as the foundation for all future workflows, including allocation, booking, maintenance, audits, and analytics.

By the end of this phase, the organization should be able to register, manage, search, and view assets through a centralized registry.

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

---

# Business Context

Every physical asset requires a permanent digital identity.

An asset should never lose its identity, even if:

- Allocated
- Returned
- Transferred
- Repaired
- Audited
- Retired

The Asset Registry becomes the single source of truth for every asset.

Future modules must consume asset data rather than maintaining their own copies.

---

# Technical Scope

This phase includes

- Asset Registration
- Asset Profile
- Asset Number Generation
- Asset Tag Generation
- QR Code Generation
- Asset Images
- Asset Documents
- Warranty Details
- Purchase Details
- Vendor Information (Read Only)
- Serial Numbers
- Asset Specifications
- Asset Timeline
- Asset Search
- Advanced Filters
- Asset Status Management

---

# Out of Scope

Do NOT implement

- Asset Allocation
- Transfers
- Booking
- Maintenance
- Audit
- Reports
- AI

Asset registration only.

---

# Architecture Decisions

Each asset has one immutable identity.

The Asset Registry owns:

- Metadata
- Documents
- Images
- QR Code
- Status
- Timeline

Workflow modules reference assets through asset_id only.

No module should duplicate asset information.

---

# Database Changes

Create tables

Assets

AssetImages

AssetDocuments

AssetTimeline

Relationships

Department → Asset

Category → Asset

Location → Asset

Asset → Images

Asset → Documents

Asset → Timeline

---

# Asset Fields

Each asset should contain:

- Asset Number
- Asset Tag
- Asset Name
- Category
- Department
- Location
- Manufacturer
- Model
- Serial Number
- Purchase Date
- Purchase Cost
- Warranty Expiry
- Status
- Description
- QR Code
- Image
- Documents

---

# Asset Lifecycle Status

Initial statuses

- Available
- Reserved
- Allocated
- Under Maintenance
- Lost
- Retired
- Disposed

Status changes must only occur through future workflow modules.

Direct status editing is prohibited.

---

# Backend Tasks

Asset Registration

Asset Details

Asset Search

Asset Filters

QR Generation

Image Upload

Document Upload

Timeline Service

Asset Validation

Asset Repository

---

# API Endpoints

Assets

```
GET /assets

GET /assets/:id

POST /assets

PUT /assets/:id

DELETE /assets/:id
```

Uploads

```
POST /assets/:id/image

POST /assets/:id/document
```

QR

```
GET /assets/:id/qrcode
```

Search

```
GET /assets/search
```

---

# Frontend Tasks

Pages

- Asset List
- Asset Details
- Register Asset
- Edit Asset

Components

- Asset Table
- Asset Form
- Image Upload
- Document Upload
- QR Code Viewer
- Timeline
- Search Filters
- Status Badge

---

# Business Rules

Asset Number is immutable.

Asset Tag is unique.

Serial Number must be unique where applicable.

Department is mandatory.

Category is mandatory.

Location is mandatory.

Asset cannot exist without a category.

Asset cannot exist without a department.

QR Code generated automatically.

Timeline entry created on registration.

Images are optional.

Documents are optional.

---

# Validation Rules

Required

- Name
- Category
- Department
- Location

Optional

- Warranty
- Purchase Cost
- Manufacturer
- Model
- Description

Validate

- Purchase Date
- Warranty Date
- Duplicate Asset Tags
- Duplicate Asset Numbers

---

# Search & Filtering

Search by

- Asset Name
- Asset Number
- Asset Tag
- Serial Number

Filter by

- Department
- Category
- Location
- Status
- Purchase Date
- Warranty Expiry

Sort by

- Name
- Created Date
- Purchase Date
- Status

Pagination mandatory.

---

# QR Code

Each asset automatically receives a QR code.

Scanning the QR code should navigate directly to the Asset Details page.

The QR code should encode only the Asset ID or Asset Number, not sensitive metadata.

---

# Asset Timeline

Every asset maintains an immutable timeline.

Events include:

- Registered
- Updated
- Image Uploaded
- Document Added

Future phases will append:

- Allocated
- Returned
- Transferred
- Maintenance Started
- Maintenance Completed
- Audit Completed

Timeline entries are append-only.

---

# File Storage

Supported uploads

- Images
- PDFs
- Manuals
- Warranty Documents
- Invoices

Use Cloudinary or ImageKit.

Only metadata is stored in PostgreSQL.

---

# RBAC

Administrator

- Full Access

Asset Manager

- Create
- Update
- View

Department Head

- View Department Assets

Employee

- View Assigned Assets (future)

---

# Acceptance Criteria

Assets can be registered.

QR Codes generated automatically.

Images upload successfully.

Documents upload successfully.

Search works.

Filters work.

Timeline created.

Asset tags remain unique.

Asset status initialized correctly.

---

# Testing Checklist

Verify

- Asset Registration
- Duplicate Asset Tag
- Duplicate Asset Number
- QR Generation
- Image Upload
- Document Upload
- Search
- Filters
- Pagination
- Timeline Creation
- Validation
- RBAC

---

# GitHub Issues

AST-001 Asset Model

AST-002 Asset Registration

AST-003 Asset Details

AST-004 Asset Search

AST-005 Asset Filters

AST-006 QR Code Generation

AST-007 Image Upload

AST-008 Document Upload

AST-009 Asset Timeline

AST-010 Frontend Screens

AST-011 Validation

AST-012 RBAC

---

# Reusable Components Produced

Asset Service

Asset Repository

QR Service

Timeline Service

File Upload Service

Search Components

Filter Components

Status Badge Components

Asset Form Components

Asset Table Components

These services become dependencies for Allocation, Booking, Maintenance, Audit, Analytics, and AI.

---

# Definition of Success

The phase is complete when:

✓ Assets can be registered with complete metadata.

✓ Every asset has a permanent digital identity.

✓ Asset numbers and tags are unique.

✓ QR codes are automatically generated.

✓ Images and documents can be attached.

✓ Search, filtering, sorting, and pagination work.

✓ Asset timelines are automatically created.

✓ All operations respect RBAC and validation rules.

✓ The Asset Registry is ready to support future workflow modules without modification.

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

- Treat the Asset Registry as the single source of truth for all asset metadata.
- Generate immutable Asset Numbers and Asset Tags.
- Automatically generate QR codes during asset creation.
- Store uploaded files in cloud storage and persist only metadata in PostgreSQL.
- Build reusable services and UI components.
- Do not implement allocation, booking, maintenance, or audit workflows in this phase.
- Ensure all APIs include validation, RBAC, standardized responses, audit events, and proper transaction handling.