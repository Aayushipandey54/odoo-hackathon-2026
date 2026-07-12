# AssetFlow — Enterprise Asset & Resource Management System

AssetFlow is a high-performance **Modular Monolith** designed for enterprises and educational institutions to manage the complete asset lifecycle, resource scheduling, maintenance operations, audits, and analytics.

The platform delivers a premium user experience through the **IntelliX Design System**, featuring a dark-mode-first interface, glassmorphism components, smooth micro-interactions, and responsive design.

---

# 🏗️ System Architecture & Tech Stack

AssetFlow follows a **Monorepo Architecture** to maintain consistent data contracts, type safety, and streamlined development across frontend and backend.

## Backend

- Express.js
- TypeScript
- Prisma ORM

## Database & Cache

- PostgreSQL
- Redis

## Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- IntelliX Glassmorphism Design System

## Infrastructure

- Docker Compose
- Nginx Reverse Proxy

---

# 📂 Repository Structure

```text
odoo-hackathon-2026/
│
├── .github/                 # CI/CD workflows
├── backend/                 # Express server, Prisma, APIs
├── frontend/                # React + Vite application
├── nginx/                   # Reverse proxy configuration
├── scripts/                 # Utility and deployment scripts
├── .gitignore
├── .neon
├── package.json             # Monorepo workspace configuration
└── README.md
```

---

# 🎨 IntelliX Design Tokens

```css
:root {
  /* Background */
  --bg-app: #000000;
  --bg-surface: #0a0a0a;
  --bg-card: #111111;

  /* Typography */
  --text-primary: #ffffff;

  /* Glassmorphism */
  --glass-fill: rgba(255, 255, 255, 0.05);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --card-radius: 24px;
  --backdrop-blur: 24px;
}
```

---

# 🚀 Quick Start

## Prerequisites

- Node.js (v18 or later)
- Docker
- Docker Compose

---

## 1. Start Infrastructure

```bash
docker-compose up -d
```

This starts:

- PostgreSQL
- Redis
- Nginx Reverse Proxy

---

## 2. Run Backend

```bash
cd backend

npm install

npx prisma migrate dev

npm run dev
```

---

## 3. Run Frontend

Open another terminal.

```bash
cd frontend

npm install

npm run dev
```

Application will be available at

```
http://localhost:5173
```

or through the configured Nginx reverse proxy.

---

# 🗺️ Development Roadmap

## Phase 1–3

- Infrastructure setup
- Monorepo configuration
- Authentication
- RBAC
- Base CRUD architecture

---

## Phase 4–8

- Asset Master
- Department Master
- Employee Management
- QR Code Generation
- Asset Allocation
- Booking Engine
- Preventive Maintenance
- Calendar Scheduling

---

## Phase 9

### Audit & Compliance

- Physical Verification
- Audit Cycles
- Asset History
- Discrepancy Tracking
- Immutable Activity Logs

---

## Phase 10

### Dashboard & Analytics

- KPI Cards
- Available Assets
- Allocated Assets
- Overdue Maintenance
- Interactive Charts
- WebSocket Realtime Updates

---

## Phase 11–13

- Performance Optimization
- Docker Production Deployment
- Security Hardening
- Scaling
- Monitoring
- Enterprise Readiness

---

# ✨ Core Features

- Enterprise Asset Lifecycle Management
- Department & Employee Management
- QR Code Based Asset Identification
- Asset Allocation & Transfer Workflow
- Shared Resource Booking System
- Maintenance Management
- Preventive Maintenance Scheduling
- Audit & Compliance Tracking
- Role-Based Access Control (RBAC)
- Real-time Dashboard & Analytics
- Redis Powered Performance Optimization
- Dockerized Deployment
- Responsive Glassmorphism UI
- IntelliX Design System

```

```
