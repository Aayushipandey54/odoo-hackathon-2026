# AssetFlow — Enterprise Asset & Resource Management System

**AssetFlow** is a modern Enterprise Asset & Resource Management System developed for the **Odoo Hackathon 2026**. It helps organizations efficiently manage assets, shared resources, maintenance workflows, audits, and analytics through a centralized ERP platform.

Built on a **Modular Monolith Architecture**, AssetFlow combines a scalable backend with a modern, responsive interface powered by the **IntelliX Design System**.

---

## Overview

AssetFlow replaces manual asset tracking with a centralized platform that enables organizations to:

- Manage departments, employees, and asset categories
- Track assets throughout their lifecycle
- Allocate and transfer assets securely
- Book shared resources without scheduling conflicts
- Manage maintenance workflows and approvals
- Conduct audit cycles and generate reports
- Monitor operations through real-time dashboards

Designed for educational institutions, enterprises, hospitals, factories, and other organizations managing physical assets.

---

## Key Features

- Asset Registration & Lifecycle Tracking
- QR Code-Based Asset Identification
- Asset Allocation & Transfer Workflow
- Shared Resource Booking
- Maintenance Management
- Audit & Compliance
- Reports & Analytics
- Notifications & Activity Logs
- Role-Based Access Control (RBAC)

---

## System Architecture

```
React + Vite
      │
 Nginx Reverse Proxy
      │
Express.js + TypeScript
      │
 Prisma ORM
      │
PostgreSQL + Redis
```

---

## Technology Stack

| Layer | Technologies |
|--------|--------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL, Redis |
| Infrastructure | Docker, Docker Compose, Nginx |

---

## Repository Structure

```text
odoo-hackathon-2026/
├── backend/
├── frontend/
├── nginx/
├── scripts/
├── .github/
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Docker & Docker Compose

### Start Infrastructure

```bash
docker-compose up -d
```

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Application runs at:

```
http://localhost:5173
```

---

## Demo Video

**Project Demo:**  
**[Add YouTube / Google Drive Link Here]**

---

## Screenshots

Add screenshots of:

- Dashboard
- Asset Management
- Resource Booking
- Maintenance Module
- Analytics Dashboard

---

## Future Scope

- AI-powered Predictive Maintenance
- RFID & IoT Integration
- Mobile Application
- OCR-Based Asset Registration
- Advanced Analytics & Forecasting

---

## Team

Developed by:

- **Aayushi Pandey**
- **Nishant Shetty**
- **Aayush Singh**
- **Vrushika Panchal**

---

## License

Developed as part of the **Odoo Hackathon 2026** for educational and demonstration purposes.
