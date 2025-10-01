# Income Tax Calculator

Simple full-stack project with a NestJS backend and a Next.js frontend that calculates Philippine income tax.

## Quick start (Windows)

Prerequisites: Node.js (v18+), npm

1. Install dependencies:
   - From repo root:
     ```
     npm install
     ```
     ```
     cd backend && npm install
     cd ../frontend && npm install
     ```

2. Configure environment
   - Backend: edit `backend/.env` as needed (DB/config).
     ```
      DB_HOST=
      DB_PORT=
      DB_USERNAME=
      DB_PASSWORD=
      DB_NAME=
     ```

3. Run both services (from repo root):
   ```
   npm run dev
   ```
   - Backend (Nest) default: http://localhost:3000
   - Frontend (Next) default: http://localhost:8000

You can also run individually:
- Backend dev: `cd backend && npm run start:dev`
- Frontend dev: `cd frontend && npm run dev`
