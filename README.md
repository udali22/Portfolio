# Containerized Portfolio Application

A lightweight, production-ready containerized full-stack portfolio consisting of a **React + Vite** frontend and a **FastAPI (Python 3.12)** backend communicating over an isolated Docker network.

Designed specifically to operate reliably under strict hardware constraints (such as a small Azure VM with **2 vCPU, ~837 MiB RAM, and 29 GB disk**).

---

## 🏛️ System Architecture

```text
                  Host Browser
                       │
       ┌───────────────┴───────────────┐
       │                               │
Port 3000 (UI)                  Port 8000 (API / Docs)
       │                               │
       ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   portfolio-frontend    │     │    portfolio-backend    │
│  (nginx:1.27-alpine)    │     │   (python:3.12-slim)    │
│                         │     │                         │
│  • Vite React SPA       │     │  • FastAPI REST API     │
│  • Reverse proxy /api/ ───────┼──> • Uvicorn (1 worker) │
│  • Memory: ~8-12 MiB    │     │  • Memory: ~35-45 MiB   │
└─────────────────────────┘     └─────────────────────────┘
              ▲                               ▲
              └───────────────┬───────────────┘
                              │
                    Docker Bridge Network
                    `portfolio-network`
```

### Key Highlights
- **Sub-100 MiB Total RAM Footprint**: Perfect for an 837 MiB Azure VM. Leaves >700 MiB of system memory free for the OS, Docker daemon, and future host Nginx reverse proxy.
- **Zero Heavy Infrastructure**: No unnecessary databases (PostgreSQL/Redis), Kafka, or monitoring agents.
- **Multi-Stage Frontend Build**: Vite compiles static assets in a build stage; runtime uses a bare `nginx:alpine` image (~25MB image size, no Node.js runtime in production).
- **Hardened Backend Container**: Non-root system user (`appuser`), slim Python base, no development tools, single production Uvicorn worker.
- **Internal Docker Network Communication**: The frontend web server proxies `/api/` requests directly across `portfolio-network` to `http://backend:8000` via Docker's internal DNS.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Docker Engine & Docker Compose (e.g. Docker Desktop on Windows/macOS or `docker.io` on Ubuntu)

### 2. Configure Environment
A default `.env` file is already created. If starting fresh, copy the template:
```bash
cp .env.example .env
```

### 3. Build & Run Containers
Run the unified compose command:
```bash
docker compose up --build -d
```
> **Tip**: The `-d` flag runs the containers in the background (detached mode).

---

## 🛠️ Docker Developer Experience Commands

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Build images** | `docker compose build` | Rebuilds the frontend & backend container images without starting them. |
| **Start services** | `docker compose up -d` | Starts both containers in detached mode. |
| **Rebuild & Start** | `docker compose up --build -d` | Compiles new code changes and recreates modified containers. |
| **Check container status** | `docker compose ps` | Displays running containers, uptime, open ports, and health status. |
| **Inspect logs** | `docker compose logs -f` | Streams real-time logs from both frontend and backend. |
| **Inspect single service** | `docker compose logs -f backend` | Streams logs specifically from FastAPI. |
| **Stop services** | `docker compose down` | Stops and removes containers and the `portfolio-network`. |

---

## 🌐 Local Port Allocation

When running locally, Docker maps the following host ports:

| Service | Local URL | Description |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:3000](http://localhost:3000) | Vite + React Portfolio interface. All `/api/*` calls are routed across Docker network. |
| **Backend API** | [http://localhost:8000](http://localhost:8000) | FastAPI Root API. |
| **API Docs (Swagger)** | [http://localhost:8000/docs](http://localhost:8000/docs) | Interactive Swagger documentation for exploring endpoints. |
| **Health Check** | [http://localhost:8000/api/health](http://localhost:8000/api/health) | Real-time healthcheck endpoint with uptime and status data. |

> Ports can be customized anytime in `.env` (`FRONTEND_PORT` and `BACKEND_PORT`).

---

## 🩺 Built-in Healthchecks

Both services implement automated Docker healthchecks:

- **Backend (`portfolio-backend`)**:
  Executes a lightweight Python standard library query:
  ```bash
  python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')"
  ```
  *(Zero extra packages required inside the container).*
- **Frontend (`portfolio-frontend`)**:
  Queries the internal Nginx health endpoint:
  ```bash
  wget -q --spider http://localhost:80/healthz
  ```
- **Service Dependency**: In `docker-compose.yml`, `frontend` declares `depends_on: { backend: { condition: service_healthy } }`. Docker ensures the backend is healthy before routing frontend traffic.

---

## 🔒 Environment Variables & Secrets Management

Configuration is managed via `.env` and declared in `.env.example`:

```ini
# Host Port Mappings
FRONTEND_PORT=3000
BACKEND_PORT=8000

# Environment Mode
ENVIRONMENT=development

# Application Title
APP_NAME="Mohamed Ali Maali | Portfolio API"

# Allowed CORS Origins
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:80,http://localhost
```

### Security Rule:
- **Never commit `.env` containing sensitive credentials to Git.**
- **Never hardcode secrets in `Dockerfile` or `docker-compose.yml`.**
- For production deployment on Azure, secrets will be injected at runtime via environment variables or secret managers (e.g. GitHub Secrets or Azure Key Vault).

---

## 🗺️ Future Production Deployment Blueprint (Azure VM)

This Docker setup has been crafted to serve as the direct foundation for your future Azure deployment without requiring architectural rewrites:

```text
Public Internet (Ports 80 / 443)
               │
               ▼
   [Azure VM Host Firewall (UFW)]
               │
               ▼
  [Host Nginx + Certbot (SSL/TLS)]  <-- To be added during VM deployment phase
       │                     │
       ▼                     ▼
Port 3000 (Frontend)   Port 8000 (Backend)
 (Docker Container)     (Docker Container)
```

When you are ready to deploy to Azure:
1. **Host Nginx & SSL**: Install Nginx on the Ubuntu host VM to terminate SSL (Let's Encrypt) and proxy incoming traffic from ports 80/443 to the Docker ports (`localhost:3000` and `localhost:8000`).
2. **UFW Firewall**: Block external public access to port 8000, allowing only ports `22` (SSH), `80` (HTTP), and `443` (HTTPS) externally.
3. **GitHub Actions**: Create a lightweight CI/CD pipeline that SSHs into the VM and runs `git pull && docker compose up --build -d`.
