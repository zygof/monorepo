#!/bin/bash
# Hook pre-commit MARRYNOV
# Vérifie lint + typecheck avant chaque commit

set -e

echo "Vérification pre-commit MARRYNOV..."

# Récupère les fichiers modifiés
CHANGED=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx)$' || true)

if [ -z "$CHANGED" ]; then
  echo "Aucun fichier TS modifié, skip."
  exit 0
fi

# Détermine le workspace concerné
if echo "$CHANGED" | grep -q "^apps/"; then
  APP=$(echo "$CHANGED" | grep "^apps/" | head -1 | cut -d'/' -f2)
  echo "App détectée : $APP"
  cd apps/$APP
  pnpm lint --quiet || { echo "LINT ÉCHOUÉ dans apps/$APP"; exit 1; }
  pnpm typecheck || { echo "TYPECHECK ÉCHOUÉ dans apps/$APP"; exit 1; }
fi

echo "Pre-commit OK"
exit 0
