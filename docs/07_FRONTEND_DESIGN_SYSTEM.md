# AssetFlow — Frontend Design System

Version: 1.0

---

# Document Purpose

This document defines the frontend architecture, UI principles, reusable components, routing conventions, state management, and design system used throughout AssetFlow.

The goal is consistency.

Every page should feel like it belongs to the same enterprise application.

---

# 1. Frontend Philosophy

AssetFlow is an ERP system.

The UI should prioritize:

- Simplicity
- Clarity
- Productivity
- Consistency

The UI is not a marketing website.

It is an internal business application.

Avoid excessive animations or decorative effects.

Focus on usability.

---

# 2. Technology Stack

Framework

- Next.js (App Router)
- React
- TypeScript

UI

- Tailwind CSS
- shadcn/ui
- Lucide Icons

Data

- TanStack Query

Forms

- React Hook Form
- Zod

Charts

- Recharts

Calendar

- FullCalendar

QR Scanner

- html5-qrcode

---

# 3. Design Language

Theme

- Professional
- Minimal
- Enterprise
- Data-first

Use:

- Cards
- Tables
- Dialogs
- Drawers
- Forms

Avoid:

- Glassmorphism
- Heavy gradients
- Fancy animations
- Complex transitions

---

# 4. Layout Structure

Every page follows the same layout.

```

Sidebar

↓

Top Navigation

↓

Page Header

↓

Actions

↓

Content

↓

Footer (optional)

```

Consistency is mandatory.

---

# 5. Navigation

Sidebar Modules

- Dashboard
- Organization
- Assets
- Booking
- Maintenance
- Audit
- Reports
- Notifications
- Settings

Top Navigation

- Search
- Notifications
- User Profile

---

# 6. Routing Structure

```

/

dashboard

organization

organization/departments

organization/employees

assets

assets/new

assets/:id

booking

maintenance

audit

reports

settings

```

Route names should remain predictable.

---

# 7. UI Components

Reusable components include:

Buttons

Cards

Tables

Dialogs

Forms

Search Bars

Filters

Badges

Status Chips

Pagination

Calendar

Charts

QR Scanner

Notification Panel

Loading Skeletons

Empty States

These should be generic and reusable.

---

# 8. Page Structure

Every page should contain:

Page Title

↓

Description

↓

Primary Action

↓

Filters

↓

Content

↓

Pagination

↓

Footer Actions

---

# 9. Tables

Most ERP screens are table-driven.

Tables should support:

- Search
- Filters
- Sorting
- Pagination
- Row Actions
- Bulk Actions

Tables should remain consistent across every module.

---

# 10. Forms

All forms should use:

React Hook Form

+

Zod Validation

Validation occurs:

Client

↓

Backend

Both layers must validate.

---

# 11. Dashboard

Dashboard includes:

- KPI Cards
- Charts
- Recent Activity
- Upcoming Maintenance
- Active Bookings
- Asset Status Overview
- Department Summary

Dashboard should update in real time.

---

# 12. State Management

Use:

TanStack Query

for

- API data
- Cache
- Refetch
- Invalidation

Use React state only for local UI state.

Avoid unnecessary global state.

---

# 13. Notifications

Notification Center should support:

- Real-time updates
- Read / Unread
- Categories
- Timestamps

Notifications should never require page refresh.

---

# 14. Search & Filters

Every listing page should support:

Search

↓

Filters

↓

Sorting

↓

Pagination

Search should debounce requests.

Filters should be reusable components.

---

# 15. Loading States

Every async page should include:

Loading Skeleton

Error State

Empty State

Retry Action

No blank screens.

---

# 16. Status Indicators

Status should always use visual indicators.

Examples

Available

Allocated

Reserved

Maintenance

Lost

Retired

Disposed

Each status should have:

- Badge
- Color
- Icon (where appropriate)

Status colors must remain consistent throughout the application.

---

# 17. Responsive Design

Desktop First.

Tablet Supported.

Mobile Friendly.

Primary demo target:

1920×1080

Avoid mobile-specific workflows unless necessary.

---

# 18. Accessibility

Buttons require labels.

Forms require validation messages.

Keyboard navigation should work.

Maintain sufficient color contrast.

Icons should include accessible labels where appropriate.

---

# 19. Frontend Guardrails

Never store business logic in components.

Never duplicate API calls.

Never bypass TanStack Query.

Never hardcode permissions.

Never trust frontend validation.

Never directly manipulate server state.

Never duplicate reusable components.

---

# 20. Definition of Done

A frontend feature is complete only if:

✅ Responsive

✅ Accessible

✅ Uses shared components

✅ Connected to backend

✅ Handles loading

✅ Handles errors

✅ Handles empty states

✅ Uses consistent styling

✅ Uses proper validation

✅ Matches the overall design system

---

# 21. UI Principles

Every screen should answer these questions immediately:

- Where am I?
- What can I do?
- What is the current state?
- What action is most important?
- What just changed?

The interface should reduce cognitive load and guide users toward completing business workflows efficiently.

---

# References

This document should be read alongside:

- 01_CONTEXT.md
- 02_PRODUCT_REQUIREMENTS.md
- 03_SYSTEM_ARCHITECTURE.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_SECURITY_AND_ENGINEERING_RULES.md
