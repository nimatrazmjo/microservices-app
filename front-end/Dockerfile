# Stage 1: Builder
FROM node:23-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy pnpm files for dependency installation
COPY pnpm-lock.yaml package.json .npmrc ./
RUN pnpm fetch && pnpm install --frozen-lockfile

# Copy all files and build
COPY . .
RUN pnpm build

# Stage 2: Runner
FROM node:23-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Non-root user setup
RUN adduser -D nextjs && \
    mkdir -p /app/.next && \
    chown -R nextjs:nextjs /app
USER nextjs

# Copy production assets
COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nextjs /app/next.config.mjs ./

EXPOSE 3000
CMD ["pnpm", "start"]