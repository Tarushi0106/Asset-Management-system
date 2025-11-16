# PM2 Process Management Documentation

## Overview

PM2 is a production-grade process manager for Node.js applications that provides:
- **Auto-restart** on process crash
- **Memory monitoring** with automatic restart on threshold
- **Log management** with file rotation
- **Watch mode** for development
- **System startup hooks** for persistence across reboots

## Current Setup

The Asset Management System uses PM2 to manage two applications:

### 1. Backend Service
- **Process Name**: `asset-backend`
- **Script**: `./backend/server.js`
- **Port**: 5000
- **Environment**: development
- **Max Memory**: 500MB (auto-restart if exceeded)
- **Watch Enabled**: Yes (watches `backend/` directory)

### 2. Frontend Development Server
- **Process Name**: `asset-frontend-dev`
- **Command**: `npm run dev`
- **Port**: 5173
- **Environment**: development
- **Max Memory**: 300MB (auto-restart if exceeded)

## Quick Start

### Start PM2 Services

Using the provided startup script (recommended):
```powershell
# Windows PowerShell
.\pm2-start.ps1
```

Or manually:
```bash
pm2 start ecosystem.config.js --update-env
```

### Stop All Services
```powershell
.\pm2-stop.ps1
```

Or:
```bash
pm2 stop all
```

### Restart Services
```powershell
.\pm2-restart.ps1
```

Or specific service:
```bash
pm2 restart asset-backend
# or
pm2 restart asset-frontend-dev
```

### Monitor Services in Real-Time
```powershell
.\pm2-monitor.ps1
```

Or:
```bash
pm2 monit
```

## Useful Commands

### View Process Status
```bash
# Quick status table
pm2 status

# Detailed info about specific process
pm2 describe asset-backend

# All processes in JSON format
pm2 jlist
```

### Logs

```bash
# Stream logs for all processes (Ctrl+C to exit)
pm2 logs

# View logs for specific process
pm2 logs asset-backend
pm2 logs asset-frontend-dev

# Display last N lines without streaming
pm2 logs --lines 50 --nostream

# Clear all logs
pm2 flush
```

### Process Management

```bash
# Restart specific process
pm2 restart asset-backend

# Reload (graceful restart for apps with HTTP server)
pm2 reload asset-backend

# Delete process from PM2
pm2 delete asset-backend

# Delete all processes
pm2 delete all
```

### Memory & CPU Profiling

```bash
# Real-time CPU and memory monitoring
pm2 monit

# Heap dump (advanced debugging)
pm2 profile:mem 10

# CPU profiling (advanced)
pm2 profile:cpu 10
```

## Configuration

The PM2 configuration is defined in `ecosystem.config.js`:

### Key Settings

```javascript
{
  name: 'asset-backend',           // Unique identifier
  script: './backend/server.js',   // Entry point
  instances: 1,                     // Number of instances
  exec_mode: 'fork',               // fork or cluster mode
  max_memory_restart: '500M',      // Auto-restart if memory exceeds this
  restart_delay: 4000,             // Wait 4 seconds before restarting
  max_restarts: 10,                // Max restarts in 1 minute
  min_uptime: '10s',               // Process must run 10s minimum before counting as "started"
  error_file: './logs/...',        // Stderr log path
  out_file: './logs/...',          // Stdout log path
  watch: ['backend'],              // Watch these directories (dev mode)
}
```

## Auto-Restart Behavior

PM2 automatically restarts processes in these scenarios:

1. **Process Crash**: If the application crashes, PM2 restarts it after `restart_delay`
2. **Memory Threshold**: If process exceeds `max_memory_restart`, it's restarted
3. **File Changes** (watch mode): If files in watched directories change, process restarts
4. **Manual Restart**: Using `pm2 restart` command

### Monitoring Restarts

Check the restart count:
```bash
pm2 status
# Look at the "↺" column for restart count

# Detailed restart history
pm2 describe asset-backend | grep -E "(restarts|uptime)"
```

## System Startup (Optional)

To have PM2 automatically start services when your computer boots:

### Windows Setup

1. Run PM2 startup command:
```bash
pm2 startup windows
```

2. PM2 will output a command to run - copy and execute it with Administrator privileges

3. Save the process list:
```bash
pm2 save
```

### Verify System Startup

```bash
# List startup hooks
pm2 show-task
```

## Log Locations

Logs are stored in the `logs/` directory:

- **Backend Output**: `logs/backend-out-0.log`
- **Backend Errors**: `logs/backend-error-0.log`
- **Backend Combined**: `logs/backend-combined-0.log`
- **Frontend Output**: `frontend/logs/frontend-out-1.log`
- **Frontend Errors**: `frontend/logs/frontend-error-1.log`

## Integration with Docker

PM2 on the host machine manages the Node.js applications directly (not via Docker).

For production deployments with Docker:
1. Run applications via Docker Compose (Docker manages restarts)
2. Or run PM2 inside Docker containers with appropriate signals

Current setup: PM2 manages native host processes, Docker stack remains available for infrastructure services.

## Troubleshooting

### Process Not Starting

Check logs:
```bash
pm2 logs asset-backend --lines 100 --nostream
```

Verify script path is correct:
```bash
pm2 describe asset-backend | grep "script path"
```

### High Restart Count

Indicates frequent crashes. Check:
1. **Logs**: `pm2 logs asset-backend`
2. **Environment**: Verify required env variables are set
3. **Dependencies**: Ensure all npm packages are installed
4. **Port conflicts**: Check if port 5000 is already in use

### Memory Issues

If you see `max-memory-restart` happening frequently:
1. Increase threshold in `ecosystem.config.js`
2. Profile memory usage: `pm2 profile:mem 10`
3. Check for memory leaks in application code

### Frontend Dev Server Not Working

Ensure frontend dependencies are installed:
```bash
cd frontend
npm install
```

Check that port 5173 is available.

## Performance Tips

1. **Use Cluster Mode** for CPU-intensive apps (change `exec_mode: 'cluster'`)
2. **Monitor Regularly**: Use `pm2 monit` during development
3. **Set Appropriate Memory Limits**: Based on your system resources
4. **Watch Selective Directories**: Avoid watching `node_modules` (already ignored)
5. **Use Logs Strategically**: Log important events, avoid excessive logging

## Integration with Monitoring Stack

PM2 complements the Docker-based monitoring stack:

- **PM2 Metrics**: Available via `pm2 monit` and PM2 CLI
- **Prometheus/Grafana**: Monitors Docker containers and infrastructure
- **Combined View**: Use both for complete application and infrastructure visibility

Example: PM2 manages backend/frontend processes, while Prometheus monitors Docker container resource usage.

## Next Steps

After PM2 is running:

1. **Verify Services**: Check `pm2 status` and test endpoints
2. **Check Logs**: Monitor for any errors in `pm2 logs`
3. **Test Auto-Restart**: Kill a process and verify it restarts
4. **Enable System Startup**: Run `pm2 startup` for persistence
5. **Monitor**: Set up regular monitoring with `pm2 monit`

## References

- [PM2 Official Documentation](https://pm2.keymetrics.io/)
- [Ecosystem Configuration Guide](https://pm2.keymetrics.io/docs/usage/application-declaration/)
- [PM2 Plus Monitoring](https://pm2.keymetrics.io/docs/usage/monitoring/)
