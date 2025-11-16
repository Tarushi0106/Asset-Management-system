# Asset Management System

A full-stack application for managing assets with real-time monitoring, automated process management, and comprehensive logging. Built with Node.js/Express backend, React/Vite frontend, containerized with Docker, and monitored with Prometheus/Grafana.

**Status**: ✅ Production-Ready with Full DevOps Stack

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Folder Structure](#folder-structure)
3. [Setup Instructions](#setup-instructions)
4. [Testing](#testing)
5. [Monitoring](#monitoring)
6. [Automation](#automation)
7. [API Documentation](#api-documentation)
8. [Known Issues & Improvements](#known-issues--improvements)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ASSET MANAGEMENT SYSTEM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            CLIENT LAYER (Port 80)                       │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │     Nginx Reverse Proxy (Alpine Container)      │    │   │
│  │  │  - Static File Serving                          │    │   │
│  │  │  - Request Routing & Load Balancing             │    │   │
│  │  │  - SSL/TLS Termination (optional)               │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └────────────┬────────────────────────────┬────────────────┘   │
│               │                            │                    │
│               ▼                            ▼                    │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │  FRONTEND (Port 80)  │    │  BACKEND (Port 5000) │          │
│  │  ┌────────────────┐  │    │  ┌────────────────┐  │          │
│  │  │ React 18       │  │    │  │ Node.js 18     │  │          │
│  │  │ Vite Build     │  │    │  │ Express.js     │  │          │
│  │  │ (Alpine)       │  │    │  │ SQLite3        │  │          │
│  │  └────────────────┘  │    │  └────────────────┘  │          │
│  └──────────────────────┘    └──────────────────────┘          │
│           │                            │                        │
└───────────┼────────────────────────────┼────────────────────────┘
            │                            │
            │   ┌──────────────────────┐ │
            └──▶│   SQLite Database    │◀┘
                │  (Persistent Volume) │
                └──────────────────────┘
            
    ┌─────────────────────────────────────────────────────┐
    │         MONITORING STACK (Optional Docker)          │
    ├─────────────────────────────────────────────────────┤
    │                                                     │
    │  Prometheus (Port 9090)  ◀────  Node Exporter     │
    │     ▲                           cAdvisor            │
    │     │                                               │
    │     └──────────────────┬────────────────────────    │
    │                        │                            │
    │              Grafana (Port 3001)                   │
    │       - Health Dashboards                          │
    │       - Alert Management                           │
    │       - Metrics Visualization                      │
    │                                                     │
    └─────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────┐
    │    PROCESS MANAGEMENT (PM2 on Host)                │
    ├─────────────────────────────────────────────────────┤
    │                                                     │
    │  PM2 Daemon                                         │
    │  ├─ Backend Service (Node.js)                       │
    │  │  └─ Auto-restart on crash/memory threshold      │
    │  └─ Frontend Dev Server (npm run dev)              │
    │     └─ Hot reload on file changes                  │
    │                                                     │
    │  Logs: logs/ directory                             │
    │  Config: ecosystem.config.js                       │
    │                                                     │
    └─────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 18 | UI Components & State Management |
| **Build Tool** | Vite | Latest | Fast build & HMR |
| **Backend** | Node.js | 18 | API Server |
| **Framework** | Express.js | Latest | HTTP Server |
| **Database** | SQLite3 | Latest | Asset Data Storage |
| **Containerization** | Docker | Latest | Environment Isolation |
| **Orchestration** | Docker Compose | v2 | Multi-service Management |
| **Monitoring** | Prometheus | Latest | Metrics Collection |
| **Visualization** | Grafana | Latest | Dashboard & Alerts |
| **Process Manager** | PM2 | Latest | Auto-restart & Logs |
| **Reverse Proxy** | Nginx | Alpine | Request Routing |

---

## Folder Structure

```
Asset-Management-system/
│
├── backend/                          # Backend Node.js Application
│   ├── server.js                     # Express server entry point
│   ├── package.json                  # Backend dependencies
│   ├── Dockerfile                    # Backend Docker image (Debian)
│   │
│   ├── routes/                       # API route handlers
│   │   ├── assets.js                 # Asset CRUD endpoints
│   │   ├── auth.js                   # Authentication endpoints
│   │   └── users.js                  # User management
│   │
│   ├── tests/                        # Test suites
│   │   ├── asset.test.js             # Asset endpoints tests
│   │   ├── auth.test.js              # Auth endpoints tests
│   │   ├── integration.test.js       # Full integration tests
│   │   └── jest.config.js            # Jest configuration
│   │
│   ├── coverage/                     # Test coverage reports
│   │   ├── lcov-report/              # HTML coverage visualization
│   │   ├── lcov.info                 # LCOV format
│   │   └── coverage-final.json       # JSON summary
│   │
│   └── node_modules/                 # Dependencies (gitignored)
│
├── frontend/                         # React Application
│   ├── src/                          # Source code
│   │   ├── main.jsx                  # React entry point
│   │   ├── App.jsx                   # Root component
│   │   ├── components/               # Reusable components
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # API client services
│   │   └── styles/                   # CSS/Tailwind styles
│   │
│   ├── dist/                         # Built output (generated)
│   ├── node_modules/                 # Dependencies (gitignored)
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite build configuration
│   ├── Dockerfile                    # Frontend Docker image (Alpine)
│   └── nginx.conf                    # Nginx server configuration
│
├── docker-compose.yml                # Multi-container orchestration
│                                      # Services:
│                                      #  - backend (Node.js)
│                                      #  - frontend (Nginx)
│                                      #  - nginx (Reverse Proxy)
│                                      #  - prometheus (Metrics)
│                                      #  - node-exporter (Host metrics)
│                                      #  - cadvisor (Container metrics)
│                                      #  - grafana (Dashboards)
│
├── ecosystem.config.js               # PM2 configuration
│                                      # - Backend service config
│                                      # - Frontend dev config
│                                      # - Auto-restart settings
│                                      # - Watch directories
│
├── prometheus/                       # Prometheus configuration
│   ├── prometheus.yml                # Scrape job definitions
│   └── rules.yml                     # Alert rule definitions
│
├── grafana/                          # Grafana configuration
│   ├── provisioning/                 # Auto-provisioning configs
│   │   ├── datasources/
│   │   │   └── datasource.yml        # Prometheus datasource setup
│   │   └── dashboards/
│   │       └── dashboard.yml         # Dashboard provisioning
│   │
│   └── dashboards/                   # Dashboard JSON definitions
│       ├── health-overview.json      # System health dashboard
│       └── node-exporter-host.json   # Host metrics dashboard
│
├── nginx/                            # Nginx configuration
│   └── nginx.conf                    # Reverse proxy setup
│
├── logs/                             # Application logs (runtime)
│   ├── backend-out-0.log             # Backend stdout
│   ├── backend-error-0.log           # Backend stderr
│   ├── frontend-out-1.log            # Frontend stdout
│   └── frontend-error-1.log          # Frontend stderr
│
├── pm2-start.ps1                     # PowerShell: Start PM2
├── pm2-stop.ps1                      # PowerShell: Stop PM2
├── pm2-restart.ps1                   # PowerShell: Restart PM2
├── pm2-monitor.ps1                   # PowerShell: Monitor PM2
│
├── README.md                         # Project overview
├── PM2.md                            # PM2 documentation
├── MONITORING.md                     # Monitoring stack guide
│
├── .gitignore                        # Git ignore patterns
├── package.json                      # Root workspace (if monorepo)
└── LICENSE                           # Project license

```

### Key Files Description

| File | Purpose |
|------|---------|
| `backend/server.js` | Express app initialization, middleware setup, routes |
| `frontend/src/main.jsx` | React app entry point with Vite |
| `docker-compose.yml` | Defines all 9 services, networks, volumes |
| `ecosystem.config.js` | PM2 process definitions with auto-restart config |
| `prometheus/prometheus.yml` | Metrics scrape targets and intervals |
| `grafana/provisioning/*` | Auto-provisions datasources and dashboards |
| `nginx/nginx.conf` | Reverse proxy routing rules |

---

## Setup Instructions

### Prerequisites

- **Windows 10+** with Windows Subsystem for Linux 2 (WSL2) enabled
- **Docker Desktop** (latest version with Docker Compose v2)
- **Node.js 18+** (for PM2 on host)
- **PowerShell 5.1+** (Windows)
- **Git**

### Option 1: Host Development (PM2 Mode)

Best for local development with hot reload.

#### 1. Clone Repository

```bash
git clone https://github.com/Tarushi0106/Asset-Management-system.git
cd Asset-Management-system
```

#### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

cd ..
```

#### 3. Install PM2 Globally

```bash
npm install -g pm2
```

#### 4. Start Services

```powershell
# Option A: Using startup script (recommended)
.\pm2-start.ps1

# Option B: Manual start
pm2 start ecosystem.config.js --update-env
```

#### 5. Verify Services

```bash
pm2 status
pm2 logs --lines 10 --nostream
```

**Access Points:**
- Frontend: `http://localhost:5173` (dev server with HMR)
- Backend API: `http://localhost:5000`

---

### Option 2: Docker Containers (Production)

Best for production-like environment with full monitoring stack.

#### 1. Clone Repository

```bash
git clone https://github.com/Tarushi0106/Asset-Management-system.git
cd Asset-Management-system
```

#### 2. Build and Start Services

```bash
# Build images and start all services
docker compose up -d

# Verify services are running
docker compose ps
```

#### 3. Wait for Startup

Services take 10-15 seconds to fully initialize. Check logs:

```bash
docker compose logs -f
```

#### 4. Verify Services

```bash
# Check all container status
docker compose ps

# View backend logs
docker compose logs backend

# View frontend logs
docker compose logs frontend
```

**Access Points:**
- **Frontend**: `http://localhost:80`
- **Backend API**: `http://localhost:5000` (via Nginx reverse proxy)
- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3001` (default login: admin/admin)

---

### Option 3: Hybrid Setup (PM2 + Docker Monitoring)

Run applications via PM2, monitoring stack via Docker.

```bash
# Start monitoring stack only (exclude backend/frontend)
docker compose up -d prometheus node-exporter cadvisor grafana

# Start PM2 services
pm2 start ecosystem.config.js --update-env

# Verify both
pm2 status
docker compose ps
```

---

## Testing

### Unit Tests

Backend includes comprehensive test suites using Jest.

#### Run All Tests

```bash
cd backend
npm test
```

#### Run Specific Test Suite

```bash
# Asset endpoints
npm test asset.test.js

# Authentication
npm test auth.test.js

# Integration tests
npm test integration.test.js
```

#### View Coverage Report

```bash
# Generate coverage report
npm test -- --coverage

# View HTML report
start coverage/lcov-report/index.html  # Windows
open coverage/lcov-report/index.html   # macOS
```

### Manual API Testing

#### Health Check

```bash
curl -X GET http://localhost:5000/
# Response: {"status":"Server is running","version":"1.0.0"}
```

**Backend Server Running:**
![Backend Health Check](https://raw.githubusercontent.com/Tarushi0106/Asset-Management-system/main/docs/backend-health.png)

#### Authentication Endpoint

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"password"}'
```

#### Asset Endpoints

```bash
# Create asset
curl -X POST http://localhost:5000/assets/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","status":"active"}'

# Get all assets
curl -X GET http://localhost:5000/assets/

# Get asset by ID
curl -X GET http://localhost:5000/assets/1

# Update asset
curl -X PUT http://localhost:5000/assets/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"inactive"}'

# Delete asset
curl -X DELETE http://localhost:5000/assets/1
```

### Frontend Testing

```bash
# In frontend directory
npm run dev

# Open browser to http://localhost:5173
# Test UI components and interactions
```

**Frontend Asset Manager Application:**
![Frontend Asset Manager](https://raw.githubusercontent.com/Tarushi0106/Asset-Management-system/main/docs/frontend-app.png)

**Frontend Login Interface:**
![Frontend Login](https://raw.githubusercontent.com/Tarushi0106/Asset-Management-system/main/docs/frontend-login.png)

---

## Monitoring

### PM2 Process Monitoring

#### Real-Time Dashboard

```powershell
# Launch interactive monitoring
.\pm2-monitor.ps1

# Or manually:
pm2 monit
```

**PM2 Monitoring in VS Code Terminal:**
![PM2 Logs and Status](https://raw.githubusercontent.com/Tarushi0106/Asset-Management-system/main/docs/pm2-logs.png)

#### Check Process Status

```bash
# Quick status
pm2 status

# Detailed information
pm2 describe asset-backend
pm2 describe asset-frontend-dev

# View logs in real-time
pm2 logs

# Tail last N lines
pm2 logs --lines 50 --nostream
```

---

### Docker Monitoring Stack

When using Docker, a complete monitoring solution is included:

#### Prometheus

**URL**: `http://localhost:9090`

Metrics collection from:
- Node Exporter (host system metrics)
- cAdvisor (container metrics)
- Prometheus itself

**Key Metrics:**
```promql
# Container CPU usage
container_cpu_usage_seconds_total

# Container memory usage
container_memory_usage_bytes

# Node system CPU
node_cpu_seconds_total

# Node disk space
node_filesystem_avail_bytes
```

#### Grafana

**URL**: `http://localhost:3001`  
**Login**: admin / admin

**Grafana Login Interface:**
![Grafana Login](https://raw.githubusercontent.com/Tarushi0106/Asset-Management-system/main/docs/grafana-login.png)

**Pre-configured Dashboards:**

1. **Health Overview Dashboard**
   - Target status (up/down)
   - Service availability
   - Real-time alerts

![Health Overview Dashboard](https://raw.githubusercontent.com/Tarushi0106/Asset-Management-system/main/docs/grafana-health-overview.png)

2. **Node Exporter Host Metrics Dashboard**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network traffic

![Node Exporter Metrics Dashboard](https://raw.githubusercontent.com/Tarushi0106/Asset-Management-system/main/docs/grafana-node-exporter.png)

#### Alert Management

Prometheus includes alerting rules defined in `prometheus/rules.yml`:

- **InstanceDown**: Target unreachable for >1 minute
- **HighDockerRestartRate**: Container restarting frequently

View active alerts at: `http://localhost:9090/alerts`

**Prometheus Alerts Dashboard:**
![Prometheus Alerts](https://raw.githubusercontent.com/Tarushi0106/Asset-Management-system/main/docs/prometheus-alerts.png)

---

### Application Logs

#### PM2 Logs

Located in `logs/` directory:

```bash
# View backend logs
tail -f logs/backend-out-0.log        # stdout
tail -f logs/backend-error-0.log      # stderr
tail -f logs/backend-combined-0.log   # both

# View frontend logs
tail -f frontend/logs/frontend-out-1.log
```

#### Docker Logs

```bash
# View real-time logs
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f prometheus

# View last N lines
docker compose logs --tail=50 backend
```

---

## Automation

### PM2 Auto-Restart

PM2 automatically restarts processes in these scenarios:

#### 1. Process Crash

When a process exits unexpectedly:
- Waits `restart_delay` (4 seconds)
- Restarts process
- Increments restart counter

#### 2. Memory Threshold

When process exceeds memory limit:
- **Backend**: 500MB threshold
- **Frontend**: 300MB threshold
- Auto-restarts and logs memory violation

#### 3. File Changes (Watch Mode)

When files change in watched directories:
- **Backend**: Watches `backend/` directory
- Restarts to apply changes
- Useful for development

#### 4. System Startup (Optional)

Set up automatic startup on system boot:

```bash
# Windows
pm2 startup windows

# Follow the command output to enable startup
pm2 save
```

---

### Docker Auto-Restart

Container restart policies defined in `docker-compose.yml`:

```yaml
restart_policy:
  condition: on-failure
  max_retries: 5
  delay: 10s
```

Services automatically restart if they fail (max 5 times with 10s delay).

---

### Monitoring Automation

**Prometheus** continuously:
- Scrapes metrics every 15 seconds
- Evaluates alert rules every 15 seconds
- Sends alerts to configured handlers

**Grafana** automatically:
- Displays metrics in dashboards
- Evaluates alert conditions
- Notifies based on alert rules

---

### Log Rotation

PM2 automatically manages logs:
- Stores to `logs/` directory
- Separate stdout/stderr logs
- Manual rotation with: `pm2 flush`

Docker volumes:
- Persistent storage in named volumes
- Logs available via `docker compose logs`

---

## API Documentation

### Base URL

- **Development**: `http://localhost:5000`
- **Production**: `http://localhost/api` (via Nginx proxy)

### Health Check

```http
GET /
```

**Response:**
```json
{
  "status": "Server is running",
  "version": "1.0.0"
}
```

---

### Authentication

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "username",
    "email": "user@example.com"
  }
}
```

---

### Assets

#### Get All Assets

```http
GET /assets/
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "status": "active",
    "createdAt": "2025-11-16T12:00:00Z"
  }
]
```

#### Get Asset by ID

```http
GET /assets/:id
Authorization: Bearer <token>
```

#### Create Asset

```http
POST /assets/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "status": "active|inactive|maintenance"
}
```

#### Update Asset

```http
PUT /assets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "status": "string"
}
```

#### Delete Asset

```http
DELETE /assets/:id
Authorization: Bearer <token>
```

**Response:** 204 No Content

---

## Known Issues & Improvements

### Known Issues

#### 1. ⚠️ Port Conflict on Windows

**Issue**: If port 5000 is in use, backend fails to start.

**Solution**:
```bash
# Find process using port 5000 (Windows)
netstat -ano | findstr :5000

# Change port in ecosystem.config.js
# Update PORT in env section
```

#### 2. ⚠️ SQLite Lock Errors

**Issue**: "database is locked" when running tests parallel.

**Solution**:
```bash
# Run tests sequentially
npm test -- --runInBand

# Or close other connections
pm2 stop asset-backend
npm test
pm2 start ecosystem.config.js
```

#### 3. ⚠️ Docker on Windows WSL2

**Issue**: Slow file sync, native module compilation issues.

**Workaround**:
- Use Bind mount for source code (already configured)
- Run PM2 on host instead of Docker for development
- Rebuild containers with `docker compose build --no-cache`

#### 4. ⚠️ Grafana Default Password

**Issue**: Default Grafana admin password (admin/admin) is well-known.

**Solution**:
Change immediately on first login:
```
Admin Panel → Settings → Users → admin → Change password
```

#### 5. ⚠️ Frontend Dev Server Restart

**Issue**: Frontend dev server crashes if HMR port (5173) is busy.

**Solution**:
```bash
# Check port usage
netstat -ano | findstr :5173

# Kill process or change port in vite.config.js
```

---

### Planned Improvements

#### Authentication & Security
- [ ] Implement JWT token refresh mechanism
- [ ] Add role-based access control (RBAC)
- [ ] Implement rate limiting
- [ ] Add API key authentication
- [ ] Enable HTTPS/TLS in Nginx

#### Monitoring & Observability
- [ ] Add distributed tracing (Jaeger)
- [ ] Implement application logging aggregation (ELK stack)
- [ ] Add custom business metrics
- [ ] Implement request profiling

#### Performance & Scalability
- [ ] Implement database connection pooling
- [ ] Add Redis caching layer
- [ ] Enable database indexing
- [ ] Implement API pagination
- [ ] Add response compression

#### Frontend Enhancements
- [ ] Add end-to-end tests (Cypress/Playwright)
- [ ] Implement lazy loading
- [ ] Add error boundary components
- [ ] Implement PWA features
- [ ] Add dark mode support

#### Infrastructure
- [ ] Kubernetes deployment manifests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated backups
- [ ] Database migration system
- [ ] Environment-based configuration

#### Testing
- [ ] Increase unit test coverage to 90%+
- [ ] Add API contract testing
- [ ] Add load testing scenarios
- [ ] Add security scanning

---

## Troubleshooting

### Services Not Starting

#### Check Docker Status

```bash
# Verify Docker is running
docker --version

# Check service status
docker compose ps

# View startup logs
docker compose logs --tail=100
```

#### Check PM2 Status

```bash
# Verify PM2 is running
pm2 status

# Check specific process
pm2 describe asset-backend

# View error logs
pm2 logs --lines 100 --nostream
```

---

### Port Already in Use

```bash
# Find process using port (Windows)
netstat -ano | findstr :5000

# Find process using port (Linux/macOS)
lsof -i :5000

# Kill process
taskkill /PID <process_id> /F    # Windows
kill -9 <process_id>             # Linux/macOS
```

---

### Database Issues

```bash
# Check if database file exists
ls -la backend/database.sqlite

# Reset database (removes all data)
rm backend/database.sqlite

# Restart services to recreate
pm2 restart asset-backend
```

---

### Memory Issues

```bash
# Monitor memory in real-time
pm2 monit

# Check memory usage
pm2 status | grep memory

# Profile heap
pm2 profile:mem 10
```

---

### Connection Issues Between Services

```bash
# Check Docker network
docker network ls
docker network inspect <network_name>

# Check service connectivity
docker exec <container> ping <service_name>

# Check port mappings
docker compose ps
```

---

### SSL/TLS Issues

```bash
# Generate self-signed cert (optional for local dev)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Update nginx.conf with SSL directives
# Uncomment SSL sections and point to cert files
```

---

## Support & Resources

- **GitHub Issues**: [Asset-Management-system Issues](https://github.com/Tarushi0106/Asset-Management-system/issues)
- **PM2 Docs**: [pm2.io](https://pm2.keymetrics.io/)
- **Docker Docs**: [docs.docker.com](https://docs.docker.com/)
- **Prometheus Docs**: [prometheus.io](https://prometheus.io/)
- **Grafana Docs**: [grafana.com/docs](https://grafana.com/docs/)

---

## License

This project is licensed under the MIT License - see LICENSE file for details.

---

## Contributors

- **Tarushi Chaudhary** - Initial development and full-stack implementation

---

**Last Updated**: November 16, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
