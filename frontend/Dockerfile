FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Copy application source into builder for production build
COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Use default nginx configuration (do not overwrite with project root nginx.conf)
# Expose port 80 (nginx default)
EXPOSE 80

# Health check against nginx on port 80
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
# Expose port 80 (nginx default)
