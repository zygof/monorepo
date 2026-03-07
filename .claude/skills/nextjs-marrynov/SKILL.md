---
name: nextjs-marrynov
description: Activée automatiquement pour toute tâche de développement dans les apps Next.js du monorepo MARRYNOV. Contient les conventions, patterns et anti-patterns spécifiques au projet.
---

# Skill — Conventions Next.js 15 MARRYNOV

## Structure d'une app

```
apps/[template]/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   └── layout.tsx
│   ├── api/
│   │   └── [...route]/route.ts
│   ├── layout.tsx        — RootLayout avec providers
│   └── page.tsx
├── components/
│   ├── ui/               — réexports depuis @marrynov/ui
│   └── [feature]/        — composants métier
├── hooks/                — custom hooks (prefix use-)
├── lib/
│   ├── auth.ts           — config next-auth
│   ├── db.ts             — instance Prisma
│   ├── stripe.ts         — instance Stripe
│   └── utils.ts          — cn() et helpers
├── config/
│   └── client.config.ts  — SEUL fichier modifié par client
└── types/
    └── index.ts
```

## Patterns obligatoires

### Server Components par défaut

Utiliser des Server Components sauf si :

- Besoin de state React (useState, useReducer)
- Besoin d'événements browser (onClick, onChange)
- Besoin de hooks (useEffect, useContext)

### Fetching de données

```typescript
// BIEN — Server Component avec fetch direct
async function ProductList() {
  const products = await db.product.findMany()
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}

// BIEN — avec cache et revalidation
const getProducts = cache(async () => {
  return db.product.findMany()
})
```

### Server Actions

```typescript
'use server';
import { revalidatePath } from 'next/cache';

export async function createOrder(data: FormData) {
  const validated = orderSchema.parse(Object.fromEntries(data));
  await db.order.create({ data: validated });
  revalidatePath('/commandes');
}
```

### Gestion d'erreurs

- Toujours un error.tsx par segment de route critique
- Toujours un loading.tsx pour les pages avec data fetching
- Utiliser Sentry pour capturer les erreurs inattendues

## Anti-patterns à éviter

- useEffect pour du data fetching (utiliser Server Components)
- "use client" en haut de layout (contaminerait tout l'arbre)
- Appels API dans des composants client (passer par Server Actions ou route handlers)
- any dans TypeScript
- Hardcoder des URLs (utiliser config/client.config.ts)

## Design tokens (packages/design-tokens)

```css
/* Variables disponibles dans tout le projet */
--color-primary
--color-primary-foreground
--color-secondary
--color-accent
--font-heading
--font-body
--radius-sm / --radius-md / --radius-lg
--shadow-sm / --shadow-md / --shadow-lg
```
