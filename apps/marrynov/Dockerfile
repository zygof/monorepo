# ── Stage 1 : deps ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Installer pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copier les manifests du monorepo
COPY package.json pnpm-workspace.yaml ./
COPY apps/marrynov/package.json ./apps/marrynov/
COPY packages/config-eslint/package.json ./packages/config-eslint/
COPY packages/config-typescript/package.json ./packages/config-typescript/

RUN pnpm install --frozen-lockfile --filter @marrynov/site...

# ── Stage 2 : builder ─────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

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

COPY --from=builder /app/apps/marrynov/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/marrynov/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/marrynov/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
