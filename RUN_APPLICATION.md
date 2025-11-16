# 🚀 GET YOUR DOCKERIZED APP RUNNING - Step by Step

## Your Files Are Ready ✅

All the Docker files are already created in your project:

```
E:\Asset management system\
├── backend\Dockerfile          ✅
├── frontend\Dockerfile         ✅
├── docker-compose.yml          ✅
├── nginx.conf                  ✅
├── .env                        ✅
└── .dockerignore               ✅
```

## How to Run - 3 Simple Steps

### Step 1️⃣: Make Sure Docker Desktop is Running

**Windows Users:**
1. Open the **Start Menu** or press **Windows key**
2. Search for "Docker Desktop"
3. Click to launch it
4. Wait until you see "Docker is running" message or the whale icon is ready in taskbar

**Verify Docker is ready:**
```powershell
docker --version
docker-compose --version
```

### Step 2️⃣: Open PowerShell and Navigate to Your Project

```powershell
# Open PowerShell (Windows key + R, type powershell)
cd "E:\Asset management system"
```

### Step 3️⃣: Start Your Application

```powershell
# Start all services (backend + frontend + nginx)
docker-compose up -d
```

**What this does:**
- Builds your backend Docker image (Node.js)
- Builds your frontend Docker image (React + Nginx)
- Starts all 3 containers (nginx, backend, frontend)
- Sets up the database volume for data persistence
- Enables healthchecks for all services

**Wait 30 seconds** for services to fully start.

## 🎉 Your App is Now Running!

### Access Your Application:

**Open your browser and go to:**

| URL | What You Get |
|-----|--------------|
| http://localhost | 🌐 Frontend (Main App) |
| http://localhost:5173 | 🌐 Direct Frontend Access |
| http://localhost:5000 | 📡 Backend API |
| http://localhost/api | 📡 Backend via Nginx Proxy |

## 📊 Check Status

```powershell
# See all running containers
docker-compose ps
```

**Expected output:**
```
NAME          COMMAND                 SERVICE   STATUS
asset-nginx   "nginx -g ..."          nginx     Up (healthy)
asset-backend "node server.js"        backend   Up (healthy)
asset-frontend "nginx -g ..."         frontend  Up (healthy)
```

## 📋 View Application Logs

```powershell
# See all logs
docker-compose logs -f

# Or specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

Press `Ctrl+C` to stop viewing logs.

## ⏹️ Stop Your Application

```powershell
# Stop all services (keeps everything, can restart)
docker-compose stop

# Remove containers (data stays in volume)
docker-compose down

# Remove everything including data
docker-compose down -v
```

## 🧪 Test Your Application

### Test Backend is Working
```powershell
# From your PC
curl http://localhost:5000/assets

# From inside container
docker-compose exec backend curl http://localhost:5000/assets
```

### Run Backend Tests
```powershell
docker-compose exec backend npm test
```

### Check Coverage Report
```powershell
docker-compose exec backend npm run test:coverage
```

## 🔄 Restart Services

```powershell
# Restart everything
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart nginx
```

## 🔧 What Each Container Does

### 1. Nginx (Reverse Proxy)
- **Port**: 80
- **Purpose**: Routes traffic to frontend and backend
- **Routes**:
  - `/` → Frontend (port 5173)
  - `/api/*` → Backend (port 5000)
  - `/auth/*` → Backend (port 5000)
  - `/assets*` → Backend (port 5000)

### 2. Backend (Node.js API)
- **Port**: 5000 (internal)
- **Purpose**: Handles all API requests, authentication, asset management
- **Image**: node:18-alpine
- **Health**: Checked every 30 seconds
- **Restart**: Auto-restarts if crashes (max 5 times)

### 3. Frontend (React)
- **Port**: 5173 (internal)
- **Purpose**: React application served by Nginx
- **Image**: Built from React source → served by nginx:alpine
- **Health**: Checked every 30 seconds
- **Restart**: Auto-restarts if crashes (max 5 times)

### 4. Database (SQLite)
- **Volume**: `db_volume`
- **Purpose**: Stores application data persistently
- **Data survives**: Container restarts, removals
- **Clear data**: `docker-compose down -v`

## 📱 Development Workflow

### Edit Code and See Changes

Since Dockerfiles contain your built application, to see code changes:

```powershell
# Option 1: Rebuild and restart
docker-compose build --no-cache
docker-compose restart

# Option 2: Remove and rebuild
docker-compose down
docker-compose up -d
```

### Run Tests During Development

```powershell
# Run all backend tests
docker-compose exec backend npm test

# Run tests in watch mode
docker-compose exec backend npm run test:watch

# Generate coverage report
docker-compose exec backend npm run test:coverage
```

## 🆘 Troubleshooting

### Issue: "Docker is not running"
**Solution:** Start Docker Desktop

### Issue: "Port 80 already in use"
**Solution:**
```powershell
# Check what's using port 80
netstat -ano | findstr :80

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Issue: Containers won't start
**Solution:**
```powershell
# Check logs for errors
docker-compose logs

# Rebuild
docker-compose build --no-cache

# Start again
docker-compose up -d
```

### Issue: Can't access http://localhost
**Solution:**
```powershell
# Check if nginx is running
docker-compose ps nginx

# Check nginx logs
docker-compose logs nginx

# Test nginx from inside container
docker-compose exec nginx wget --quiet --tries=1 --spider http://localhost:80/
```

### Issue: API returns errors
**Solution:**
```powershell
# Check backend logs
docker-compose logs backend

# Test backend directly
docker-compose exec backend curl http://localhost:5000/assets

# Run tests
docker-compose exec backend npm test
```

### Issue: Frontend shows blank page
**Solution:**
```powershell
# Check frontend logs
docker-compose logs frontend

# Check if frontend container is healthy
docker-compose ps frontend

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose restart frontend
```

## 🔐 Security Notes

1. **Change JWT Secret**: Edit `.env` file
   ```
   JWT_SECRET=your_secure_secret_key_here
   ```

2. **Don't commit sensitive data**:
   ```powershell
   # .env is in .gitignore by default
   git status  # Verify .env is not listed
   ```

3. **Use environment variables**: Always use `.env` for secrets

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Defines all services and how they connect |
| `backend/Dockerfile` | Instructions to build backend image |
| `frontend/Dockerfile` | Instructions to build frontend image |
| `nginx.conf` | Nginx reverse proxy configuration |
| `.env` | Environment variables (secrets, configuration) |
| `.dockerignore` | Files excluded from Docker build |
| `DOCKER_SETUP.md` | Detailed Docker documentation |
| `QUICK_START.md` | Quick reference guide |

## ✅ Verify Everything Works

Run this checklist:

```powershell
# 1. Docker running?
docker --version

# 2. All services started?
docker-compose ps
# Should show: nginx (up), backend (up), frontend (up)

# 3. Can access frontend?
# Open browser: http://localhost

# 4. Can access API?
curl http://localhost:5000/assets

# 5. All healthy?
docker-compose ps
# STATUS should show "Up (healthy)" for all
```

---

## 🎯 You're All Set! 

Your dockerized application is ready to use. Start it with:

```powershell
cd "E:\Asset management system"
docker-compose up -d
```

Then open http://localhost in your browser. 🚀

---

**Need help?** Check `DOCKER_SETUP.md` for advanced topics or `QUICK_START.md` for quick reference.
