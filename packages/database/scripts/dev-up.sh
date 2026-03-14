#!/usr/bin/env bash
# Lance l'environnement de dev MARRYNOV (PostgreSQL + Redis)
# Usage : bash packages/database/scripts/dev-up.sh
set -euo pipefail

COMPOSE_FILE="packages/database/docker-compose.dev.yml"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

cd "$MONOREPO_ROOT"

echo ""
echo "══════════════════════════════════════════════════════"
echo "  MARRYNOV — Démarrage environnement de dev"
echo "══════════════════════════════════════════════════════"
echo ""

# 1. Lancer les services Docker
echo "▸ Démarrage PostgreSQL 16 + Redis 7..."
docker compose -f "$COMPOSE_FILE" up -d

# 2. Attendre que PostgreSQL soit prêt
echo "▸ Attente de PostgreSQL..."
RETRIES=30
until docker exec marrynov-postgres-dev pg_isready -U marrynov -d marryhair > /dev/null 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    echo "✗ PostgreSQL n'a pas démarré dans les temps"
    exit 1
  fi
  sleep 1
done
echo "✓ PostgreSQL prêt"

# 3. Attendre que Redis soit prêt
echo "▸ Attente de Redis..."
RETRIES=15
until docker exec marrynov-redis-dev redis-cli ping 2>/dev/null | grep -q PONG; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    echo "✗ Redis n'a pas démarré dans les temps"
    exit 1
  fi
  sleep 1
done
echo "✓ Redis prêt"

# 4. Lancer les migrations Prisma
echo "▸ Application des migrations Prisma..."
pnpm --filter @marrynov/database db:migrate --name init 2>/dev/null || \
  pnpm --filter @marrynov/database db:push
echo "✓ Schéma de base de données à jour"

# 5. Résumé
echo ""
echo "══════════════════════════════════════════════════════"
echo "  Environnement de dev prêt !"
echo "══════════════════════════════════════════════════════"
echo ""
echo "  PostgreSQL : localhost:5433  (marrynov/marrynov)"
echo "  Redis      : localhost:6380"
echo "  DB         : marryhair"
echo ""
echo "  Commandes utiles :"
echo "    pnpm db:studio              → Prisma Studio"
echo "    pnpm db:seed                → Données de démo"
echo "    pnpm --filter template-coiffure dev  → Next.js"
echo ""
