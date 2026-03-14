#!/usr/bin/env bash
# Reset complet de l'environnement de dev (supprime les données + reseed)
# Usage : bash packages/database/scripts/dev-reset.sh
set -euo pipefail

COMPOSE_FILE="packages/database/docker-compose.dev.yml"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

cd "$MONOREPO_ROOT"

echo ""
echo "══════════════════════════════════════════════════════"
echo "  MARRYNOV — Reset complet de l'environnement de dev"
echo "══════════════════════════════════════════════════════"
echo ""

# 1. Stopper et supprimer les conteneurs + volumes
echo "▸ Arrêt des services et suppression des volumes..."
docker compose -f "$COMPOSE_FILE" down -v
echo "✓ Volumes supprimés"

# 2. Relancer les services
echo "▸ Redémarrage PostgreSQL 16 + Redis 7..."
docker compose -f "$COMPOSE_FILE" up -d

# 3. Attendre que PostgreSQL soit prêt
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

# 4. Attendre que Redis soit prêt
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

# 5. Appliquer le schéma
echo "▸ Application du schéma Prisma..."
pnpm --filter @marrynov/database db:push
echo "✓ Schéma appliqué"

# 6. Jouer le seed
echo "▸ Insertion des données de démo..."
pnpm --filter @marrynov/database db:seed
echo "✓ Seed terminé"

# 7. Résumé
echo ""
echo "══════════════════════════════════════════════════════"
echo "  Reset terminé — environnement propre !"
echo "══════════════════════════════════════════════════════"
echo ""
echo "  PostgreSQL : localhost:5433  (marrynov/marrynov)"
echo "  Redis      : localhost:6380"
echo "  DB         : marryhair (données de démo chargées)"
echo ""
echo "  Comptes de test :"
echo "    Admin    : n.marry90@gmail.com (Google OAuth)"
echo "    Styliste : marie-laure@beautecreole.re / Employee2026!"
echo "    Client   : marie.dubois@email.com / Client2026!"
echo ""
