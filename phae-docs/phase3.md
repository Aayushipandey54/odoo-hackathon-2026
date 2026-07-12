# Phase 03 — Authentication & Authorization

Version: 1.0

---

# Objective

Build the complete authentication and authorization system for AssetFlow.

This phase establishes secure user authentication, role-based access control (RBAC), session management, and permission enforcement.

Every future API and frontend route depends on this phase.

By the end of this phase, the application should support secure login, protected routes, role-based authorization, and user identity management.

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

---

# Business Context

AssetFlow is an internal ERP system.

Every action must be performed by an authenticated user.

Every authenticated user has a predefined role.

Permissions are determined only by the backend.

Users can never elevate their own permissions.

Authentication and authorization must remain centralized.

---

# Technical Scope

This phase includes

- JWT Authentication
- Refresh Tokens
- Login
- Logout
- User Profile
- Password Hashing
- Role Based Access Control
- Permission Middleware
- Route Guards
- Protected APIs
- Session Strategy
- Authentication Middleware
- Authorization Middleware
- Role Promotion Framework
- Current User Endpoint

---

# Out of Scope

Do NOT implement

- Departments
- Employees CRUD
- Asset Management
- Booking
- Maintenance
- Audit
- Notifications
- AI

Authentication only.

---

# Architecture Decisions

Authentication

JWT Access Token

+

Refresh Token

Authorization

RBAC

Permission checks happen in middleware before controllers.

Business services must never assume permissions.

---

# User Roles

Administrator

- Full Access

Asset Manager

- Asset Management
- Allocation
- Maintenance

Department Head

- Department Operations
- Approvals

Employee

- View Assets
- Request Assets
- Book Resources
- Request Maintenance

---

# Authentication Flow

```

Login

↓

Credentials Validation

↓

JWT Generation

↓

Refresh Token

↓

Client Storage

↓

Authenticated Requests

↓

JWT Verification

↓

RBAC Check

↓

Controller

↓

Service

```

---

# Folder Structure

```

modules/

auth/

controllers/

services/

repositories/

routes/

validators/

middleware/

types/

```

---

# Database Changes

Create tables

Users

Roles

Permissions

RolePermissions

RefreshTokens

No business entities yet.

---

# Backend Tasks

Authentication

- Register
- Login
- Logout
- Refresh Token
- Verify Token

Authorization

- RBAC Middleware
- Permission Checker
- Role Guard

User

- Current User
- User Profile

Security

- Password Hashing
- Token Validation
- Session Validation

---

# API Endpoints

Authentication

```

POST /auth/login

POST /auth/logout

POST /auth/refresh

GET /auth/me

```

Administration

```

PATCH /users/:id/role

```

Only administrators can change roles.

---

# Validation Rules

Login

- Email Required
- Password Required

Passwords

- Minimum Length
- Strong Password Rules

JWT

- Signature Verification
- Expiration Check

Refresh Tokens

- Rotation
- Expiration
- Revocation

---

# Permission Matrix

Administrator

- Full Access

Asset Manager

- Asset Module
- Maintenance
- Allocation

Department Head

- Department Assets
- Approvals

Employee

- Personal Assets
- Bookings
- Maintenance Requests

---

# Security Requirements

Passwords must never be stored in plaintext.

JWT Secret must come from environment variables.

Refresh tokens must be securely stored.

Every protected endpoint requires authentication.

Every authenticated endpoint requires RBAC.

Never expose internal user information.

---

# Middleware

Authentication Middleware

Responsibilities

- Verify JWT
- Load User
- Attach User Context

Authorization Middleware

Responsibilities

- Verify Role
- Verify Permissions
- Reject Unauthorized Access

---

# Error Cases

Invalid Credentials

↓

401 Unauthorized

Expired Token

↓

401 Unauthorized

Insufficient Permission

↓

403 Forbidden

Missing Token

↓

401 Unauthorized

Invalid Role

↓

403 Forbidden

---

# Frontend Tasks

Pages

- Login
- Unauthorized
- Forbidden

Components

- Login Form
- User Avatar
- Profile Menu

Utilities

- API Client
- Token Storage
- Auth Context
- Protected Routes

---

# Acceptance Criteria

Authentication works.

JWT issued successfully.

Refresh tokens work.

Protected APIs reject anonymous users.

RBAC blocks unauthorized users.

Current user endpoint returns authenticated user.

Role promotion works.

Passwords are hashed.

Logout invalidates refresh token.

---

# Testing Checklist

Verify

- Login
- Logout
- Refresh
- Invalid Password
- Invalid JWT
- Expired JWT
- Missing Token
- RBAC
- Role Promotion
- Protected Endpoints

---

# GitHub Issues

AUTH-001 User Model

AUTH-002 JWT Authentication

AUTH-003 Refresh Tokens

AUTH-004 Login API

AUTH-005 Logout API

AUTH-006 Current User

AUTH-007 Authentication Middleware

AUTH-008 Authorization Middleware

AUTH-009 RBAC Engine

AUTH-010 Role Promotion

AUTH-011 Frontend Authentication

AUTH-012 Protected Routes

---

# Definition of Success

The phase is complete when

✓ Users can log in securely.

✓ JWT authentication works.

✓ Refresh token rotation works.

✓ RBAC prevents unauthorized access.

✓ Passwords are securely hashed.

✓ Every protected API requires authentication.

✓ Role changes can only be performed by administrators.

✓ Frontend supports authenticated navigation.

The codebase should now be secure enough to begin implementing ERP business modules.

---

# Reusable Components Produced

Authentication Service

JWT Utility

Refresh Token Service

RBAC Middleware

Permission Middleware

Current User Context

Protected Route Component

Authentication Hooks

Role Checker

Permission Checker

These components must be reused by every future module.

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

- Build authentication as a reusable framework.
- Keep authorization separate from business logic.
- Do not hardcode roles or permissions.
- Ensure every protected endpoint passes through authentication and RBAC middleware.
- Use secure password hashing and JWT best practices.
- Prepare the project so that all future ERP modules can rely on this authentication system without modification.