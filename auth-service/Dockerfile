# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

# Create non-root user
RUN adduser -D expressuser && chown -R expressuser /app
USER expressuser

# Copy from builder
COPY --from=builder --chown=expressuser /app/node_modules ./node_modules
COPY --from=builder --chown=expressuser /app/src ./src
COPY --from=builder --chown=expressuser /app/.env ./

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3002/health || exit 1

EXPOSE 3002
CMD ["npm", "start"]