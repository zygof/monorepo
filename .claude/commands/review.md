---
description: Lance une revue de code complète sur les fichiers modifiés (qualité, sécurité, performance, conventions MARRYNOV)
---

Revue de code sur les changements en cours.

1. Identifie les fichiers modifiés (git diff ou fichiers passés en contexte)

2. Analyse sur 4 axes :
   - Qualité et lisibilité du code
   - Respect des conventions MARRYNOV (voir CLAUDE.md)
   - Sécurité (secrets exposés, injections, XSS)
   - Performance (requêtes N+1, re-renders inutiles, bundle size)

3. Formatte le retour en :
   - Critique (bloquant pour le merge)
   - Amélioration (recommandé)
   - Suggestion (optionnel)

4. Propose les corrections pour chaque point critique
