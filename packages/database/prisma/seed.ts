import {
  PrismaClient,
  ServiceCategory,
  GalleryCategory,
  Role,
  AppointmentStatus,
} from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed initial — charge les données de démonstration pour le template coiffure.
 *
 * Exécution : pnpm --filter @marrynov/database db:seed
 *
 * Ce seed est idempotent : il utilise upsert pour éviter les doublons.
 * Les données correspondent à celles de salon.config.ts (Beauté Créole).
 */
async function main() {
  // Sécurité : interdire l'exécution en production
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Le seed ne peut pas être exécuté en production.');
    process.exit(1);
  }

  console.log('🌱 Seeding database...');

  // ── Admin (compte Google — n.marry90@gmail.com) ────────────────────────────
  // Pas de passwordHash : connexion via Google OAuth uniquement
  const admin = await prisma.user.upsert({
    where: { email: 'n.marry90@gmail.com' },
    update: { role: Role.ADMIN },
    create: {
      email: 'n.marry90@gmail.com',
      firstName: 'Nicolas',
      lastName: 'M.',
      role: Role.ADMIN,
      emailVerified: new Date(),
      phone: '0692 00 00 00',
    },
  });
  // L'Account Google sera créé automatiquement au premier login OAuth.
  // Ne PAS créer de faux Account ici — le providerAccountId doit correspondre
  // au vrai Google user ID, sinon next-auth refuse le lien (OAuthAccountNotLinked).
  console.log(`  ✓ Admin (Google): ${admin.email}`);

  // ── Stylistes (employés) ────────────────────────────────────────────────
  const stylists = [
    {
      email: 'marie-laure@beautecreole.re',
      firstName: 'Marie-Laure',
      lastName: 'B.',
      role: Role.EMPLOYEE as Role,
      bio: "Fondatrice et directrice artistique du salon, Marie-Laure est une coloriste passionnée avec plus de 15 ans d'expérience.",
      specialities: ['Balayage', 'Coloration', 'Mèches', 'Patine'],
      imageUrl:
        'https://images.unsplash.com/photo-1580618672591-3c0bfec7eaea?w=600&h=600&fit=crop&crop=faces',
      yearsExperience: 15,
      quote: 'La couleur est une émotion, pas juste une teinte.',
      instagram: 'https://instagram.com/marielaure.beautecreole',
    },
    {
      email: 'anais@beautecreole.re',
      firstName: 'Anaïs',
      lastName: 'D.',
      role: Role.EMPLOYEE as Role,
      bio: 'Spécialiste des soins capillaires profonds et du diagnostic personnalisé.',
      specialities: ['Soins Kératine', 'Hydratation', 'Diagnostic Capillaire', 'Botox Capillaire'],
      imageUrl:
        'https://images.unsplash.com/photo-1595163638528-f9c384758c2d?w=600&h=600&fit=crop&crop=faces',
      yearsExperience: 7,
      quote: 'Des cheveux en bonne santé sont la base de tout.',
    },
    {
      email: 'sandra@beautecreole.re',
      firstName: 'Sandra',
      lastName: 'K.',
      role: Role.EMPLOYEE as Role,
      bio: 'Artiste du tressage et des extensions, Sandra maîtrise toutes les techniques protectrices.',
      specialities: ['Extensions', 'Nattage', 'Tissage', 'Box Braids'],
      imageUrl:
        'https://images.unsplash.com/photo-1611432579699-484f7990b127?w=600&h=600&fit=crop&crop=faces',
      yearsExperience: 8,
      quote: "Chaque tresse raconte une histoire, chaque coiffure est une œuvre d'art.",
    },
    {
      email: 'fabrice@beautecreole.re',
      firstName: 'Fabrice',
      lastName: 'M.',
      role: Role.EMPLOYEE as Role,
      bio: 'Formé aux techniques de coupe les plus pointues et certifié en lissage brésilien et japonais.',
      specialities: ['Coupes', 'Lissage Brésilien', 'Lissage Japonais', 'Soins'],
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=faces',
      yearsExperience: 10,
      quote: "Un bon coiffeur écoute d'abord, coupe ensuite.",
      instagram: 'https://instagram.com/fabrice.beautecreole',
    },
  ];

  const employeePassword = await hash(process.env.SEED_EMPLOYEE_PASSWORD ?? 'Employee2026!', 12);
  const stylistMap: Record<string, string> = {};

  for (const s of stylists) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        ...s,
        passwordHash: employeePassword,
      },
    });
    stylistMap[s.firstName.toLowerCase().replace('ï', 'i')] = user.id;
    console.log(`  ✓ Styliste: ${user.firstName} ${user.lastName} (${user.email})`);
  }

  // ── Clients de démo ────────────────────────────────────────────────────────
  const clientPassword = await hash(process.env.SEED_CLIENT_PASSWORD ?? 'Client2026!', 12);

  const clients = [
    {
      email: 'marie.dubois@email.com',
      firstName: 'Marie',
      lastName: 'Dubois',
      phone: '0692 12 34 56',
    },
    {
      email: 'sophie.payet@email.com',
      firstName: 'Sophie',
      lastName: 'Payet',
      phone: '0693 45 67 89',
    },
    {
      email: 'camille.boyer@email.com',
      firstName: 'Camille',
      lastName: 'Boyer',
      phone: '0692 98 76 54',
    },
    {
      email: 'jessica.hoarau@email.com',
      firstName: 'Jessica',
      lastName: 'Hoarau',
      phone: '0693 11 22 33',
    },
    {
      email: 'nathalie.riviere@email.com',
      firstName: 'Nathalie',
      lastName: 'Rivière',
      phone: '0692 44 55 66',
    },
  ];

  const clientMap: Record<string, string> = {};
  for (const c of clients) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        ...c,
        passwordHash: clientPassword,
        role: Role.CLIENT,
        avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${c.firstName}+${c.lastName}&backgroundColor=8b2d5c&textColor=ffffff`,
      },
    });
    clientMap[c.firstName.toLowerCase()] = user.id;
    console.log(`  ✓ Client: ${user.firstName} ${user.lastName} (${user.email})`);
  }

  // ── Loyalty records ────────────────────────────────────────────────────────
  const loyaltyData = [
    { userId: clientMap.marie!, currentVisits: 6, totalVisits: 14, rewardsEarned: 1 },
    { userId: clientMap.sophie!, currentVisits: 3, totalVisits: 3, rewardsEarned: 0 },
    { userId: clientMap.camille!, currentVisits: 7, totalVisits: 15, rewardsEarned: 1 },
    { userId: clientMap.jessica!, currentVisits: 1, totalVisits: 1, rewardsEarned: 0 },
    { userId: clientMap.nathalie!, currentVisits: 4, totalVisits: 12, rewardsEarned: 1 },
  ];

  for (const l of loyaltyData) {
    await prisma.loyaltyRecord.upsert({
      where: { userId: l.userId },
      update: {},
      create: l,
    });
  }
  console.log('  ✓ Loyalty records créés');

  // ── Loyalty config ──────────────────────────────────────────────────────
  await prisma.loyaltyConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      targetVisits: 8,
      reward: 'réduction de 10% sur la prestation de votre choix',
      discount: '-10%',
    },
  });

  // ── Services ────────────────────────────────────────────────────────────
  const services = [
    {
      slug: 'coupe-brushing',
      name: 'Coupe & Brushing',
      description:
        'Diagnostic personnalisé, soin profond, coupe sur mesure et coiffage adapté à votre texture.',
      startingPrice: 4500,
      durationMin: 60,
      category: ServiceCategory.COUPE,
      featured: false,
      sortOrder: 1,
    },
    {
      slug: 'coupe-homme',
      name: 'Coupe Homme',
      description: 'Coupe tendance avec finitions au rasoir. Shampoing et coiffage inclus.',
      startingPrice: 2500,
      durationMin: 30,
      category: ServiceCategory.COUPE,
      featured: false,
      sortOrder: 2,
    },
    {
      slug: 'coupe-enfant',
      name: 'Coupe Enfant',
      description: 'Coupe adaptée aux plus jeunes dans une ambiance détendue et bienveillante.',
      startingPrice: 2000,
      durationMin: 30,
      category: ServiceCategory.COUPE,
      featured: false,
      sortOrder: 3,
    },
    {
      slug: 'balayage-signature',
      name: 'Balayage Signature',
      description:
        "Technique d'éclaircissement sur mesure respectueuse de la fibre capillaire, patine et soin inclus.",
      startingPrice: 12000,
      durationMin: 180,
      category: ServiceCategory.COLORATION,
      featured: true,
      badge: 'Le plus demandé',
      sortOrder: 4,
    },
    {
      slug: 'couleur-complete',
      name: 'Couleur Complète',
      description:
        'Coloration racines aux pointes avec produits premium sans ammoniaque. Soin post-couleur inclus.',
      startingPrice: 8500,
      durationMin: 120,
      category: ServiceCategory.COLORATION,
      featured: false,
      sortOrder: 5,
    },
    {
      slug: 'meches-highlights',
      name: 'Mèches & Highlights',
      description:
        'Mèches fines ou épaisses pour un effet lumineux et dimensionnel. Technique au papier aluminium.',
      startingPrice: 9500,
      durationMin: 150,
      category: ServiceCategory.COLORATION,
      featured: false,
      sortOrder: 6,
    },
    {
      slug: 'soin-keratine-profond',
      name: 'Soin Kératine Profond',
      description:
        'Traitement reconstructeur intense pour cheveux texturés, apporte brillance, souplesse et hydratation.',
      startingPrice: 8500,
      durationMin: 120,
      category: ServiceCategory.SOIN,
      featured: false,
      sortOrder: 7,
    },
    {
      slug: 'soin-botox-capillaire',
      name: 'Soin Botox Capillaire',
      description:
        "Traitement anti-âge capillaire. Comble les fibres endommagées, lisse et redonne de l'éclat.",
      startingPrice: 9500,
      durationMin: 90,
      category: ServiceCategory.SOIN,
      featured: false,
      sortOrder: 8,
    },
    {
      slug: 'lissage-bresilien',
      name: 'Lissage Brésilien',
      description:
        'Lissage semi-permanent à la kératine. Élimine les frisottis et assouplit durablement la fibre.',
      startingPrice: 15000,
      durationMin: 180,
      category: ServiceCategory.LISSAGE,
      featured: false,
      badge: 'Résultat 3 mois',
      sortOrder: 9,
    },
    {
      slug: 'lissage-japonais',
      name: 'Lissage Japonais',
      description:
        'Lissage permanent restructurant. Transforme la fibre de manière définitive sur les longueurs traitées.',
      startingPrice: 20000,
      durationMin: 240,
      category: ServiceCategory.LISSAGE,
      featured: false,
      badge: 'Premium',
      sortOrder: 10,
    },
    {
      slug: 'extensions-pose-complete',
      name: 'Extensions — Pose Complète',
      description:
        'Pose complète en cheveux naturels Remy Hair. Méthode à chaud, à froid ou tissage selon la texture.',
      startingPrice: 25000,
      durationMin: 240,
      category: ServiceCategory.EXTENSIONS,
      featured: false,
      sortOrder: 11,
    },
    {
      slug: 'tresses-protectrices',
      name: 'Tresses Protectrices',
      description:
        'Box braids, vanilles, cornrows ou tresses collées. Coiffure protectrice durable et stylée.',
      startingPrice: 8000,
      durationMin: 180,
      category: ServiceCategory.EXTENSIONS,
      featured: false,
      sortOrder: 12,
    },
  ];

  const serviceImages: Record<string, string> = {
    'coupe-brushing':
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    'coupe-homme':
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop',
    'coupe-enfant':
      'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=800&h=600&fit=crop',
    'balayage-signature':
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop',
    'couleur-complete':
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=600&fit=crop',
    'meches-highlights':
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=600&fit=crop',
    'soin-keratine-profond':
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
    'soin-botox-capillaire':
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&h=600&fit=crop',
    'lissage-bresilien':
      'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&h=600&fit=crop',
    'lissage-japonais':
      'https://images.unsplash.com/photo-1580618672591-3c0bfec7eaea?w=800&h=600&fit=crop',
    'extensions-pose-complete':
      'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&h=600&fit=crop',
    'tresses-protectrices':
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&h=600&fit=crop',
  };

  const serviceMap: Record<string, string> = {};
  for (const s of services) {
    const svc = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        ...s,
        imageUrl:
          serviceImages[s.slug] ??
          `https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop`,
        imageAlt: s.name,
        active: true,
      },
    });
    serviceMap[s.slug] = svc.id;
  }
  console.log(`  ✓ ${services.length} services créés`);

  // ── Products ────────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Huile de Ricin Premium',
      brand: 'Beauté Créole',
      description: 'Huile de ricin pressée à froid 100% bio.',
      price: 1800,
      badge: 'Best-seller',
    },
    {
      name: 'Masque Kératine Intense',
      brand: 'Kérastase',
      description: 'Masque reconstructeur pour cheveux très abîmés.',
      price: 3200,
    },
    {
      name: 'Shampoing Sans Sulfate',
      brand: 'Beauté Créole',
      description: 'Nettoyant doux qui préserve les huiles naturelles.',
      price: 1500,
    },
    {
      name: 'Sérum Pointes Sèches',
      brand: 'Moroccanoil',
      description: 'Sérum réparateur instantané pour pointes sèches et fourchues.',
      price: 2800,
    },
    {
      name: 'Crème Coiffante Boucles',
      brand: 'Cantu',
      description:
        'Crème définissante pour boucles et ondulations. Tenue souple sans effet carton.',
      price: 1200,
    },
    {
      name: 'Huile Protectrice Chaleur',
      brand: 'GHD',
      description: "Spray thermoprotecteur professionnel. Protège les cheveux jusqu'à 220°C.",
      price: 2200,
      badge: 'Recommandé',
    },
  ];

  const productImages = [
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop', // Huile
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop', // Masque
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop', // Shampoing
    'https://images.unsplash.com/photo-1597354984706-fac992d9306f?w=400&h=400&fit=crop', // Sérum
    'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=400&h=400&fit=crop', // Crème boucles
    'https://images.unsplash.com/photo-1522338242992-e1a54571a17b?w=400&h=400&fit=crop', // Spray chaleur
  ];

  for (const [i, p] of products.entries()) {
    await prisma.product.upsert({
      where: { id: `product-${i + 1}` },
      update: {},
      create: {
        id: `product-${i + 1}`,
        ...p,
        imageUrl: productImages[i] ?? productImages[0],
        imageAlt: p.name,
        sortOrder: i,
        active: true,
      },
    });
  }
  console.log(`  ✓ ${products.length} produits créés`);

  // ── Event Packages ──────────────────────────────────────────────────────
  const packages = [
    {
      name: 'Forfait Mariée',
      description: 'Le jour J mérite une coiffure parfaite.',
      price: 35000,
      features: [
        'Essai coiffure (1h)',
        'Coiffure jour J',
        'Retouches sur place',
        'Kit retouche offert',
      ],
      featured: true,
      badge: 'Le plus choisi',
    },
    {
      name: "Forfait Invitée d'Honneur",
      description: 'Sublimez-vous pour accompagner la mariée.',
      price: 15000,
      features: ['Coiffure événement', 'Accessoires inclus', 'Retouches express'],
      featured: false,
    },
    {
      name: 'Forfait Shooting Photo',
      description: 'Préparez-vous pour vos séances photo.',
      price: 20000,
      features: [
        'Consultation style',
        'Coiffure complète',
        'Retouches entre prises',
        'Produits coiffants offerts',
      ],
      featured: false,
    },
  ];

  for (const [i, pkg] of packages.entries()) {
    await prisma.eventPackage.upsert({
      where: { id: `package-${i + 1}` },
      update: {},
      create: {
        id: `package-${i + 1}`,
        ...pkg,
        sortOrder: i,
        active: true,
      },
    });
  }
  console.log(`  ✓ ${packages.length} forfaits événements créés`);

  // ── Gallery Items ───────────────────────────────────────────────────────
  const gallery = [
    {
      title: 'Balayage Caramel',
      category: GalleryCategory.BALAYAGE,
      description: 'Nuances chaudes et lumineuses sur boucles naturelles.',
    },
    {
      title: 'Balayage Miel Doré',
      category: GalleryCategory.BALAYAGE,
      description: 'Éclaircissement progressif pour un effet soleil naturel.',
    },
    {
      title: 'Cuivre Intense',
      category: GalleryCategory.COULEUR,
      description: 'Couleur complète vibrante et profonde.',
    },
    {
      title: 'Bordeaux Profond',
      category: GalleryCategory.COULEUR,
      description: 'Couleur riche et élégante.',
    },
    {
      title: 'Coupe Courte Afro',
      category: GalleryCategory.COUPE,
      description: 'Coupe géométrique précise valorisant le volume naturel.',
    },
    {
      title: 'Dégradé Sculptural',
      category: GalleryCategory.COUPE,
      description: 'Coupe homme avec finitions au rasoir.',
    },
    {
      title: 'Carré Plongeant',
      category: GalleryCategory.COUPE,
      description: 'Lignes nettes et mouvement naturel.',
    },
    {
      title: 'Lissage Brésilien',
      category: GalleryCategory.LISSAGE,
      description: 'Transformation spectaculaire, cheveux souples et brillants.',
    },
    {
      title: 'Lissage Japonais',
      category: GalleryCategory.LISSAGE,
      description: 'Lissage permanent ultra-lisse, brillance miroir.',
    },
    {
      title: 'Extensions XXL',
      category: GalleryCategory.EXTENSIONS,
      description: 'Pose invisible en cheveux naturels.',
    },
    {
      title: 'Box Braids Dorées',
      category: GalleryCategory.EXTENSIONS,
      description: 'Tresses protectrices agrémentées de fils dorés.',
    },
    {
      title: 'Cornrows Design',
      category: GalleryCategory.EXTENSIONS,
      description: 'Motifs géométriques élaborés.',
    },
    {
      title: 'Chignon Mariée',
      category: GalleryCategory.MARIAGE,
      description: 'Chignon romantique orné de fleurs fraîches.',
    },
    {
      title: 'Tresse Couronne',
      category: GalleryCategory.MARIAGE,
      description: 'Coiffure bohème-chic.',
    },
    {
      title: 'Kératine Profond',
      category: GalleryCategory.SOIN,
      description: 'Cheveux revitalisés, brillance et souplesse retrouvées.',
    },
    {
      title: 'Hydratation Intense',
      category: GalleryCategory.SOIN,
      description: 'Boucles définies et nourries en profondeur.',
    },
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop', // Balayage Caramel
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=1000&fit=crop', // Balayage Miel
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=600&fit=crop', // Cuivre Intense
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=800&fit=crop', // Bordeaux Profond
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&h=600&fit=crop', // Coupe Courte Afro
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=1000&fit=crop', // Dégradé Sculptural
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=800&fit=crop', // Carré Plongeant
    'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&h=600&fit=crop', // Lissage Brésilien
    'https://images.unsplash.com/photo-1580618672591-3c0bfec7eaea?w=800&h=1000&fit=crop', // Lissage Japonais
    'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&h=800&fit=crop', // Extensions XXL
    'https://images.unsplash.com/photo-1611432579699-484f7990b127?w=800&h=600&fit=crop', // Box Braids Dorées
    'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800&h=1000&fit=crop', // Cornrows Design
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop', // Chignon Mariée
    'https://images.unsplash.com/photo-1595163638528-f9c384758c2d?w=800&h=600&fit=crop', // Tresse Couronne
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=1000&fit=crop', // Kératine Profond
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&h=800&fit=crop', // Hydratation Intense
  ];

  for (const [i, item] of gallery.entries()) {
    await prisma.galleryItem.upsert({
      where: { id: `gallery-${i + 1}` },
      update: {},
      create: {
        id: `gallery-${i + 1}`,
        imageUrl: galleryImages[i] ?? galleryImages[0],
        imageAlt: item.title,
        ...item,
        sortOrder: i,
        active: true,
      },
    });
  }
  console.log(`  ✓ ${gallery.length} éléments galerie créés`);

  // ── Schedule (horaires) ─────────────────────────────────────────────────
  const schedule = [
    { dayOfWeek: 0, openTime: null, closeTime: null }, // Lundi : fermé
    { dayOfWeek: 1, openTime: '09:00', closeTime: '18:30' }, // Mardi
    { dayOfWeek: 2, openTime: '09:00', closeTime: '18:30' }, // Mercredi
    { dayOfWeek: 3, openTime: '09:00', closeTime: '18:30' }, // Jeudi
    { dayOfWeek: 4, openTime: '09:00', closeTime: '18:30' }, // Vendredi
    { dayOfWeek: 5, openTime: '08:30', closeTime: '17:00' }, // Samedi
    { dayOfWeek: 6, openTime: null, closeTime: null }, // Dimanche : fermé
  ];

  for (const slot of schedule) {
    await prisma.scheduleSlot.upsert({
      where: { dayOfWeek: slot.dayOfWeek },
      update: {},
      create: slot,
    });
  }
  console.log('  ✓ Horaires configurés');

  // ── Promo offre du mois ─────────────────────────────────────────────────
  await prisma.promoOffer.upsert({
    where: { id: 'promo-mensuelle' },
    update: {},
    create: {
      id: 'promo-mensuelle',
      badge: 'OFFRE DU MOIS',
      title: 'Soin profond offert',
      description: "Pour toute réservation d'une prestation technique (couleur, balayage) en mars.",
      ctaLabel: 'En profiter',
      ctaHref: '/reserver',
      active: true,
    },
  });
  console.log('  ✓ Promo du mois créée');

  // ── Salon Settings ──────────────────────────────────────────────────────
  const settings: Record<string, unknown> = {
    salon_name: 'Beauté Créole',
    salon_address: '12 rue des Flamboyants',
    salon_city: 'Saint-Denis',
    salon_postal_code: '97400',
    salon_phone: '0262 12 34 56',
    salon_email: 'contact@beautecreole.re',
    salon_instagram: 'https://instagram.com/beautecreole',
    salon_facebook: 'https://facebook.com/beautecreole',
    salon_tiktok: '',
    salon_whatsapp: '262692123456',
    'salon.tagline': 'Expertise Afro-Créole, résultats haut de gamme à La Réunion.',
    'salon.description':
      'Le salon premium de référence à La Réunion pour toutes les textures de cheveux.',
    'loyalty.enabled': true,
    'booking.cancelDeadlineHours': 24,
    'booking.noShowPenaltyPercent': 50,
    'booking.maxDurationMin': 420,
    'booking.slotIntervalMin': 30,
    'notifications.smsEnabled': false,
    'notifications.emailEnabled': true,
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.salonSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }
  console.log('  ✓ Paramètres salon configurés');

  // ══════════════════════════════════════════════════════════════════════════
  // ── DONNÉES DE TEST — RDV, Reviews, Notifications ───────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // Helper : date relative à aujourd'hui
  function relativeDate(daysFromToday: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // ── RDV passés (COMPLETED) ──────────────────────────────────────────────
  const pastAppointments = [
    {
      id: 'apt-past-1',
      date: relativeDate(-14),
      startTime: '09:30',
      endTime: '10:30',
      totalPrice: 4500,
      status: AppointmentStatus.COMPLETED,
      clientId: clientMap.marie!,
      stylistId: stylistMap['marie-laure']!,
      serviceSlug: 'coupe-brushing',
      servicePrice: 4500,
    },
    {
      id: 'apt-past-2',
      date: relativeDate(-10),
      startTime: '14:00',
      endTime: '17:00',
      totalPrice: 12000,
      status: AppointmentStatus.COMPLETED,
      clientId: clientMap.sophie!,
      stylistId: stylistMap['marie-laure']!,
      serviceSlug: 'balayage-signature',
      servicePrice: 12000,
    },
    {
      id: 'apt-past-3',
      date: relativeDate(-7),
      startTime: '10:00',
      endTime: '12:00',
      totalPrice: 8500,
      status: AppointmentStatus.COMPLETED,
      clientId: clientMap.camille!,
      stylistId: stylistMap.anais!,
      serviceSlug: 'soin-keratine-profond',
      servicePrice: 8500,
    },
    {
      id: 'apt-past-4',
      date: relativeDate(-5),
      startTime: '11:00',
      endTime: '14:00',
      totalPrice: 15000,
      status: AppointmentStatus.COMPLETED,
      clientId: clientMap.nathalie!,
      stylistId: stylistMap.fabrice!,
      serviceSlug: 'lissage-bresilien',
      servicePrice: 15000,
    },
    {
      id: 'apt-past-5',
      date: relativeDate(-3),
      startTime: '09:00',
      endTime: '09:30',
      totalPrice: 2500,
      status: AppointmentStatus.COMPLETED,
      clientId: clientMap.jessica!,
      stylistId: stylistMap.fabrice!,
      serviceSlug: 'coupe-homme',
      servicePrice: 2500,
      notes: 'Client satisfait, souhaite revenir pour un lissage',
    },
    {
      id: 'apt-past-6',
      date: relativeDate(-2),
      startTime: '15:00',
      endTime: '18:00',
      totalPrice: 8000,
      status: AppointmentStatus.COMPLETED,
      clientId: clientMap.marie!,
      stylistId: stylistMap.sandra!,
      serviceSlug: 'tresses-protectrices',
      servicePrice: 8000,
    },
    // Un NO_SHOW
    {
      id: 'apt-noshow-1',
      date: relativeDate(-6),
      startTime: '10:00',
      endTime: '12:00',
      totalPrice: 8500,
      status: AppointmentStatus.NO_SHOW,
      clientId: clientMap.jessica!,
      stylistId: stylistMap.anais!,
      serviceSlug: 'couleur-complete',
      servicePrice: 8500,
    },
    // Un CANCELLED
    {
      id: 'apt-cancel-1',
      date: relativeDate(-4),
      startTime: '14:00',
      endTime: '16:30',
      totalPrice: 9500,
      status: AppointmentStatus.CANCELLED,
      clientId: clientMap.sophie!,
      stylistId: stylistMap['marie-laure']!,
      serviceSlug: 'meches-highlights',
      servicePrice: 9500,
      cancelReason: 'Empêchement personnel',
    },
  ];

  for (const apt of pastAppointments) {
    const { serviceSlug, servicePrice, ...aptData } = apt;
    await prisma.appointment.upsert({
      where: { id: apt.id },
      update: {},
      create: {
        ...aptData,
        services: {
          create: {
            serviceId: serviceMap[serviceSlug]!,
            priceAtBooking: servicePrice,
          },
        },
      },
    });
  }
  console.log(`  ✓ ${pastAppointments.length} RDV passés créés`);

  // ── RDV d'aujourd'hui ────────────────────────────────────────────────────
  const todayAppointments = [
    {
      id: 'apt-today-1',
      date: relativeDate(0),
      startTime: '09:00',
      endTime: '10:00',
      totalPrice: 4500,
      status: AppointmentStatus.CONFIRMED,
      clientId: clientMap.marie!,
      stylistId: stylistMap['marie-laure']!,
      serviceSlug: 'coupe-brushing',
      servicePrice: 4500,
    },
    {
      id: 'apt-today-2',
      date: relativeDate(0),
      startTime: '10:30',
      endTime: '12:00',
      totalPrice: 9500,
      status: AppointmentStatus.PENDING,
      clientId: clientMap.sophie!,
      stylistId: stylistMap.anais!,
      serviceSlug: 'soin-botox-capillaire',
      servicePrice: 9500,
    },
    {
      id: 'apt-today-3',
      date: relativeDate(0),
      startTime: '14:00',
      endTime: '17:00',
      totalPrice: 12000,
      status: AppointmentStatus.CONFIRMED,
      clientId: clientMap.camille!,
      stylistId: stylistMap['marie-laure']!,
      serviceSlug: 'balayage-signature',
      servicePrice: 12000,
    },
    {
      id: 'apt-today-4',
      date: relativeDate(0),
      startTime: '15:00',
      endTime: '15:30',
      totalPrice: 2000,
      status: AppointmentStatus.PENDING,
      clientId: clientMap.nathalie!,
      stylistId: stylistMap.fabrice!,
      serviceSlug: 'coupe-enfant',
      servicePrice: 2000,
      notes: 'Coupe pour son fils de 8 ans',
    },
    // Walk-in d'aujourd'hui
    {
      id: 'apt-today-walkin',
      date: relativeDate(0),
      startTime: '11:00',
      endTime: '11:30',
      totalPrice: 2500,
      status: AppointmentStatus.COMPLETED,
      clientId: clientMap.jessica!,
      stylistId: stylistMap.fabrice!,
      serviceSlug: 'coupe-homme',
      servicePrice: 2500,
      isWalkIn: true,
    },
  ];

  for (const apt of todayAppointments) {
    const { serviceSlug, servicePrice, ...aptData } = apt;
    await prisma.appointment.upsert({
      where: { id: apt.id },
      update: {},
      create: {
        ...aptData,
        services: {
          create: {
            serviceId: serviceMap[serviceSlug]!,
            priceAtBooking: servicePrice,
          },
        },
      },
    });
  }
  console.log(`  ✓ ${todayAppointments.length} RDV aujourd'hui créés`);

  // ── RDV futurs ──────────────────────────────────────────────────────────
  const futureAppointments = [
    {
      id: 'apt-future-1',
      date: relativeDate(1),
      startTime: '09:30',
      endTime: '11:30',
      totalPrice: 8500,
      status: AppointmentStatus.CONFIRMED,
      clientId: clientMap.nathalie!,
      stylistId: stylistMap.anais!,
      serviceSlug: 'soin-keratine-profond',
      servicePrice: 8500,
    },
    {
      id: 'apt-future-2',
      date: relativeDate(2),
      startTime: '10:00',
      endTime: '14:00',
      totalPrice: 25000,
      status: AppointmentStatus.CONFIRMED,
      clientId: clientMap.camille!,
      stylistId: stylistMap.sandra!,
      serviceSlug: 'extensions-pose-complete',
      servicePrice: 25000,
    },
    {
      id: 'apt-future-3',
      date: relativeDate(3),
      startTime: '14:00',
      endTime: '17:00',
      totalPrice: 12000,
      status: AppointmentStatus.PENDING,
      clientId: clientMap.marie!,
      stylistId: stylistMap['marie-laure']!,
      serviceSlug: 'balayage-signature',
      servicePrice: 12000,
    },
    {
      id: 'apt-future-4',
      date: relativeDate(5),
      startTime: '09:00',
      endTime: '13:00',
      totalPrice: 20000,
      status: AppointmentStatus.CONFIRMED,
      clientId: clientMap.sophie!,
      stylistId: stylistMap.fabrice!,
      serviceSlug: 'lissage-japonais',
      servicePrice: 20000,
    },
    {
      id: 'apt-future-5',
      date: relativeDate(7),
      startTime: '11:00',
      endTime: '14:00',
      totalPrice: 8000,
      status: AppointmentStatus.PENDING,
      clientId: clientMap.jessica!,
      stylistId: stylistMap.sandra!,
      serviceSlug: 'tresses-protectrices',
      servicePrice: 8000,
    },
  ];

  for (const apt of futureAppointments) {
    const { serviceSlug, servicePrice, ...aptData } = apt;
    await prisma.appointment.upsert({
      where: { id: apt.id },
      update: {},
      create: {
        ...aptData,
        services: {
          create: {
            serviceId: serviceMap[serviceSlug]!,
            priceAtBooking: servicePrice,
          },
        },
      },
    });
  }
  console.log(`  ✓ ${futureAppointments.length} RDV futurs créés`);

  // ── Reviews (sur les RDV COMPLETED) ─────────────────────────────────────
  const reviews = [
    {
      id: 'review-1',
      rating: 5,
      comment:
        "Marie-Laure est incroyable ! Ma coupe est exactement ce que je voulais. Le salon est magnifique et l'accueil très chaleureux.",
      visible: true,
      appointmentId: 'apt-past-1',
      authorId: clientMap.marie!,
    },
    {
      id: 'review-2',
      rating: 5,
      comment:
        'Mon balayage est sublime ! Les couleurs sont naturelles et lumineuses. Je recommande à 100%. Merci Marie-Laure !',
      visible: true,
      appointmentId: 'apt-past-2',
      authorId: clientMap.sophie!,
    },
    {
      id: 'review-3',
      rating: 4,
      comment:
        "Très bon soin kératine, mes cheveux sont doux et brillants. Seul petit bémol, un peu d'attente à l'arrivée.",
      visible: true,
      appointmentId: 'apt-past-3',
      authorId: clientMap.camille!,
    },
    {
      id: 'review-4',
      rating: 5,
      comment:
        "Fabrice est un artiste du lissage ! Résultat impeccable, mes cheveux n'ont jamais été aussi beaux. Je reviendrai c'est sûr.",
      visible: true,
      appointmentId: 'apt-past-4',
      authorId: clientMap.nathalie!,
    },
    {
      id: 'review-5',
      rating: 4,
      comment:
        "Bonne coupe rapide et efficace. Fabrice est sympa et à l'écoute. Rapport qualité-prix top.",
      visible: true,
      appointmentId: 'apt-past-5',
      authorId: clientMap.jessica!,
    },
    {
      id: 'review-6',
      rating: 5,
      comment:
        'Sandra est la reine des tresses ! Mes box braids sont parfaites. Patiente, minutieuse et de bon conseil. Merci !',
      visible: true,
      appointmentId: 'apt-past-6',
      authorId: clientMap.marie!,
    },
  ];

  for (const r of reviews) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: {},
      create: {
        ...r,
        createdAt: relativeDate(-Math.floor(Math.random() * 14)),
      },
    });
  }
  console.log(`  ✓ ${reviews.length} avis clients créés`);

  // ══════════════════════════════════════════════════════════════════════════

  console.log('\n✅ Seed terminé avec succès !');
  const seedEmployeePwd = process.env.SEED_EMPLOYEE_PASSWORD ?? 'Employee2026!';
  const seedClientPwd = process.env.SEED_CLIENT_PASSWORD ?? 'Client2026!';
  console.log('\n📋 Comptes de test :');
  console.log('  Admin    : n.marry90@gmail.com (Google OAuth — pas de mot de passe)');
  console.log(`  Styliste : marie-laure@beautecreole.re / ${seedEmployeePwd}`);
  console.log(`  Styliste : anais@beautecreole.re / ${seedEmployeePwd}`);
  console.log(`  Styliste : sandra@beautecreole.re / ${seedEmployeePwd}`);
  console.log(`  Styliste : fabrice@beautecreole.re / ${seedEmployeePwd}`);
  console.log(`  Client   : marie.dubois@email.com / ${seedClientPwd}`);
  console.log(`  Client   : sophie.payet@email.com / ${seedClientPwd}`);
  console.log(`  Client   : camille.boyer@email.com / ${seedClientPwd}`);
  console.log(`  Client   : jessica.hoarau@email.com / ${seedClientPwd}`);
  console.log(`  Client   : nathalie.riviere@email.com / ${seedClientPwd}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
