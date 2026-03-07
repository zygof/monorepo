---
name: infra-setup
description: Activée quand la tâche mentionne "infrastructure", "VPS", "Docker Engine", "Dokploy install", "n8n setup", "registry", "backup B2", "migration prod". Contient les procédures complètes d'installation et de configuration de l'infra MARRYNOV.
---

# Skill — Infrastructure MARRYNOV

## Vue d'ensemble de la stack infra

```
VPS Ubuntu 24.04 (Contabo S — 4vCPU / 8Go / 200Go)
│
├── Docker Engine 29+ (natif, systemd)
├── Docker Swarm (single node, géré par Dokploy)
│
├── Dokploy v0.28.4+ (Swarm)
│   ├── Traefik v3 → :80/:443 (SSL via Cloudflare DNS challenge)
│   ├── PostgreSQL 16 (base Dokploy)
│   └── Redis 7
│
├── n8n (Docker Compose) → n8n.marrynov.re
│   └── PostgreSQL 16 dédié
│
├── Uptime Kuma (Docker Compose) → uptime.marrynov.re
│
├── Backups → Backblaze B2 (via Dokploy + script custom)
│
└── Sécurité : UFW + Fail2ban + SSH clé ED25519
```

---

## 1. Installation Docker Engine (Ubuntu 24.04)

```bash
# Prérequis
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg

# Clé GPG Docker
sudo install -m 0755 -d /etc/apt/keyrings
sudo bash -c 'curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc && chmod a+r /etc/apt/keyrings/docker.asc'

# Dépôt Docker
sudo bash -c 'echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" > /etc/apt/sources.list.d/docker.list'

# Installation
sudo apt-get update && sudo apt-get install -y \
  docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# Vérification
docker --version && docker compose version
# Docker Engine 29.x.x + Docker Compose v5.x.x attendus
```

---

## 2. Installation Dokploy

```bash
curl -sSL https://dokploy.com/install.sh | bash
# Installe : Dokploy + Traefik + PostgreSQL 16 + Redis 7
# Démarre sur le port :3000
# Crée le réseau Swarm "dokploy-network"
```

**Première connexion** : `http://<IP>:3000/register`
Créer le compte admin puis fermer le port 3000 (Traefik prend le relais).

---

## 3. Déploiement n8n (Docker Compose)

Fichiers de référence :

- `~/MARRYNOV/infra/n8n/docker-compose.yml`
- `~/MARRYNOV/infra/n8n/.env.example`

```bash
# Générer les secrets
cd ~/MARRYNOV/infra/n8n
cp .env.example .env
# Éditer .env avec les vraies valeurs :
#   N8N_DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=')
#   N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)
#   N8N_DOMAIN=n8n.marrynov.re

docker compose --env-file .env up -d

# Validation
curl -s https://n8n.marrynov.re/healthz  # {"status":"ok"}
```

Variables obligatoires `.env` :

- `N8N_DB_PASSWORD` — généré avec openssl
- `N8N_ENCRYPTION_KEY` — 32 bytes hex, NE JAMAIS CHANGER après mise en prod
- `N8N_DOMAIN` — domaine Traefik

---

## 4. Déploiement Uptime Kuma

Fichier : `~/MARRYNOV/infra/uptime-kuma/docker-compose.yml`

```bash
cd ~/MARRYNOV/infra/uptime-kuma
docker compose up -d
```

Monitors à configurer dans l'UI (`https://uptime.marrynov.re`) :

- n8n → `https://n8n.marrynov.re/healthz` (HTTP 200, 60s)
- Dokploy → `https://dokploy.marrynov.re` (HTTP 200, 60s)
- Uptime Kuma self → `http://localhost:3001` (TCP, 60s)
- Chaque app client → `https://[slug].marrynov.re` (HTTP 200, 60s)

Alertes : email (nicolas@marrynov.re)

---

## 5. Configuration Traefik (SSL Cloudflare)

En prod, Traefik utilise le DNS Challenge Cloudflare pour les certificats wildcard.
Éditer `/etc/dokploy/traefik/traefik.yml` :

```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: nicolas@marrynov.re
      storage: /etc/dokploy/traefik/dynamic/acme.json
      dnsChallenge:
        provider: cloudflare
        resolvers:
          - '1.1.1.1:53'
          - '8.8.8.8:53'
```

Variables d'environnement Traefik (dans le service Swarm) :

```
CF_API_TOKEN=<cloudflare-api-token>
```

Créer le token Cloudflare : Dashboard → API Tokens → Edit zone DNS (uniquement marrynov.re)

---

## 6. Sécurité VPS (UFW + Fail2ban)

```bash
# UFW — n'autoriser que le strict nécessaire
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP (Traefik)
sudo ufw allow 443/tcp     # HTTPS (Traefik)
sudo ufw allow 2377/tcp    # Docker Swarm (si multi-node futur)
sudo ufw enable

# Fail2ban — protection SSH
sudo apt-get install -y fail2ban
sudo bash -c 'cat > /etc/fail2ban/jail.local << EOF
[sshd]
enabled = true
maxretry = 5
bantime = 3600
findtime = 600
EOF'
sudo systemctl enable --now fail2ban

# SSH — désactiver l'auth par mot de passe
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl reload sshd
```

Clé publique à déposer sur le VPS :

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAII6SVc9ShMwStX4VWx2QAQ0jDhYBa+wH4MlmPO2w0eDs nicolas@marrynov.re — VPS Contabo prod
```

---

## 7. Backups Backblaze B2

### Dokploy natif (bases PostgreSQL)

Dans Dokploy UI → Settings → Backups :

- Provider : S3 compatible
- Endpoint : `https://s3.us-west-004.backblazeb2.com`
- Bucket : `marrynov-backups`
- Credentials : Application Key B2
- Schedule : `0 2 * * *` (2h00 quotidien)
- Retention : 30 jours

### Script custom (volumes)

```bash
# Installer rclone pour sync volumes → B2
curl https://rclone.org/install.sh | sudo bash
rclone config  # configurer "b2" avec Application Key B2
```

Ajouter dans `backup.sh` :

```bash
rclone sync ~/MARRYNOV/infra/backup/storage b2:marrynov-backups/$(hostname) \
  --max-age 30d --log-level INFO
```

---

## 8. Registry ghcr.io (GitHub Container Registry)

```bash
# Authentification locale
echo $GITHUB_TOKEN | docker login ghcr.io -u <github-username> --password-stdin

# Build et push
docker build -t ghcr.io/marrynov/<app>:<tag> .
docker push ghcr.io/marrynov/<app>:<tag>
```

Pour que Dokploy puisse puller les images privées :
Dokploy UI → Settings → Registry → Add `ghcr.io` avec le GitHub Token

---

## 9. Healthcheck & monitoring

```bash
# Rapport complet
~/MARRYNOV/infra/backup/scripts/healthcheck.sh

# Backup manuel
~/MARRYNOV/infra/backup/scripts/backup.sh

# Restore
~/MARRYNOV/infra/backup/scripts/restore.sh <service> <fichier>
```

Runbook incidents : `~/MARRYNOV/infra/RUNBOOK.md`
Migration VPS : `~/MARRYNOV/infra/MIGRATION_VPS.md`

---

## 10. Workflows n8n MARRYNOV

**Règle absolue : n8n ne fait jamais d'action finale vers un client. Il prépare, notifie Nicolas, Nicolas valide et agit.**

### Workflow 1 — Brouillon email client

- Déclencheur : webhook (appel manuel ou depuis Linear)
- Action : formater l'email avec les données du projet
- Résultat : créer un brouillon Gmail + envoyer une notification à Nicolas

### Workflow 2 — Génération devis/facture Freebe

- Déclencheur : jalon Linear passé en "Done" OU paiement Stripe reçu
- Action : appel API Freebe pour créer le devis/facture en statut "Brouillon"
- Résultat : notification Nicolas avec lien direct vers le document Freebe
- Nicolas valide, modifie si besoin, envoie manuellement depuis Freebe

### Workflow 3 — Rapport mensuel (futur)

- Déclencheur : 1er du mois
- Action : agréger les stats Linear (tickets fermés) + Stripe (CA du mois)
- Résultat : email récapitulatif à Nicolas

### À ne jamais faire en n8n

- Envoyer un email directement à un client
- Envoyer une facture sans validation manuelle
- Modifier des données en base de production sans confirmation
