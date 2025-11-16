module.exports = {
  apps: [
    {
      name: 'asset-backend',
      script: './backend/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      node_args: '',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
        JWT_SECRET: 'your_jwt_secret_key_here'
      },
      max_memory_restart: '500M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z',
      watch: ['backend'],
      ignore_watch: ['node_modules', 'logs']
    },
    {
      name: 'asset-frontend-dev',
      script: 'npm',
      args: 'run dev',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        VITE_API_URL: 'http://localhost:5000'
      },
      max_memory_restart: '300M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      error_file: '../logs/frontend-error.log',
      out_file: '../logs/frontend-out.log',
      log_file: '../logs/frontend-combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],
  deploy: {
    production: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'https://github.com/Tarushi0106/Asset-Management-system.git',
      path: '/var/www/asset-management',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
