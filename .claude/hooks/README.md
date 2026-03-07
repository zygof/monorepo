# Hooks Claude Code — MARRYNOV

## Hooks actifs

| Hook                | Déclencheur         | Action                                        |
| ------------------- | ------------------- | --------------------------------------------- |
| pre-commit-check.sh | Avant chaque commit | Lint + typecheck sur les fichiers TS modifiés |

## Configuration dans Claude Code

Les hooks sont configurés dans settings.json de Claude Code.
Pour les activer manuellement, utilise la commande /hooks dans une session Claude Code.

## Ajouter un hook

1. Créer le script dans .claude/hooks/
2. Le rendre exécutable : chmod +x .claude/hooks/[script].sh
3. Configurer dans Claude Code via /hooks
