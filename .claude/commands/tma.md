---
description: Traite une demande de TMA (Ticket de Maintenance Applicative) client
---

Traitement d'une demande TMA.

1. Collecte les informations si non fournies :
   - Client concerné (slug)
   - Description du problème
   - Urgence (bloquant / important / mineur)
   - Screenshot ou message du client si disponible

2. Crée le ticket Linear dans le projet du client avec :
   - Label : tma
   - Priorité selon l'urgence
   - Description complète

3. Met à jour Notion TMA avec le lien Linear

4. Estime le temps de résolution selon la complexité

5. Rédige un message de confirmation à envoyer au client via WhatsApp Business :
   "Bonjour [Prénom], bien reçu votre demande. [Ticket MAR-XX créé / En cours de traitement].
   Je vous tiens informé(e) de l'avancement."
