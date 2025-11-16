
FROM node:18-bullseye-slim AS builder

WORKDIR /app


COPY package*.json ./

# Install build tools required to compile native modules (sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-dev build-essential g++ make libsqlite3-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN npm_config_build_from_source=true npm ci --only=production \
    && npm rebuild sqlite3 --build-from-source || true


FROM node:18-bullseye-slim

WORKDIR /app


RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*


COPY --from=builder /app/node_modules ./node_modules


COPY . .


EXPOSE 5000


HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/assets || exit 1


CMD ["node", "server.js"]
