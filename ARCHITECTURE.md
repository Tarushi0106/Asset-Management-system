# Architecture Diagram

## Quick Reference

### System Overview

The Asset Management System uses a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│    CLIENT LAYER (Nginx Reverse Proxy)      │
│         Port 80 - Request Routing           │
└────────────┬────────────────────────────────┘
             │
    ┌────────┴────────┬──────────────────┐
    │                 │                  │
    ▼                 ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Frontend   │  │   Backend   │  │  Database   │
│   React 18  │  │  Express.js │  │   SQLite3   │
│  Port 80/   │  │  Port 5000  │  │   Volume    │
│   5173      │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘

     MONITORING STACK (Optional - Docker)
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  Prometheus  │ Node Exporter│   cAdvisor   │    Grafana   │
│   :9090      │    :9100     │    :8080     │   :3001      │
└──────────────┴──────────────┴──────────────┴──────────────┘

   PROCESS MANAGEMENT (PM2 on Host)
┌──────────────────────────────────────────────────────┐
│  PM2 Daemon: Backend Service + Frontend Dev Server  │
│  Auto-restart on crash/memory threshold/file change │
│  Logs: logs/ directory                              │
└──────────────────────────────────────────────────────┘
```

---

## Components

### 1. Frontend (React + Vite)

**Purpose**: User interface for asset management

**Technology Stack**:
- React 18 - Component framework
- Vite - Build tool & dev server
- Axios - HTTP client
- React Router - Client-side routing

**Characteristics**:
- Development: Runs on port 5173 with hot module replacement (HMR)
- Production: Built to `dist/` folder, served by Nginx on port 80
- No direct database access - all communication through backend API
- Responsive design supporting desktop and tablet

**Key Files**:
```
frontend/
├── src/
│   ├── main.jsx           # Entry point
│   ├── App.jsx            # Root component
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components
│   ├── services/          # API client functions
│   └── styles/            # CSS and Tailwind styles
├── dist/                  # Built output (generated)
├── vite.config.js         # Build configuration
└── Dockerfile             # Alpine-based container
```

---

### 2. Backend (Node.js + Express)

**Purpose**: REST API for asset management operations

**Technology Stack**:
- Node.js 18 - Runtime
- Express.js - Web framework
- SQLite3 - Database driver (includes native module)
- JWT - Authentication tokens
- CORS - Cross-origin requests

**Characteristics**:
- Single process (fork mode via PM2)
- Stateless design - can scale horizontally
- Health check endpoint at `GET /`
- Conditional startup (only listens if main module)

**Key Files**:
```
backend/
├── server.js              # Express app setup
├── routes/
│   ├── assets.js          # Asset CRUD endpoints
│   ├── auth.js            # Login/authentication
│   └── users.js           # User management
├── tests/                 # Jest test suites
├── coverage/              # Test coverage reports
├── package.json           # Dependencies
└── Dockerfile             # Debian bullseye-slim
```

**API Endpoints**:
- `GET /` - Health check
- `POST /auth/login` - Authentication
- `GET /assets` - List assets
- `POST /assets` - Create asset
- `GET /assets/:id` - Get asset
- `PUT /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset

---

### 3. Database (SQLite3)

**Purpose**: Persistent data storage

**Technology Stack**:
- SQLite3 - Embedded SQL database
- File-based storage in Docker volume

**Characteristics**:
- Zero configuration database
- Suitable for small-to-medium deployments
- Persistent volume in Docker (`db_volume`)
- Concurrent access handled with database locking

**Data Storage**:
- Asset records (id, name, status, timestamps)
- User accounts (id, username, password hash)
- Authentication tokens and sessions

**Persistent Volume**:
```yaml
# In docker-compose.yml
volumes:
  db_volume:
    driver: local
    
# Backend service
services:
  backend:
    volumes:
      - db_volume:/data  # Maps to /data/database.sqlite
```

---

### 4. Nginx Reverse Proxy

**Purpose**: Request routing and static file serving

**Technology Stack**:
- Nginx - High-performance reverse proxy
- Alpine Linux - Minimal base image

**Configuration**:
```nginx
# Listen on port 80
listen 80;

# Route static files to frontend
location / {
  proxy_pass http://frontend:80;
}

# Route API requests to backend
location /api/ {
  proxy_pass http://backend:5000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}

location /auth/ {
  proxy_pass http://backend:5000;
}

location /assets/ {
  proxy_pass http://backend:5000;
}
```

**Benefits**:
- Single entry point for clients
- Load balancing (if multiple backend instances)
- SSL/TLS termination capability
- Request header manipulation
- Caching and compression

---

### 5. Prometheus (Monitoring)

**Purpose**: Metrics collection and alert evaluation

**Technology Stack**:
- Prometheus - Time-series database
- Pull-based metrics scraping
- Rule evaluation engine

**Scrape Targets**:
- Node Exporter (host metrics) - port 9100
- cAdvisor (container metrics) - port 8080
- Prometheus self-metrics - port 9090

**Configuration** (`prometheus/prometheus.yml`):
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
  
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

rule_files:
  - 'rules.yml'
```

**Alert Rules** (`prometheus/rules.yml`):
- **InstanceDown**: Target unreachable for >1 minute
- **HighDockerRestartRate**: Container restarting frequently

---

### 6. Grafana (Visualization)

**Purpose**: Dashboard and alert management

**Technology Stack**:
- Grafana - Dashboard platform
- Prometheus datasource
- JSON-based dashboard definitions

**Pre-configured Dashboards**:

1. **Health Overview**
   - Target status (up/down indicator)
   - Service availability
   - Real-time alert display

2. **Node Exporter Host Metrics**
   - CPU usage (core-by-core)
   - Memory usage and swap
   - Disk usage by partition
   - Network I/O stats
   - System load average

**Alert Management**:
- View active/pending alerts
- Configure notification channels
- Set alert thresholds
- Silence alerts temporarily

**Auto-provisioning** (`grafana/provisioning/`):
```yaml
# datasources/datasource.yml - Auto-adds Prometheus
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    isDefault: true

# dashboards/dashboard.yml - Auto-loads JSON dashboards
apiVersion: 1
providers:
  - name: Dashboards
    folder: General
    type: file
    options:
      path: /var/lib/grafana/dashboards
```

---

### 7. Node Exporter (Host Metrics)

**Purpose**: Collect system-level metrics

**Metrics Exported**:
- CPU usage and temperature
- Memory and swap usage
- Disk space and I/O
- Network interfaces and traffic
- Process information
- System load and uptime

**Port**: 9090

**Used By**: Prometheus scraping

---

### 8. cAdvisor (Container Metrics)

**Purpose**: Collect container-level metrics

**Metrics Exported**:
- Container CPU usage
- Container memory usage
- Container network I/O
- Container filesystem usage
- Container restart count
- Container status

**Port**: 8080

**Used By**: Prometheus scraping, Grafana dashboards

---

### 9. PM2 (Process Manager)

**Purpose**: Auto-restart services on host

**Configuration** (`ecosystem.config.js`):
```javascript
{
  name: 'asset-backend',
  script: './backend/server.js',
  instances: 1,
  exec_mode: 'fork',
  env: { NODE_ENV: 'development', PORT: 5000 },
  max_memory_restart: '500M',
  restart_delay: 4000,
  max_restarts: 10,
  min_uptime: '10s',
  watch: ['backend'],
  error_file: './logs/backend-error.log',
  out_file: './logs/backend-out.log'
}
```

**Auto-Restart Triggers**:
1. Process crash - automatically restarts after 4s
2. Memory limit exceeded - 500MB for backend, 300MB for frontend
3. File changes (watch mode) - useful for development
4. System startup - optional via `pm2 startup`

**Management Commands**:
```bash
pm2 start ecosystem.config.js      # Start all services
pm2 status                         # View status
pm2 logs                          # View logs
pm2 monit                         # Real-time monitoring
pm2 restart all                   # Restart services
pm2 stop all                      # Stop services
pm2 save                          # Persist to dump file
pm2 startup                       # Enable on boot
```

---

## Data Flow

### User Request Flow (Development with PM2)

```
1. User opens browser
2. Request: http://localhost:5173
   └─> PM2 spawns Vite dev server
   └─> Serves frontend with HMR enabled
   └─> Frontend loads React components

3. Frontend loads
   └─> Client-side router handles navigation
   └─> API service client created

4. User clicks "Get Assets"
   └─> Frontend calls axios.get('/assets')
   └─> Request goes to PM2 backend (port 5000)
   └─> Backend API handler queries SQLite
   └─> Database returns asset records
   └─> Backend returns JSON to frontend
   └─> Frontend updates component state
   └─> React re-renders the UI

5. PM2 Monitoring
   └─> Watches backend/ directory for changes
   └─> Auto-restarts on file save (development)
   └─> Monitors memory usage
   └─> Auto-restarts if 500MB exceeded
   └─> Logs all output to logs/backend-out-0.log
```

### User Request Flow (Production with Docker)

```
1. User opens browser
   └─> Request: http://localhost (port 80)

2. Nginx Reverse Proxy (port 80)
   └─> Receives HTTP request
   └─> Routes static files to frontend container
   └─> Routes /api/* to backend container

3. Frontend Container (Nginx)
   └─> Serves built React dist/ files
   └─> Returns index.html for SPA routing

4. Backend Container (Node.js)
   └─> Receives request on port 5000
   └─> Express middleware processes request
   └─> Route handler executes
   └─> Queries SQLite database
   └─> Returns JSON response

5. Monitoring (Prometheus + Grafana)
   └─> Prometheus scrapes Node Exporter every 15s
   └─> Prometheus scrapes cAdvisor every 15s
   └─> Grafana queries Prometheus every 30s
   └─> Dashboards update in real-time
   └─> Alerts evaluated every 15s
```

---

## Deployment Scenarios

### Development Setup

```
Local Development Machine (Windows)
├── Node.js runtime (host)
├── PM2 daemon (host)
│   ├── Backend service (port 5000)
│   └── Frontend dev server (port 5173)
├── SQLite database (host storage)
└── Logs directory (host storage)

Access: http://localhost:5173 (frontend) + http://localhost:5000 (API)
```

### Production Setup (Docker)

```
Docker Host
├── Docker Engine
└── Docker Compose (orchestration)
    ├── Frontend Container (Nginx, port 80)
    ├── Backend Container (Node.js, port 5000)
    ├── Nginx Container (Reverse proxy, port 80)
    ├── Prometheus Container (port 9090)
    ├── Node Exporter Container (port 9100)
    ├── cAdvisor Container (port 8080)
    ├── Grafana Container (port 3001)
    └── Volumes:
        ├── db_volume (database persistence)
        └── grafana_data (dashboard persistence)

Access: http://localhost (frontend + API via Nginx)
Monitoring: http://localhost:9090 (Prometheus)
Dashboards: http://localhost:3001 (Grafana)
```

### Hybrid Setup (PM2 + Docker)

```
Local Development + Monitoring
├── PM2 (host)
│   ├── Backend service (port 5000)
│   └── Frontend dev server (port 5173)
└── Docker Containers (optional)
    ├── Prometheus (port 9090)
    ├── Node Exporter (port 9100)
    ├── cAdvisor (port 8080)
    └── Grafana (port 3001)

Useful for: Development with production-like monitoring
```

---

## Network Diagram

```
Internet/Client
    │
    └─────────────────────────┐
                              │
                         Port 80 (HTTP)
                              │
                    ┌─────────▼──────────┐
                    │  Nginx (Reverse    │
                    │  Proxy)            │
                    │                    │
                    │ - Route /api -> :5000
                    │ - Route / -> frontend
                    │ - Static files
                    └──────┬────┬────────┘
                           │    │
                   Port 80  │    │ Port 5000
                  (Frontend)│    │(Backend)
                           │    │
            ┌──────────────▼┐ ┌─▼─────────────┐
            │ Frontend      │ │ Backend       │
            │ (React)       │ │ (Express)     │
            │ (Nginx)       │ │ (Node.js)     │
            └───────────────┘ └─┬─────────────┘
                                │
                            SQLite DB
                            (Volume)

Monitoring Stack (Docker):
    Prometheus ◄─ Node Exporter (host metrics)
    Prometheus ◄─ cAdvisor (container metrics)
    Grafana ◄── Prometheus (dashboards)

Process Management (Host):
    PM2 Daemon ◄─ Backend Service
    PM2 Daemon ◄─ Frontend Dev Server
```

---

## Scalability Considerations

### Current Limitations

1. **Single Backend Instance**: PM2 runs one backend process
   - Solution: Change `instances: 1` to `instances: -1` in ecosystem.config.js for cluster mode
   - Docker: Use `docker-compose up --scale backend=3`

2. **SQLite Limitations**: Not suitable for high concurrency
   - Solution: Migrate to PostgreSQL for production
   - Would require database abstraction layer

3. **Memory Constraints**: 500MB limit for backend
   - Consider increasing for large datasets
   - Profile memory usage with `pm2 profile:mem 10`

### Future Enhancements

- **Load Balancing**: Add HAProxy or Kubernetes ingress
- **Caching Layer**: Redis for session/query caching
- **Database**: PostgreSQL with connection pooling
- **Distributed Tracing**: Jaeger for request tracking
- **Log Aggregation**: ELK stack for centralized logging
- **Container Orchestration**: Kubernetes for auto-scaling

---

## Summary

The Asset Management System uses a **modern, layered architecture** suitable for both development and production:

- **Frontend**: React SPA served by Nginx or Vite dev server
- **Backend**: Stateless Express API with SQLite persistence
- **Monitoring**: Prometheus + Grafana for observability
- **Process Management**: PM2 for auto-restart and log management
- **Containerization**: Docker/Docker Compose for deployment

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Horizontal scalability (with configuration changes)
- ✅ Comprehensive monitoring and alerting
- ✅ Automatic failure recovery
- ✅ Easy development and deployment workflows
