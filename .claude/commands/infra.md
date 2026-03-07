---
description: Gestion de l'infrastructure MARRYNOV — healthcheck, backup, restore, status services
---

Commande de gestion infrastructure MARRYNOV.

1. Identifie l'action demandée parmi :
   - **status** / **healthcheck** → lancer le script healthcheck
   - **backup** → lancer le backup manuel
   - **restore** → guider la restauration
   - **logs** → afficher les logs d'un service
   - **restart** → redémarrer un service

2. Exécute l'action :

   **Status complet :**

   ```bash
   ~/MARRYNOV/infra/backup/scripts/healthcheck.sh
   ```

   **Backup manuel :**

   ```bash
   ~/MARRYNOV/infra/backup/scripts/backup.sh
   ```

   **Restore (demander quel service et quel fichier) :**

   ```bash
   ls ~/MARRYNOV/infra/backup/storage/postgres/
   ls ~/MARRYNOV/infra/backup/storage/volumes/
   ~/MARRYNOV/infra/backup/scripts/restore.sh <service> <fichier>
   ```

   **Logs d'un service :**

   ```bash
   docker logs <conteneur> --tail 50 -f
   # ou pour Swarm :
   docker service logs <service> --tail 50
   ```

   **Restart service :**

   ```bash
   docker restart <conteneur>           # Compose
   docker service update --force <svc>  # Swarm/Dokploy
   ```

3. Après toute action corrective, relancer le healthcheck pour confirmer.

4. Si incident majeur → consulter ~/MARRYNOV/infra/RUNBOOK.md
