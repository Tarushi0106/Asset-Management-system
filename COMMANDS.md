# Copy-Paste Commands for Your Dockerized App

## 🚀 START YOUR APPLICATION

```powershell
cd "E:\Asset management system"
docker-compose up -d
```

**Wait 30 seconds**, then open: http://localhost

---

## 📊 CHECK STATUS

```powershell
docker-compose ps
```

All 3 services should show "Up (healthy)"

---

## 📋 VIEW LOGS

### All Logs
```powershell
docker-compose logs -f
```

### Backend Logs
```powershell
docker-compose logs -f backend
```

### Frontend Logs
```powershell
docker-compose logs -f frontend
```

### Nginx Logs
```powershell
docker-compose logs -f nginx
```

Press `Ctrl+C` to exit logs

---

## 🧪 RUN TESTS

```powershell
# All tests
docker-compose exec backend npm test

# Specific test file
docker-compose exec backend npm test -- tests/asset.test.js

# Watch mode
docker-compose exec backend npm run test:watch

# Coverage report
docker-compose exec backend npm run test:coverage
```

---

## 🔧 RESTART SERVICES

```powershell
# Restart all
docker-compose restart

# Restart backend only
docker-compose restart backend

# Restart frontend only
docker-compose restart frontend

# Restart nginx only
docker-compose restart nginx
```

---

## ⏹️ STOP APPLICATION

```powershell
# Stop (keeps data)
docker-compose stop

# Remove containers (keeps data)
docker-compose down

# Remove everything (delete data)
docker-compose down -v
```

---

## 🔄 REBUILD (After code changes)

```powershell
# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d
```

---

## 🧠 SHELL ACCESS

```powershell
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Nginx shell
docker-compose exec nginx sh
```

Type `exit` to leave shell

---

## 🧪 TEST CONNECTIVITY

```powershell
# Test backend from your PC
curl http://localhost:5000/assets

# Test backend from frontend container
docker-compose exec frontend curl http://backend:5000/assets

# Test frontend
curl http://localhost:5173

# Test nginx proxy
curl http://localhost/api/assets
```

---

## 📊 MONITOR RESOURCES

```powershell
docker stats
```

Shows CPU, memory, network usage for all containers

---

## 🐛 TROUBLESHOOT

```powershell
# See all errors
docker-compose logs

# Check specific service
docker-compose ps backend

# Detailed container info
docker-compose ps -a

# Remove stuck containers
docker-compose down -v
docker-compose up -d

# Force rebuild
docker-compose build --no-cache --pull
```

---

## 🔐 CONFIGURE

Edit `.env` file:

```powershell
# Edit in VS Code
code .env

# Or notepad
notepad .env
```

Then restart:
```powershell
docker-compose restart
```

---

## 📱 ACCESS POINTS

```
Frontend:     http://localhost
              http://localhost:5173

Backend:      http://localhost:5000
              http://localhost/api

API Endpoints:
  /auth/login     - http://localhost/auth/login
  /assets         - http://localhost/assets
  /assets/:id     - http://localhost/assets/1
```

---

## 💡 QUICK REFERENCE

| Action | Command |
|--------|---------|
| Start | `docker-compose up -d` |
| Stop | `docker-compose stop` |
| Restart | `docker-compose restart` |
| Logs | `docker-compose logs -f` |
| Tests | `docker-compose exec backend npm test` |
| Status | `docker-compose ps` |
| Shell | `docker-compose exec backend sh` |
| Cleanup | `docker-compose down -v` |
| Rebuild | `docker-compose build --no-cache` |

---

## 🎯 COMPLETE WORKFLOW

```powershell
# 1. Navigate to project
cd "E:\Asset management system"

# 2. Start application
docker-compose up -d

# 3. Wait 30 seconds, then check status
docker-compose ps

# 4. View logs
docker-compose logs -f

# 5. Open browser
# http://localhost

# 6. Run tests
docker-compose exec backend npm test

# 7. When done, stop
docker-compose stop
```

---

**All commands are ready to copy-paste! Just open PowerShell and run them.** ✅
