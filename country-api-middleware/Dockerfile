# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY src ./src
COPY server.js ./
COPY .env ./

RUN npm install --production

# Runtime stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./
COPY --from=builder /app/.env ./

RUN mkdir -p /data

EXPOSE 3000

CMD ["npm", "start"]