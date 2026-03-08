# ── Stage 1 : deps ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm@9.0.0

# Copier les manifests du monorepo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/marrynov/package.json ./apps/marrynov/
COPY packages/config-eslint/package.json ./packages/config-eslint/
COPY packages/config-typescript/package.json ./packages/config-typescript/

RUN pnpm install --frozen-lockfile --filter @marrynov/site...

# ── Stage 2 : builder ─────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/marrynov/node_modules ./apps/marrynov/node_modules

# Copier les sources
COPY packages/ ./packages/
COPY apps/marrynov/ ./apps/marrynov/

# Build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app/apps/marrynov
RUN pnpm build

# ── Stage 3 : runner ──────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Monorepo standalone : server.js est dans apps/marrynov/, pas à la racine
COPY --from=builder --chown=nextjs:nodejs /app/apps/marrynov/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/marrynov/public ./apps/marrynov/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/marrynov/.next/static ./apps/marrynov/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js fait process.chdir(__dirname) → CWD = /app/apps/marrynov/
CMD ["node", "/app/apps/marrynov/server.js"]
