# Project Odoo

## Architecture
This is a monorepo containing a full-stack application.
- `frontend/` - React application
- `backend/` - Node.js Express application

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Install dependencies for backend and frontend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Copy `.env.example` to `.env` in the root (if required by your setup) or in `frontend/` and `backend/`.

3. Run the development servers:
   - Backend: `npm run dev` (inside `backend/`)
   - Frontend: `npm run dev` (inside `frontend/`)
