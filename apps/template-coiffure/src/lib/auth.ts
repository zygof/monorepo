import NextAuth, { type NextAuthResult } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { db } from '@marrynov/database';

/**
 * Configuration next-auth v5 — source unique pour l'authentification.
 *
 * Providers :
 *   - Credentials : email + mot de passe (bcrypt)
 *   - Google OAuth : connexion rapide (optionnel, activé si les env vars sont présentes)
 *
 * Session : JWT (pas de session DB — plus léger, compatible edge)
 * Adapter : Prisma (pour la persistence des comptes OAuth)
 */
const nextAuth: NextAuthResult = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 /* 7 jours */ },

  pages: {
    signIn: '/', // On utilise le modal, pas une page dédiée
    error: '/',
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.avatarUrl,
        };
      },
    }),

    // Google OAuth — activé uniquement si les env vars sont présentes
    // allowDangerousEmailAccountLinking : on fait confiance à Google pour la
    // vérification d'email → permet de lier un compte Google à un User existant
    // (ex: créé par seed ou par credentials) sans blocage OAuthAccountNotLinked.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // Linking auto uniquement pour les clients — les comptes staff/admin
            // ne peuvent pas être liés automatiquement (vérification dans signIn callback)
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Premier login : enrichir le token avec les données user
      if (user) {
        const dbUser = await db.user.findUnique({
          where: { email: user.email! },
          select: { id: true, role: true, firstName: true, lastName: true },
        });

        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
        }
      }

      // Mise à jour de session (ex: après modification du profil)
      if (trigger === 'update' && session) {
        if (session.firstName) token.firstName = session.firstName;
        if (session.lastName) token.lastName = session.lastName;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      // Pour OAuth : créer ou lier le profil User si nécessaire
      if (account?.provider === 'google' && user.email) {
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
          select: { role: true },
        });

        if (existingUser) {
          // Bloquer le linking automatique pour les comptes staff/admin
          // → ils doivent se connecter via credentials
          if (existingUser.role === 'EMPLOYEE' || existingUser.role === 'ADMIN') {
            // Vérifier si ce compte Google est déjà lié (liaison existante = OK)
            const linkedAccount = await db.account.findFirst({
              where: { userId: user.id, provider: 'google' },
            });
            if (!linkedAccount) {
              // Pas encore lié → bloquer le linking automatique
              return false;
            }
          }
        } else {
          // Créer le user à partir des infos Google
          const [firstName = '', ...rest] = (user.name ?? '').split(' ');
          const lastName = rest.join(' ') || '';

          await db.user.create({
            data: {
              email: user.email,
              firstName,
              lastName,
              avatarUrl: user.image,
              emailVerified: new Date(),
            },
          });
        }
      }

      return true;
    },
  },
});

export const handlers: NextAuthResult['handlers'] = nextAuth.handlers;
export const auth: NextAuthResult['auth'] = nextAuth.auth;
export const signIn: NextAuthResult['signIn'] = nextAuth.signIn;
export const signOut: NextAuthResult['signOut'] = nextAuth.signOut;
