---
description: Lance la checklist de déploiement et pousse en production via Dokploy
---

Déploiement en production d'une app MARRYNOV.

1. Identifie quelle app déployer (si non précisé, demande)

2. Lance la checklist pre-déploiement :
   - pnpm lint dans l'app concernée
   - pnpm typecheck
   - pnpm test
   - pnpm build (pour vérifier que le build passe)

3. Si tous les checks passent, confirme avec Nicolas avant de pusher

4. Git push sur main → déclenche le webhook Dokploy automatiquement

5. Surveille les logs Dokploy et confirme que le déploiement est vert

6. Vérifie Uptime Kuma (statut de l'URL de prod)

7. Crée un ticket Linear "Déploiement [app] - [date]" avec statut "Done"
