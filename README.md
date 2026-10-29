# Traveller MVP

An AI-powered local travel marketplace connecting travellers directly with verified native destination tour operators in the Himalayas (Sikkim & Gangtok, Shimla & Kufri).

---

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, TypeScript
- **Backend**: Express 4, TypeScript, Prisma 6 ORM, SQLite (`/data/dev.db`)
- **Reverse Proxy**: Nginx Alpine

---

## Docker Deployment

### Prerequisites
- Docker Engine 20.10+ / Docker Desktop
- Docker Compose v2+ (`docker compose`)

### 1. First Run & Configuration
Create your local environment file from the provided example:

```bash
cp backend/.env.example backend/.env
```

Ensure production JWT secrets and API configuration are populated in `backend/.env`:
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

Build and launch the complete stack:

```bash
docker compose up --build
```

### 2. Seeding the Database
Database seeding is strictly opt-in and controlled by the `SEED_DB` environment variable (never runs automatically on startup):

**Option A — Seed during initial compose up:**
```bash
SEED_DB=true docker compose up --build
```

**Option B — Seed via standalone one-off container:**
```bash
docker compose run --rm -e SEED_DB=true backend
```

### 3. Application URLs
The Nginx reverse proxy serves both the single-page application and routes `/api/` requests to the internal backend container under a single origin (`http://localhost:8080`):

- **Web Application**: [http://localhost:8080](http://localhost:8080)
- **API Health Check**: [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health)
- **Packages API**: [http://localhost:8080/api/v1/packages](http://localhost:8080/api/v1/packages)

### 4. Viewing Logs
Stream live container logs:

```bash
# All services
docker compose logs -f

# Backend service only
docker compose logs -f backend

# Frontend Nginx service only
docker compose logs -f frontend
```

### 5. Resetting Database & Volumes
The SQLite database is stored in a dedicated named Docker volume (`traveller_data`). To reset the volume and clear all runtime data:

```bash
docker compose down -v
```

### 6. Development Compose Override (Hot Reloading)
To run with live bind-mounts and hot-module replacement for local development:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```
- **Frontend (Vite HMR)**: [http://localhost:5173](http://localhost:5173)
- **Backend API (`tsx watch`)**: [http://localhost:5000](http://localhost:5000)
- Node modules are preserved inside anonymous container volumes to prevent host/container conflicts.

---

## Local Development (Without Docker)

1. **Install Dependencies**:
   ```bash
   npm ci
   cd backend && npm ci
   ```

2. **Generate Prisma Client & Seed**:
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:seed
   ```

3. **Run Services**:
   ```bash
   # Terminal 1: Backend (Port 5000)
   cd backend && npm run dev

   # Terminal 2: Frontend (Port 5173)
   npm run dev
   ```
