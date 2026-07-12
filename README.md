# AssetFlow — Enterprise Asset & Resource Management System

> **AssetFlow** is a modern Enterprise Asset & Resource Management System developed for the **Odoo Hackathon 2026**. It enables organizations to efficiently manage physical assets, shared resources, maintenance workflows, audits, and analytics through a centralized ERP platform.

Built using a scalable **Modular Monolith Architecture**, AssetFlow combines enterprise-grade backend engineering with a premium, responsive user interface powered by the **IntelliX Design System**.

---

## Overview

Organizations often struggle with fragmented spreadsheets, manual tracking, double allocations, and inefficient maintenance processes. AssetFlow addresses these challenges by providing a unified platform to:

- Manage departments and employees
- Track complete asset lifecycles
- Allocate and transfer assets securely
- Book shared resources without scheduling conflicts
- Automate maintenance approval workflows
- Conduct structured asset audits
- Monitor KPIs through real-time dashboards
- Generate reports and operational insights

The platform is designed to be flexible enough for educational institutions, enterprises, hospitals, factories, government organizations, and any institution managing physical assets.

---

# Key Features

### Organization Management

- Department Management
- Employee Directory
- Asset Category Management
- Role-Based Access Control (RBAC)

### Asset Management

- Asset Registration
- QR Code Generation
- Asset Lifecycle Tracking
- Asset History
- Asset Search & Filtering

### Allocation & Transfer

- Asset Allocation
- Conflict Detection
- Transfer Approval Workflow
- Return Management
- Overdue Tracking

### Resource Booking

- Shared Resource Calendar
- Time Slot Validation
- Conflict Prevention
- Booking Reminders

### Maintenance Management

- Maintenance Requests
- Approval Workflow
- Technician Assignment
- Repair Tracking
- Maintenance History

### Audit & Compliance

- Audit Cycle Management
- Auditor Assignment
- Discrepancy Reports
- Immutable Audit Logs

### Reports & Analytics

- KPI Dashboard
- Asset Utilization
- Maintenance Analytics
- Department Reports
- Resource Booking Heatmaps

### Notifications & Activity Logs

- Real-time Notifications
- Action History
- Approval Updates
- Audit Logs

---

# System Architecture

AssetFlow follows a **Modular Monolith Architecture** using a **Monorepo** structure to ensure consistency, scalability, and maintainability.

```
                Client (React + Vite)
                        │
                        │
                 Nginx Reverse Proxy
                        │
        ┌───────────────┴───────────────┐
        │                               │
  Express.js Backend              Redis Cache
        │
   Prisma ORM
        │
 PostgreSQL Database
```

---

# Technology Stack

## Backend

- Express.js
- TypeScript
- Prisma ORM

## Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- IntelliX Design System

## Database

- PostgreSQL
- Redis

## Infrastructure

- Docker
- Docker Compose
- Nginx

---

# Repository Structure

```text
odoo-hackathon-2026/
│
├── .github/                # GitHub Actions & CI/CD
├── backend/                # Express.js + Prisma Backend
├── frontend/               # React + Vite Frontend
├── nginx/                  # Reverse Proxy Configuration
├── scripts/                # Utility Scripts
├── package.json            # Workspace Configuration
├── README.md
└── .gitignore
```

---

# UI Design

AssetFlow uses the **IntelliX Design System**, inspired by modern SaaS dashboards.

### Highlights

- Dark Mode First
- Glassmorphism Components
- Responsive Layout
- Smooth Micro-interactions
- Mobile-Friendly Design
- Premium Dashboard Experience

---

# Getting Started

## Prerequisites

- Node.js v18+
- Docker
- Docker Compose
- PostgreSQL
- Redis

---

## 1️⃣ Start Infrastructure

```bash
docker-compose up -d
```

This starts:

- PostgreSQL
- Redis
- Nginx

---

## 2️⃣ Backend Setup

```bash
cd backend

npm install

npx prisma migrate dev

npm run dev
```

---

## 3️⃣ Frontend Setup

Open another terminal.

```bash
cd frontend

npm install

npm run dev
```

---

Application will be available at:

```
http://localhost:5173
```

---

# Development Roadmap

### Phase 1–3

- Infrastructure Setup
- Authentication
- RBAC
- CRUD Foundations

### Phase 4–8

- Organization Setup
- Asset Management
- QR Code Generation
- Resource Booking
- Maintenance Workflow

### Phase 9

- Audit & Compliance Engine
- Asset Verification
- Discrepancy Reports

### Phase 10

- Dashboard
- KPI Analytics
- WebSocket Notifications
- Reports

### Phase 11–13

- Performance Optimization
- Security Hardening
- Docker Production Deployment
- Enterprise Scaling

---

# Demo Video

 **Watch the complete project demonstration here:**

> **Demo Link:** **[Add YouTube / Drive Link Here]**

Example:

```
https://youtu.be/your-demo-video
```

---

# Project Screenshots

> Add screenshots here after deployment.

```
Dashboard

Organization Setup

Asset Management

Booking Calendar

Analytics Dashboard
```

---

# Future Enhancements

- AI-powered Predictive Maintenance
- Asset Utilization Forecasting
- Mobile Application
- RFID Integration
- IoT Device Support
- OCR-based Asset Registration
- Advanced Analytics & BI Reports
- Multi-Organization Support

---

# Team

Developed with by

- **Aayushi Pandey**
- **Nishant Shetty**
- **Aayush Singh**
- **Vrushika Panchal**

---

# License

This project was developed as part of the **Odoo Hackathon 2026** and is intended for educational and demonstration purposes.
