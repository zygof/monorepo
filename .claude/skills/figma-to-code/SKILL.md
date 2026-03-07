---
name: figma-to-code
description: Activée quand la tâche mentionne "Figma", "design", "maquette", "visuel client", "Code Connect", "design tokens", "implémenter le design". Contient le workflow complet design → code MARRYNOV avec le MCP Figma.
---

# Skill — Figma → Code MARRYNOV

## Principe

Chaque composant Figma est mappé à un vrai composant React de `packages/ui/`.
Quand Claude lit un Figma via MCP, il retourne directement tes composants réels — pas du code générique.

```
Figma (client)
  ├── Composants → mappés via Code Connect → packages/ui/<Composant>.tsx
  ├── Variables (couleurs, typo, spacing) → mappées → packages/design-tokens/tokens.css
  └── Frames/sections → lus via get_design_context → implémentation avec vrais composants
```

---

## Outils MCP Figma disponibles

| Outil                          | Usage                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `get_design_context`           | **Principal** — lit un node Figma, retourne code + screenshot + Code Connect |
| `get_variable_defs`            | Récupère les design tokens (couleurs, typo, spacing) depuis Figma            |
| `get_screenshot`               | Screenshot d'un node pour référence visuelle                                 |
| `get_metadata`                 | Infos du fichier Figma (pages, frames)                                       |
| `get_code_connect_map`         | Voir les mappages Figma ↔ composants existants                               |
| `add_code_connect_map`         | Ajouter un mappage manuellement                                              |
| `send_code_connect_mappings`   | Pousser les mappages vers Figma                                              |
| `get_code_connect_suggestions` | Suggestions IA de mappages                                                   |
| `generate_figma_design`        | Générer un design Figma depuis une description                               |

---

## Workflow complet — client veut un visuel custom

### Phase 1 — Setup Figma (Nicolas)

1. Créer un fichier Figma dédié client : `[Prénom] [Secteur] — Design`
2. Organiser en pages : `Design System`, `Pages`, `Composants`
3. Dans **Design System** :
   - Créer les variables de couleur : `primary`, `secondary`, `background`, `text`
   - Créer les variables de typo : `font-heading`, `font-body`
   - Ces noms DOIVENT matcher les CSS variables de `packages/design-tokens/`

### Phase 2 — Lire les tokens Figma et les mapper aux CSS variables

Quand Nicolas partage l'URL Figma, utiliser :

```
mcp__figma__get_variable_defs(fileKey, nodeId)
```

Mapper les variables Figma → `packages/design-tokens/tokens.css` :

```css
/* packages/design-tokens/tokens.css */
:root {
  /* Ces noms doivent matcher les variables Figma */
  --color-primary: /* valeur Figma */;
  --color-secondary: /* valeur Figma */;
  --color-background: /* valeur Figma */;
  --color-text: /* valeur Figma */;
  --font-heading: /* famille Figma */;
  --font-body: /* famille Figma */;
}
```

Dans `config/client.config.ts` du template client :

```ts
export const clientConfig = {
  theme: {
    primary: '#...', // depuis Figma
    secondary: '#...', // depuis Figma
    fontHeading: '...',
    fontBody: '...',
  },
};
```

### Phase 3 — Setup Code Connect (une fois, par composant UI)

Installer dans `packages/ui/` :

```bash
cd packages/ui
pnpm add -D @figma/code-connect
```

Créer un fichier `.figma.tsx` à côté de chaque composant partagé :

```tsx
// packages/ui/src/button.figma.tsx
import figma from '@figma/code-connect';
import { Button } from './button';

figma.connect(Button, 'https://www.figma.com/design/XXXX?node-id=XXX', {
  props: {
    variant: figma.enum('Variant', {
      default: 'default',
      primary: 'primary',
      destructive: 'destructive',
      outline: 'outline',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'default',
      lg: 'lg',
    }),
    label: figma.string('Label'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ variant, size, label, disabled }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      {label}
    </Button>
  ),
});
```

Publier vers Figma :

```bash
cd packages/ui
FIGMA_ACCESS_TOKEN=<token> npx figma connect publish
```

### Phase 4 — Implémenter le design

Quand Nicolas partage une URL Figma pour implémenter :

```
Extraire fileKey et nodeId depuis l'URL :
figma.com/design/<fileKey>/...?node-id=<nodeId>
nodeId : remplacer "-" par ":"
```

Utiliser `get_design_context` — cet outil est **toujours le premier appel** quand on implémente depuis un Figma :

```
mcp__figma__get_design_context(nodeId, fileKey)
```

Le résultat contient :

- Code de référence (adapter au projet, pas copier tel quel)
- Screenshot du design
- Suggestions Code Connect (si mappages configurés → retourne vrais composants)
- Design annotations du designer

**Règles d'adaptation du code retourné :**

1. Remplacer les hex hardcodés par les CSS variables (`--color-primary`)
2. Utiliser les composants `packages/ui/` à la place des éléments HTML bruts
3. Adapter au routing Next.js App Router (pas de `useState` côté serveur)
4. Vérifier dans `config/client.config.ts` pour les données client

---

## Conventions de nommage Figma ↔ Code

| Figma          | CSS Variable         | Tailwind                      |
| -------------- | -------------------- | ----------------------------- |
| `primary`      | `--color-primary`    | `text-primary` / `bg-primary` |
| `secondary`    | `--color-secondary`  | `text-secondary`              |
| `background`   | `--color-background` | `bg-background`               |
| `foreground`   | `--color-foreground` | `text-foreground`             |
| `muted`        | `--color-muted`      | `bg-muted`                    |
| `font-heading` | `--font-heading`     | `font-heading`                |
| `font-body`    | `--font-body`        | `font-sans`                   |

Ces noms sont les mêmes dans Figma, dans les CSS variables et dans Tailwind config.
**Ne jamais hardcoder une couleur hex dans le code — toujours passer par les variables.**

---

## Structure fichiers Code Connect

```
packages/ui/
├── src/
│   ├── button.tsx
│   ├── button.figma.tsx        ← Code Connect
│   ├── card.tsx
│   ├── card.figma.tsx          ← Code Connect
│   ├── input.tsx
│   ├── input.figma.tsx         ← Code Connect
│   └── ...
└── package.json
```

---

## Checklist — nouveau client avec design custom

- [ ] Fichier Figma créé et partagé avec Nicolas
- [ ] Variables Figma nommées selon la convention (primary, secondary, etc.)
- [ ] `get_variable_defs` → tokens mappés dans `design-tokens/tokens.css`
- [ ] `client.config.ts` mis à jour avec les couleurs/fonts
- [ ] Code Connect configuré pour les composants UI partagés
- [ ] `figma connect publish` exécuté
- [ ] `get_design_context` utilisé pour chaque section à implémenter
- [ ] Zéro couleur hex hardcodée dans le code client

---

## Note : ce qui est en place vs à faire

**Prêt maintenant :**

- MCP Figma configuré (get_design_context, get_variable_defs, etc.)
- Workflow documenté et intégré à Claude Code

**À faire quand packages/ui/ aura ses composants :**

- Installer `@figma/code-connect` dans packages/ui
- Créer les fichiers `.figma.tsx` pour chaque composant Shadcn/ui
- Publier les mappages : `figma connect publish`
- Tester le workflow complet sur un vrai client Figma
