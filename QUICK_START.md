# 🐳 Your Dockerized Application - Quick Start

## Where is Your Application?

Your entire application is now containerized! Here's what you have:

```
E:\Asset management system\
├── backend/
│   ├── Dockerfile ✅ (Node.js backend container)
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── Dockerfile ✅ (React frontend container)
│   ├── package.json
│   └── src/
├── docker-compose.yml ✅ (Orchestration - runs all services)
├── nginx.conf ✅ (Reverse proxy configuration)
├── .env ✅ (Environment variables)
└── .dockerignore ✅ (Build optimization)
```

## ⚡ Start Your Application

### Step 1: Open PowerShell

```powershell
# Navigate to your project
cd "E:\Asset management system"
```

### Step 2: Start Docker Desktop (Windows)

1. Open **Docker Desktop** application on your system
2. Wait for it to fully load (you'll see the whale icon in taskbar)
3. Once running, you'll see: "Docker is running"

### Step 3: Run Your Application

```powershell
# Start all services (backend, frontend, nginx)
docker-compose up -d

# Wait ~30 seconds for services to start and pass healthchecks
```

### Step 4: Access Your Application

🌐 **Open in your browser:**

- **Frontend (Main App)**: http://localhost
- **Direct Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API via Proxy**: http://localhost/api/assets

## 📊 Monitor Your Services

```powershell
# Check if all services are running
docker-compose ps

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend    # See backend logs
docker-compose logs -f frontend   # See frontend logs
docker-compose logs -f nginx      # See nginx logs
```

## 🛑 Stop Your Application

```powershell
# Stop all services (keeps data)
docker-compose stop

# Remove all containers (keeps volumes)
docker-compose down

# Remove everything including data
docker-compose down -v
```

## 🔧 How It Works

### Architecture
```
┌─────────────────────────────────────────┐
│          Your Application               │
├─────────────────────────────────────────┤
│                                         │
│  1. NGINX Reverse Proxy (Port 80)       │
│     ├─ Routes / → Frontend              │
│     └─ Routes /api → Backend            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  2. Frontend (React + Vite)             │
│     Port: 5173 (internal)               │
│     Served by: Nginx                    │
│                                         │
│  3. Backend (Node.js + Express)         │
│     Port: 5000 (internal)               │
│     Health: ✅ Monitored                │
│                                         │
│  4. Database Volume                     │
│     SQLite persists data                │
│                                         │
└─────────────────────────────────────────┘
```

### Services

| Service | Port | Status | Purpose |
|---------|------|--------|---------|
| **nginx** | 80 | ✅ Running | Reverse proxy, serves frontend |
| **backend** | 5000 | ✅ Running | API, business logic |
| **frontend** | 5173 | ✅ Running | React app interface |
| **db_volume** | - | ✅ Mounted | SQLite database |

## 💡 Common Commands

```powershell
# View all running containers
docker-compose ps

# View system resource usage
docker stats

# Execute command in container
docker-compose exec backend npm test       # Run backend tests
docker-compose exec backend sh             # Backend shell
docker-compose exec frontend sh            # Frontend shell

# View container logs with timestamps
docker-compose logs --timestamps

# Rebuild images (after code changes)
docker-compose build --no-cache

# Pull latest images
docker-compose pull
```

## 🔄 Restart Services

```powershell
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

## 🐛 Troubleshooting

### Services won't start
```powershell
# Check logs for errors
docker-compose logs

# Try rebuilding
docker-compose build --no-cache

# Start in foreground to see errors
docker-compose up
```

### Port already in use
```powershell
# Find process using port 80
netstat -ano | findstr :80

# Kill it (replace PID)
taskkill /PID <PID> /F

# Or use different port in docker-compose.yml
```

### Can't connect to backend
```powershell
# Test from frontend container
docker-compose exec frontend curl http://backend:5000/assets

# Test locally
docker-compose exec backend curl http://localhost:5000/assets
```

### Database issues
```powershell
# Clear database and restart
docker-compose down -v
docker-compose up -d
```

## 📝 Configuration

Your environment is set in `.env`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=production
VITE_API_URL=http://localhost:5000
```

Edit this file to change settings, then:
```powershell
docker-compose restart
```

## ✅ Verify Everything Works

```powershell
# 1. Check all services running
docker-compose ps

# 2. Check backend health
docker-compose exec backend curl http://localhost:5000/assets

# 3. Check frontend accessible
# Open browser: http://localhost

# 4. View logs
docker-compose logs
```

## 🎯 Next Steps

1. **Test the app**: Open http://localhost in your browser
2. **Run tests**: `docker-compose exec backend npm test`
3. **View logs**: `docker-compose logs -f`
4. **Make code changes**: Edit files, containers auto-restart
5. **Push to GitHub**: `git add . && git commit -m "..." && git push`

## 📚 More Details

See `DOCKER_SETUP.md` for comprehensive documentation including:
- Production deployment
- HTTPS/SSL setup
- Monitoring and logging
- Advanced Docker operations
- Security best practices

---

## Quick Reference

```powershell
# Start everything
docker-compose up -d

# View status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Restart services
docker-compose restart
```

**Your application is ready to run! 🚀**
