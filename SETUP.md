# Setup & Installation Guide

Complete step-by-step instructions for setting up the Asset Management System in different environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Steps](#detailed-setup-steps)
- [Verification Steps](#verification-steps)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Minimum Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Disk Space**: 5GB free space
- **Internet Connection**: For downloading dependencies

### Software Requirements

#### For Host Development (PM2)

```
✓ Node.js 18.x LTS or higher
✓ npm 8.x or higher (comes with Node.js)
✓ PM2 (installed globally)
✓ PowerShell 5.1+ (for Windows scripts)
✓ Git 2.30+
```

#### For Docker Development

```
✓ Docker Desktop 4.0+ (includes Docker Compose v2)
✓ WSL2 backend (Windows users)
✓ 4GB Docker memory allocation minimum
✓ 2 CPU cores minimum
```

### Verify Prerequisites

```bash
# Check Node.js
node --version  # Should be v18.x or higher
npm --version   # Should be 8.x or higher

# Check Docker
docker --version        # Should be 20.10+
docker compose version  # Should be v2.0+

# Check Git
git --version  # Should be 2.30+
```

---

## Quick Start

### 1-Minute Setup (PM2)

```bash
# Clone repository
git clone https://github.com/Tarushi0106/Asset-Management-system.git
cd Asset-Management-system

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..

# Install PM2 globally (if not already)
npm install -g pm2

# Start services
pm2 start ecosystem.config.js --update-env

# Verify
pm2 status
```

**Access**: 
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### 2-Minute Setup (Docker)

```bash
# Clone repository
git clone https://github.com/Tarushi0106/Asset-Management-system.git
cd Asset-Management-system

# Start all services
docker compose up -d

# Wait 10-15 seconds for startup
docker compose ps

# View logs
docker compose logs -f
```

**Access**:
- Frontend: http://localhost:80
- Backend: http://localhost:5000 (via Nginx)
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

---

## Detailed Setup Steps

### Setup Option A: PM2 (Development with Auto-Reload)

Recommended for local development with hot reload.

#### Step 1: Verify Prerequisites

```bash
node --version      # Output: v18.x.x or higher
npm --version       # Output: 8.x.x or higher
git --version       # Output: 2.30 or higher
```

**If any are missing:**
- Download Node.js from https://nodejs.org/
- Download Git from https://git-scm.com/
- Windows users ensure PowerShell 5.1+ is available

#### Step 2: Clone Repository

```bash
# Navigate to desired location
cd ~/projects  # or your preferred directory

# Clone the repository
git clone https://github.com/Tarushi0106/Asset-Management-system.git

# Navigate to project
cd Asset-Management-system
```

**Expected structure:**
```
Asset-Management-system/
├── backend/
├── frontend/
├── ecosystem.config.js
└── ... (other files)
```

#### Step 3: Install Backend Dependencies

```bash
# Navigate to backend
cd backend

# Install npm packages
npm install

# Expected output:
# added XXX packages, and audited XXX packages in Xs
# Look for any critical errors (warnings about deprecated packages are normal)

# Verify installation
npm list --depth=0
# Should list: express, sqlite3, jwt, cors, etc.

# Return to root
cd ..
```

#### Step 4: Install Frontend Dependencies

```bash
# Navigate to frontend
cd frontend

# Install npm packages
npm install

# Expected output:
# added XXX packages, and audited XXX packages in Xs

# Verify installation
npm list --depth=0
# Should list: react, vite, axios, react-router, etc.

# Return to root
cd ..
```

#### Step 5: Install PM2 Globally

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
# Output: X.X.X (any version 4.0+ is fine)

# PM2 is now available system-wide
which pm2  # Linux/macOS
where pm2  # Windows PowerShell
```

#### Step 6: Start Services with PM2

**Option A: Using PowerShell script (Recommended for Windows)**

```powershell
# Windows PowerShell
.\pm2-start.ps1

# Expected output:
# ✓ PM2 is installed
# Starting PM2 services from ecosystem.config.js...
# [PM2] App [asset-backend] launched
# [PM2] App [asset-frontend-dev] launched
```

**Option B: Manual PM2 start**

```bash
# Start all services from ecosystem config
pm2 start ecosystem.config.js --update-env

# Expected output:
# [PM2] Spawning PM2 daemon
# [PM2] PM2 Successfully daemonized
# [PM2] App [asset-backend] launched (1 instances)
# [PM2] App [asset-frontend-dev] launched (1 instances)
```

#### Step 7: Verify Services Running

```bash
# Check status
pm2 status

# Expected output:
# ┌─────────┬──────────────────┬────────┬────────┐
# │ id      │ name             │ status │ uptime │
# ├─────────┼──────────────────┼────────┼────────┤
# │ 0       │ asset-backend    │ online │ 1m     │
# │ 1       │ asset-frontend-  │ online │ 30s    │
# │         │ dev              │        │        │
# └─────────┴──────────────────┴────────┴────────┘

# Wait a few seconds for services to fully start
sleep 3

# Check logs
pm2 logs --lines 10 --nostream
# Should see "Server running on port 5000"
```

#### Step 8: Test Services

**Frontend Test:**
```bash
# Open browser
http://localhost:5173

# Should see:
# - React application loading
# - Asset Management System interface
# - No console errors
```

**Backend API Test:**
```bash
# Health check
curl http://localhost:5000/

# Expected response:
# {"status":"Server is running","version":"1.0.0"}
```

#### Step 9: Save PM2 Configuration

```bash
# Save current PM2 process list
pm2 save

# Expected output:
# [PM2] Saving current process list...
# [PM2] Successfully saved in C:\Users\...\pm2\dump.pm2

# This persists the process list for future restarts
```

**✅ Setup Complete!**

You now have:
- ✓ Backend API running on port 5000
- ✓ Frontend dev server on port 5173 with hot reload
- ✓ Database persisted to disk
- ✓ PM2 managing services with auto-restart

**Next**: Go to [Testing](#testing) section to verify everything works.

---

### Setup Option B: Docker (Production-Like Setup)

Recommended for deploying in a containerized environment.

#### Step 1: Verify Docker Installation

```bash
# Check Docker is installed and running
docker --version
# Output: Docker version 20.10.x or higher

docker compose version
# Output: Docker Compose version v2.x.x or higher

# Verify Docker is running (can access daemon)
docker ps
# Should list running containers (may be empty)
```

**If Docker is not installed:**
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- **Windows users**: Ensure WSL2 backend is selected during installation
- Start Docker Desktop application

#### Step 2: Clone Repository

```bash
# Navigate to desired location
cd ~/projects

# Clone repository
git clone https://github.com/Tarushi0106/Asset-Management-system.git

# Navigate to project
cd Asset-Management-system

# List files to verify
ls -la
# Should show: docker-compose.yml, backend/, frontend/, etc.
```

#### Step 3: Build Docker Images

```bash
# Navigate to project root if not already there
cd Asset-Management-system

# Build and pull all images
docker compose build

# Expected output:
# [+] Building 15.3s (XX/XX)
# ...
# Successfully built backend_image
# Successfully built frontend_image
# etc.

# Note: This may take 2-5 minutes on first run
```

#### Step 4: Start Docker Services

```bash
# Start all services in background
docker compose up -d

# Expected output:
# [+] Running 8/8
#  ✔ Container asset-frontend       Started  2.3s
#  ✔ Container asset-backend        Started  2.5s
#  ✔ Container asset-nginx          Started  2.6s
#  ✔ Container prometheus           Started  2.7s
#  ✔ Container node-exporter        Started  2.8s
#  ✔ Container grafana              Started  2.9s
#  ✔ Container cadvisor             Started  3.0s
```

#### Step 5: Wait for Startup

```bash
# Docker services need 10-15 seconds to fully initialize
echo "Waiting for services to start..."
sleep 15

# Check all containers are running
docker compose ps

# Expected output:
# NAME                COMMAND             STATUS        PORTS
# asset-backend       node server.js      Up 10s        5000->5000/tcp
# asset-frontend      nginx               Up 10s        80->80/tcp
# asset-nginx         nginx               Up 10s        80->80/tcp
# prometheus          prometheus          Up 10s        9090->9090/tcp
# grafana             grafana-server      Up 10s        3001->3001/tcp
# node-exporter       /bin/node_exporter  Up 10s        9100->9100/tcp
# cadvisor            /usr/bin/cadvisor   Up 10s        8080->8080/tcp
```

#### Step 6: Verify Services

```bash
# Check service logs
docker compose logs backend --tail=20

# Expected to see:
# Server running on port 5000
# Database initialized
# No critical errors

# Check frontend
docker compose logs frontend --tail=20
# Should not show errors

# Check Prometheus
docker compose logs prometheus --tail=20
# Should show "Server started on..."
```

#### Step 7: Test Services

**Frontend Test:**
```bash
# Open browser
http://localhost:80

# OR
http://localhost

# Should see:
# - React application interface
# - No loading errors
# - Network requests going to backend
```

**Backend API Test:**
```bash
# Health check (via Nginx proxy)
curl http://localhost/api/

# OR direct to backend
curl http://localhost:5000/

# Expected response:
# {"status":"Server is running","version":"1.0.0"}
```

**Prometheus Metrics:**
```bash
# Open browser
http://localhost:9090

# Should see:
# - Prometheus UI
# - Graph tab available
# - Targets showing UP status
```

**Grafana Dashboards:**
```bash
# Open browser
http://localhost:3001

# Login with:
# Username: admin
# Password: admin

# Should see:
# - Home dashboard
# - Available dashboards:
#   - Health Overview
#   - Node Exporter Host
```

**✅ Docker Setup Complete!**

You now have:
- ✓ Backend API running in container on port 5000
- ✓ Frontend served in container on port 80
- ✓ Nginx reverse proxy routing requests
- ✓ Prometheus collecting metrics
- ✓ Grafana displaying dashboards
- ✓ Complete monitoring stack operational

**Next**: Go to [Verification Steps](#verification-steps).

---

### Setup Option C: Hybrid (PM2 + Docker Monitoring)

Combines PM2 for application development with Docker for monitoring stack.

#### Step 1: Complete PM2 Setup (Steps 1-6 from Option A)

Follow Steps 1-6 from "Setup Option A" to have PM2 services running.

#### Step 2: Start Docker Monitoring Only

```bash
# Start only monitoring services (exclude backend/frontend)
docker compose up -d prometheus node-exporter cadvisor grafana

# Expected output:
# [+] Running 4/4
#  ✔ Container prometheus       Started
#  ✔ Container node-exporter    Started
#  ✔ Container cadvisor         Started
#  ✔ Container grafana          Started
```

#### Step 3: Verify Both

```bash
# Check PM2 services
pm2 status

# Expected:
# ✓ asset-backend online
# ✓ asset-frontend-dev online

# Check Docker services
docker compose ps

# Expected:
# ✓ prometheus running
# ✓ node-exporter running
# ✓ cadvisor running
# ✓ grafana running
```

#### Step 4: Access Services

```bash
# Application:
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000

# Monitoring:
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin)
```

**✅ Hybrid Setup Complete!**

You now have:
- ✓ Applications managed by PM2 (with hot reload)
- ✓ Monitoring stack in Docker (independent)
- ✓ Best of both worlds for development

---

## Verification Steps

### All Setups: Core Functionality

#### 1. Backend Health Check

```bash
# Test endpoint
curl -X GET http://localhost:5000/

# Expected response:
# {
#   "status": "Server is running",
#   "version": "1.0.0"
# }

# Check status code
curl -X GET http://localhost:5000/ -w "\n%{http_code}\n"
# Should return: 200
```

#### 2. Frontend Accessibility

```bash
# Check if frontend is accessible
curl -X GET http://localhost:5173/

# Should return HTML content (React app)
# Status: 200
```

#### 3. Database Verification

```bash
# Check database file exists
ls -la backend/database.sqlite  # Linux/macOS
dir backend\database.sqlite     # Windows

# File should exist and have non-zero size
# Size should be > 1KB
```

#### 4. PM2 Process Verification

```bash
# List all PM2 processes
pm2 list

# Check restart counts
pm2 describe asset-backend | grep -E "(restarts|status)"
# Status should be: "online"
# Restarts should be: 0 (unless you've tested auto-restart)
```

### Docker Setup: Additional Checks

#### 5. Network Connectivity

```bash
# Test backend via Nginx
curl -X GET http://localhost/api/

# Test direct backend
curl -X GET http://localhost:5000/

# Both should return health check response
```

#### 6. Docker Logs

```bash
# Check backend container logs
docker compose logs backend | tail -20
# Should show: "Server running on port 5000"

# Check frontend container logs
docker compose logs frontend | tail -20
# Should not show critical errors

# Check Nginx logs
docker compose logs nginx | tail -20
# Should show successful proxying
```

#### 7. Monitoring Stack Verification

```bash
# Test Prometheus
curl http://localhost:9090/api/v1/query?query=up

# Response should be JSON with targets:
# {"status":"success","data":{"resultType":"vector","result":[...]}}

# Test Grafana API
curl http://localhost:3001/api/search

# Response should return available dashboards
```

#### 8. Volume Persistence

```bash
# Check Docker volumes
docker volume ls | grep asset

# Expected:
# asset-management-system_db_volume
# asset-management-system_grafana_data

# Verify volume mount
docker compose inspect backend | grep -A5 "Mounts"
# Should show: db_volume mounted to /data
```

---

## Troubleshooting

### Issue: Port Already in Use

**Symptoms**: 
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:

```bash
# Find process using port
netstat -ano | findstr :5000        # Windows
lsof -i :5000                        # macOS/Linux

# Kill the process
taskkill /PID <pid> /F              # Windows
kill -9 <pid>                        # macOS/Linux

# OR change port in ecosystem.config.js
# Update PORT environment variable
```

---

### Issue: Docker Build Fails

**Symptoms**:
```
ERROR: Service 'backend' failed to build
```

**Solution**:

```bash
# Clean and rebuild
docker compose down
docker system prune -a --volumes
docker compose build --no-cache

# Check build logs
docker compose build backend --verbose
```

---

### Issue: PM2 Services Won't Start

**Symptoms**:
```
[PM2] App [asset-backend] launched but with error status
```

**Solution**:

```bash
# Check logs
pm2 logs asset-backend --lines 100 --nostream

# Delete and restart
pm2 delete all
npm install -g pm2
pm2 start ecosystem.config.js --update-env

# Verify Node.js version
node --version  # Should be 18+
```

---

### Issue: Database Locked

**Symptoms**:
```
Error: database is locked
```

**Solution**:

```bash
# Stop all services
pm2 stop all
# OR
docker compose stop backend

# Delete database
rm backend/database.sqlite

# Restart services
pm2 start ecosystem.config.js
# OR
docker compose up -d

# This will recreate the database
```

---

### Issue: Frontend Not Loading

**Symptoms**:
```
Cannot GET /
ERR_CONNECTION_REFUSED
```

**Solution**:

```bash
# PM2: Check frontend service
pm2 logs asset-frontend-dev --lines 50 --nostream
# Look for "ready in Xs"

# Docker: Check frontend container
docker compose logs frontend
# Should show Nginx started

# Test directly
curl http://localhost:5173/  # PM2
curl http://localhost:80/    # Docker

# If still failing, rebuild
pm2 delete asset-frontend-dev
pm2 start ecosystem.config.js --update-env
# OR
docker compose up -d --no-cache frontend
```

---

### Issue: Grafana Won't Load

**Symptoms**:
```
http://localhost:3001 connection timeout
```

**Solution**:

```bash
# Check if container is running
docker ps | grep grafana
# If not listed, start it
docker compose up -d grafana

# Check logs
docker compose logs grafana | tail -20

# Wait for startup (30-60 seconds)
sleep 30
curl http://localhost:3001/

# If still failing, restart
docker compose restart grafana
```

---

### Issue: PM2 Services Crashing Repeatedly

**Symptoms**:
```
restart count: 15+ (very high)
status: stopped
```

**Solution**:

```bash
# Check logs for errors
pm2 logs asset-backend --lines 200 --nostream

# Common causes:
# 1. Missing dependencies
cd backend && npm install

# 2. Port conflict
netstat -ano | findstr :5000

# 3. Memory limit exceeded
pm2 monit  # Watch memory usage

# 4. File permissions (Linux)
chmod -R 755 logs/

# Restart service
pm2 restart asset-backend
```

---

### Issue: High Memory Usage

**Symptoms**:
```
Process restarting due to memory limit
```

**Solution**:

```bash
# Monitor memory in real-time
pm2 monit

# Profile heap memory
pm2 profile:mem 10

# Check for memory leaks
pm2 logs asset-backend | grep -i memory

# Increase memory limit in ecosystem.config.js
# Change: max_memory_restart: '500M' to '1G'

# Restart with new config
pm2 delete all
pm2 start ecosystem.config.js --update-env
```

---

## Verification Checklist

After setup, verify all of the following:

### PM2 Setup
- [ ] `pm2 status` shows both services as "online"
- [ ] `pm2 logs` shows "Server running on port 5000"
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend responds at http://localhost:5000
- [ ] Logs appear in `logs/` directory

### Docker Setup
- [ ] `docker compose ps` shows all containers running
- [ ] Frontend accessible at http://localhost:80
- [ ] Backend health check at http://localhost:5000/
- [ ] Prometheus at http://localhost:9090
- [ ] Grafana at http://localhost:3001 (login: admin/admin)

### Database
- [ ] `backend/database.sqlite` exists (PM2)
- [ ] Database file size > 1KB
- [ ] No database lock errors in logs
- [ ] Tables created successfully

### API Functionality
- [ ] Health check returns 200: `curl http://localhost:5000/`
- [ ] GET /assets works (may be empty initially)
- [ ] Can create asset via POST /assets
- [ ] Can read assets via GET /assets
- [ ] Can update asset via PUT /assets/:id
- [ ] Can delete asset via DELETE /assets/:id

### Monitoring (Docker only)
- [ ] Prometheus shows targets as "UP"
- [ ] Grafana dashboards load without errors
- [ ] Node Exporter metrics available
- [ ] cAdvisor container metrics available

**✅ If all items are checked, setup is successful!**

---

## Next Steps

After successful setup:

1. **Read Documentation**:
   - `README.md` - Project overview
   - `PM2.md` - PM2 process management
   - `MONITORING.md` - Monitoring stack guide
   - `ARCHITECTURE.md` - System architecture

2. **Test the Application**:
   - Navigate to frontend
   - Try creating, reading, updating, deleting assets
   - Check logs while interacting

3. **Set Up Monitoring**:
   - Access Grafana at http://localhost:3001
   - Import additional dashboards
   - Configure alert notifications

4. **Explore Auto-Restart** (PM2):
   - Kill a process: `pm2 kill asset-backend`
   - Watch it restart automatically
   - Check restart count increase

5. **Deploy to Production** (when ready):
   - Use Docker setup for production
   - Configure SSL/TLS in Nginx
   - Set up proper authentication
   - Enable persistent backups

---

**Setup complete! 🎉**

For additional help, see the [Troubleshooting](#troubleshooting) section or check the main [README.md](README.md).
