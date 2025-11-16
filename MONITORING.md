# Removed: See `README.md`

This file has been removed from the active documentation. The main `README.md` at the repository root is the single canonical document to use.

If you need the original content back, retrieve it from the git history.

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐
│   Prometheus    │◄────────┤  Node Exporter   │
│  (Port 9090)    │         │  (Port 9100)     │
└────────┬────────┘         └──────────────────┘
         │
         │                  ┌──────────────────┐
         ├─────────────────►│    cAdvisor      │
         │                  │  (Port 8080)     │
         │                  └──────────────────┘
         │
┌────────▼────────┐
│    Grafana      │
│  (Port 3000)    │
└─────────────────┘
```

## Services

### 1. **Prometheus** (Port 9090)
- **Purpose**: Time-series metrics database and alerting engine
- **URL**: http://localhost:9090
- **Key Features**:
  - Scrapes metrics from exporters every 15 seconds
  - Evaluates alerting rules
  - Stores 15 days of data by default
- **Config**: `prometheus/prometheus.yml`
- **Rules**: `prometheus/rules.yml` (InstanceDown, HighDockerRestartRate alerts)

### 2. **Node Exporter** (Port 9100)
- **Purpose**: Exports host system metrics (CPU, memory, disk, network)
- **URL**: http://localhost:9100/metrics
- **Metrics**: `node_cpu_seconds_total`, `node_memory_MemTotal_bytes`, `node_disk_*`, etc.

### 3. **cAdvisor** (Port 8080)
- **Purpose**: Container metrics and performance monitoring
- **URL**: http://localhost:8080/containers/
- **Metrics**: Container CPU, memory, network, restart counts
- **UI**: http://localhost:8080 for container exploration

### 4. **Grafana** (Port 3000)
- **Purpose**: Dashboards and visualization
- **URL**: http://localhost:3000
- **Credentials**: 
  - Username: `admin`
  - Password: `admin`
- **Pre-configured Dashboards**:
  - **Health Overview**: Shows `up` metric and target status
  - **Node Exporter Host**: CPU and memory usage metrics

## Quick Start

### Start the Monitoring Stack
```powershell
# From the project root
docker compose up -d prometheus node-exporter cadvisor grafana
```

### Access Services
- **Prometheus UI**: http://localhost:9090
- **Grafana Dashboards**: http://localhost:3000 (admin/admin)
- **Node Exporter Metrics**: http://localhost:9100/metrics
- **cAdvisor UI**: http://localhost:8080/containers/

## Using Prometheus

### Query Examples

**Check if all targets are UP:**
```
up
```

**CPU usage (rate over 5 minutes):**
```
sum(rate(node_cpu_seconds_total{mode!~"idle|iowait"}[5m])) by (instance)
```

**Memory usage (MB):**
```
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / 1024 / 1024
```

**Container restart count:**
```
container_last_seen
```

### View Alerts
1. Go to **http://localhost:9090/alerts**
2. See all configured alerting rules:
   - **InstanceDown**: Fires when target is unreachable for >1 minute
   - **HighDockerRestartRate**: Fires when containers restart frequently

### API Endpoints

**Get all targets and their status:**
```powershell
Invoke-WebRequest -Uri "http://localhost:9090/api/v1/targets" -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Get active alerts:**
```powershell
Invoke-WebRequest -Uri "http://localhost:9090/api/v1/alerts" -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Get all rules:**
```powershell
Invoke-WebRequest -Uri "http://localhost:9090/api/v1/rules" -UseBasicParsing | Select-Object -ExpandProperty Content
```

## Using Grafana

### Login
1. Open http://localhost:3000
2. Enter `admin` / `admin`

### View Dashboards
1. Click **"Dashboards"** in the left sidebar
2. Click **"Browse"**
3. Select:
   - **Health Overview** – Target status overview
   - **Node Exporter Host** – System metrics (CPU, memory)

### Add Custom Dashboard
1. Click **"+"** (Create) → **"Dashboard"**
2. Click **"Add panel"**
3. Configure:
   - **Data source**: Prometheus (already configured)
   - **Metrics**: Use PromQL queries (e.g., `up`, `node_cpu_seconds_total`)
   - **Visualization**: Graph, Stat, Table, etc.

### Verify Prometheus Connection
1. Click **"Connections"** → **"Data sources"**
2. Click **"Prometheus"**
3. Click **"Test datasource"** (should show "Data source is working")

## Health Checks

### All Services UP
```powershell
docker compose ps
```
Expected: All containers showing "Up" status.

### Prometheus Targets UP
```powershell
Invoke-WebRequest -Uri "http://localhost:9090/api/v1/targets" -UseBasicParsing | Select-Object -ExpandProperty Content
```
Expected: All targets showing `"health":"up"`

### Node Exporter Responding
```powershell
Invoke-WebRequest -Uri "http://localhost:9100/metrics" -UseBasicParsing | Select-Object -ExpandProperty Content | Select-Object -First 20
```
Expected: Metrics like `node_boot_time_seconds`, `node_cpu_seconds_total`, etc.

### cAdvisor Responding
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/metrics" -UseBasicParsing | Select-Object -ExpandProperty Content | Select-Object -First 20
```
Expected: Metrics like `container_cpu_usage_seconds_total`, `container_memory_usage_bytes`, etc.

## Troubleshooting

### Prometheus Not Scraping Targets
1. Check **http://localhost:9090/targets** for error messages
2. Verify service names in `prometheus/prometheus.yml` match docker-compose service names
3. Ensure services are on the same Docker network (`asset_network`)

### Grafana Dashboards Not Showing Data
1. Verify Prometheus datasource is working: http://localhost:3000 → Connections → Data sources → Test
2. Check time range is correct (top-right of Grafana)
3. Verify metrics exist in Prometheus: http://localhost:9090/graph

### Alert Not Firing
1. Check rule syntax in `prometheus/rules.yml`
2. Verify condition is actually true: http://localhost:9090/graph
3. Ensure alerting evaluation interval (15s by default) has passed

## Configuration Files

### `prometheus/prometheus.yml`
- **scrape_interval**: How often to scrape metrics (15s)
- **evaluation_interval**: How often to evaluate rules (15s)
- **scrape_configs**: Which services to scrape from

### `prometheus/rules.yml`
- **InstanceDown**: Alert if target is down >1 minute
- **HighDockerRestartRate**: Alert if containers restart frequently

### `grafana/provisioning/datasources/datasource.yml`
- Auto-configures Prometheus datasource at startup

### `grafana/provisioning/dashboards/dashboard.yml`
- Auto-loads dashboards from `/var/lib/grafana/dashboards`

## Next Steps

1. **Add Alertmanager** (optional): Send alerts to email/Slack
2. **Add more dashboards**: Import prebuilt dashboards from Grafana Community
3. **Monitor application metrics**: Add custom metrics to backend/frontend apps
4. **Set up persistent storage**: Configure Prometheus data retention
5. **Secure Grafana**: Change admin password and configure LDAP/OAuth

## Useful Links

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Node Exporter Metrics](https://github.com/prometheus/node_exporter#collectors)
- [cAdvisor Documentation](https://github.com/google/cadvisor)
- [Prometheus Query Language (PromQL)](https://prometheus.io/docs/prometheus/latest/querying/basics/)
