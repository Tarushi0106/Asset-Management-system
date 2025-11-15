
FROM node:18-alpine AS builder

WORKDIR /app


COPY package*.json ./


RUN npm ci --only=production


FROM node:18-alpine

WORKDIR /app


RUN apk add --no-cache curl


COPY --from=builder /app/node_modules ./node_modules


COPY . .


EXPOSE 5000


HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/assets || exit 1


CMD ["node", "server.js"]
