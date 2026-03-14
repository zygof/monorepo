# ── Stage 1 : deps ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g pnpm@9.0.0

# Copier les manifests du monorepo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/template-coiffure/package.json ./apps/template-coiffure/
COPY packages/ui/package.json ./packages/ui/
COPY packages/database/package.json ./packages/database/
COPY packages/design-tokens/package.json ./packages/design-tokens/
COPY packages/config-eslint/package.json ./packages/config-eslint/
COPY packages/config-typescript/package.json ./packages/config-typescript/

RUN echo "shamefully-hoist=true" >> .npmrc && \
    pnpm install --frozen-lockfile --filter @marrynov/template-coiffure...

# ── Stage 2 : builder ─────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/template-coiffure/node_modules ./apps/template-coiffure/node_modules
COPY --from=deps /app/packages/ ./packages/

# Copier les sources
COPY packages/ ./packages/
COPY apps/template-coiffure/ ./apps/template-coiffure/

# Générer le client Prisma
RUN cd packages/database && npx prisma generate

# Build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app/apps/template-coiffure
RUN pnpm build

# ── Stage 3 : runner ──────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Monorepo standalone : server.js est dans apps/template-coiffure/
COPY --from=builder --chown=nextjs:nodejs /app/apps/template-coiffure/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/template-coiffure/public ./apps/template-coiffure/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/template-coiffure/.next/static ./apps/template-coiffure/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js fait process.chdir(__dirname) → CWD = /app/apps/template-coiffure/
CMD ["node", "/app/apps/template-coiffure/server.js"]
