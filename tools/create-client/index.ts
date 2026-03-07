#!/usr/bin/env ts-node
/**
 * MARRYNOV — Script d'initialisation d'un projet client
 * Usage: npx ts-node tools/create-client/index.ts --slug jean-pizza --template pizza --name "Jean's Pizza"
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface Args {
  slug: string;
  template: string;
  name: string;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Partial<Args> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '') as keyof Args;
    parsed[key] = args[i + 1];
  }

  const required: (keyof Args)[] = ['slug', 'template', 'name'];
  for (const key of required) {
    if (!parsed[key]) {
      console.error(`Paramètre manquant : --${key}`);
      process.exit(1);
    }
  }

  const validTemplates = ['pizza', 'coiffure', 'restaurant', 'location-voiture', 'boutique'];
  if (!validTemplates.includes(parsed.template!)) {
    console.error(`Template invalide. Valeurs acceptées : ${validTemplates.join(', ')}`);
    process.exit(1);
  }

  return parsed as Args;
}

function run(cmd: string, cwd?: string) {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

async function main() {
  const { slug, template, name } = parseArgs();

  const monorepoRoot = path.resolve(__dirname, '../..');
  const clientsDir = path.resolve(process.env.HOME ?? '/home/zygof', 'MARRYNOV/clients');
  const templateDir = path.join(monorepoRoot, 'apps', `template-${template}`);
  const clientDir = path.join(clientsDir, `client-${slug}`);

  console.log(`\n=== Création du projet client : ${name} (${slug}) ===\n`);

  // 1. Vérifier que le template existe
  if (!fs.existsSync(templateDir)) {
    console.error(`Template introuvable : ${templateDir}`);
    process.exit(1);
  }

  // 2. Vérifier que le client n'existe pas déjà
  if (fs.existsSync(clientDir)) {
    console.error(`Le client existe déjà : ${clientDir}`);
    process.exit(1);
  }

  // 3. Créer le dossier client
  fs.mkdirSync(clientDir, { recursive: true });

  // 4. Copier le template
  run(`cp -r ${templateDir}/. ${clientDir}/`);
  console.log(`Template copié depuis apps/template-${template}`);

  // 5. Mettre à jour le package.json du client
  const pkgPath = path.join(clientDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.name = `client-${slug}`;
    pkg.description = `Projet MARRYNOV — ${name}`;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('package.json mis à jour');
  }

  // 6. Créer le fichier config/client.config.ts
  const configDir = path.join(clientDir, 'config');
  fs.mkdirSync(configDir, { recursive: true });

  const configContent = `// Configuration client — ${name}
// Ce fichier est le SEUL fichier à modifier pour personnaliser ce projet.
// Généré automatiquement le ${new Date().toLocaleDateString('fr-FR')}

export const clientConfig = {
  name: "${name}",
  slug: "${slug}",
  template: "${template}",
  primaryColor: "#2563EB",
  secondaryColor: "#1E293B",
  fontHeading: "Playfair Display",
  fontBody: "Inter",
  logo: "/logo.png",
  address: "Adresse à renseigner, La Réunion",
  phone: "0262 XX XX XX",
  email: "contact@${slug}.re",
  website: "https://${slug}.marrynov.re",
  social: {
    facebook: "",
    instagram: "",
  },
  stripe: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_KEY ?? "",
  },
} as const

export type ClientConfig = typeof clientConfig
`;
  fs.writeFileSync(path.join(configDir, 'client.config.ts'), configContent);
  console.log('config/client.config.ts créé');

  // 7. Créer le .env.example
  const envExample = `# ${name} — Variables d'environnement
# Copier ce fichier en .env.local et remplir les valeurs

# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/${slug.replace('-', '_')}_db"

# Auth
NEXTAUTH_SECRET="générer-avec-openssl-rand-base64-32"
NEXTAUTH_URL="https://${slug}.marrynov.re"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# Monitoring
SENTRY_DSN="https://...@sentry.io/..."
NEXT_PUBLIC_GA_ID="G-..."
`;
  fs.writeFileSync(path.join(clientDir, '.env.example'), envExample);
  console.log('.env.example créé');

  // 8. Init git
  run('git init', clientDir);
  run('git add .', clientDir);
  run(`git commit -m "feat(init): initialisation projet ${name}"`, clientDir);
  console.log('Repository Git initialisé');

  console.log(`
=== Projet client créé avec succès ===

  Client    : ${name}
  Slug      : ${slug}
  Template  : ${template}
  Dossier   : ${clientDir}
  URL démo  : https://${slug}.marrynov.re

Prochaines étapes :
  1. Personnaliser config/client.config.ts
  2. Ajouter les assets (logo, images)
  3. Créer le repo GitHub : github.com/marrynov/client-${slug}
  4. Configurer les variables d'environnement dans Dokploy
  5. Déployer la démo : /deploy

`);
}

main().catch(console.error);
