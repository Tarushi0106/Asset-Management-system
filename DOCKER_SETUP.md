# Asset Management System - Docker Setup

## Project Structure

```
Asset Management System/
├── backend/
│   ├── Dockerfile          # Backend Node.js image
│   ├── server.js
│   ├── package.json
│   └── tests/
├── frontend/
│   ├── Dockerfile          # Frontend React+Vite image
│   ├── package.json
│   ├── index.html
│   └── src/
├── docker-compose.yml      # Orchestration file
├── nginx.conf              # Reverse proxy configuration
├── .env                    # Environment variables
└── .dockerignore           # Docker build ignore patterns
```

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Docker Desktop (Windows) or Docker CLI (Linux)

## Quick Start

### 1. Start All Services

```bash
docker-compose up -d
```

This will:
- Build the backend image (Node.js + Express)
- Build the frontend image (React + Vite + Nginx)
- Start nginx reverse proxy on port 80
- Setup volume for persistent database storage
- Run all healthchecks

### 2. Access the Application

- **Frontend**: http://localhost (via nginx)
- **Backend API**: http://localhost/api or http://localhost:5000
- **Direct Frontend**: http://localhost:5173 (if needed)

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

## Service Details

### Backend Service (asset-backend)
- **Port**: 5000
- **Image**: Node.js 18-alpine
- **Restart Policy**: on-failure:5 (restart max 5 times)
- **Healthcheck**: HTTP GET to /assets endpoint every 30s
- **Volumes**: db_volume mounted at /app/db
- **Environment**:
  - `PORT=5000`
  - `JWT_SECRET` (configurable via .env)
  - `NODE_ENV=production`

**Key Features**:
- Multi-stage build for optimization
- Curl-based healthcheck
- Graceful restart on failure
- Shared network with other services

### Frontend Service (asset-frontend)
- **Port**: 5173
- **Image**: Node.js 18-alpine (build) → Nginx Alpine (runtime)
- **Restart Policy**: on-failure:5
- **Healthcheck**: Wget-based HTTP check every 30s
- **Environment**: `VITE_API_URL=http://localhost:5000`

**Key Features**:
- Multi-stage build: Node.js builder → Nginx runtime
- Optimized production bundle
- Nginx serves static files efficiently
- Automatic restart on crashes

### Nginx Reverse Proxy (asset-nginx)
- **Port**: 80 (HTTP), 443 (HTTPS ready)
- **Image**: Nginx Alpine
- **Restart Policy**: on-failure:5
- **Healthcheck**: Wget check every 30s

**Routing**:
- `/` → Frontend (http://frontend:5173)
- `/api/` → Backend (http://backend:5000)
- `/auth/` → Backend auth (http://backend:5000/auth)
- `/assets` → Backend assets (http://backend:5000/assets)

## Environment Configuration

Edit `.env` to customize:

```env
# Backend
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=production

# Frontend
VITE_API_URL=http://localhost:5000

# Docker
COMPOSE_PROJECT_NAME=asset-management-system
```

## Docker Operations

### Build Images

```bash
# Build without cache
docker-compose build --no-cache

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Stop Services

```bash
# Stop all services (keeps containers)
docker-compose stop

# Remove all containers
docker-compose down

# Remove everything including volumes
docker-compose down -v
```

### View Container Status

```bash
# List running containers
docker-compose ps

# Inspect specific container
docker-compose ps backend
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Run backend tests
docker-compose exec backend npm test

# Run backend coverage
docker-compose exec backend npm run test:coverage
```

### View Resource Usage

```bash
docker stats
```

## Health Checks

All services include automated healthchecks:

```bash
# Check backend health
docker-compose exec backend curl http://localhost:5000/assets

# Check frontend health
docker-compose exec frontend wget --quiet --tries=1 --spider http://localhost:5173/

# Check nginx health
docker-compose exec nginx wget --quiet --tries=1 --spider http://localhost:80/
```

## Volumes and Persistence

- **db_volume**: Persists application data between container restarts
  - Mounted at `/app/db` in backend container
  - Data survives container restarts

Clear volumes (data loss):
```bash
docker-compose down -v
```

## Network Configuration

All services communicate via `asset_network` bridge network:
- Backend: `backend:5000`
- Frontend: `frontend:5173`
- Nginx: `nginx:80`

This isolated network prevents external interference.

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Container Won't Start
```bash
# View logs
docker-compose logs backend

# Rebuild with verbose output
docker-compose build --no-cache backend

# Try starting in foreground to see errors
docker-compose up backend
```

### API Not Responding
```bash
# Test connectivity
docker-compose exec nginx curl http://backend:5000/assets
docker-compose exec backend curl http://localhost:5000/assets
```

### Database Issues
```bash
# Clear database and restart
docker-compose down -v
docker-compose up -d
```

## Production Deployment

For production, consider:

1. **Environment Security**:
   - Use proper JWT_SECRET (not the default)
   - Use Docker secrets or external secret management
   - Run `docker-compose config` to verify secrets not exposed

2. **HTTPS/SSL**:
   - Add SSL certificates to nginx
   - Use Let's Encrypt with certbot
   - Update nginx.conf with SSL directives

3. **Resource Limits**:
   - Add `deploy.resources` to docker-compose.yml
   - Set memory and CPU limits per service

4. **Logging**:
   - Configure log drivers (awslogs, splunk, etc.)
   - Set log rotation policies

5. **Registry**:
   - Push images to Docker Hub, ECR, or private registry
   - Use image tags for versioning

## Monitoring

Basic monitoring commands:

```bash
# Real-time resource usage
docker stats

# View all logs with timestamps
docker-compose logs --timestamps

# Follow specific service
docker-compose logs -f backend

# Filter logs
docker-compose logs backend | grep "error"
```

## Example Workflow

```bash
# 1. Clone and navigate
cd "E:\Asset management system"

# 2. Configure environment
nano .env  # or edit in IDE

# 3. Start services
docker-compose up -d

# 4. Verify all running
docker-compose ps

# 5. Check logs
docker-compose logs -f

# 6. Access application
# Open browser to http://localhost

# 7. Stop services
docker-compose down
```

## Support

For issues:
- Check logs: `docker-compose logs`
- Verify .env configuration
- Ensure ports are not in use
- Check Docker daemon is running
- Verify Docker compose version: `docker-compose --version`

---

**Last Updated**: November 15, 2025
**Version**: 1.0
