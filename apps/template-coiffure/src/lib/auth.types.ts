import type { DefaultSession } from 'next-auth';

/**
 * Extension des types next-auth pour inclure les champs MARRYNOV.
 *
 * Permet d'accéder à session.user.role, session.user.firstName, etc.
 * dans les Server Components et les route handlers.
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      firstName: string;
      lastName: string;
    } & DefaultSession['user'];
  }
}

/**
 * Les champs custom du JWT (userId, role, firstName, lastName) sont
 * castés via `as string` dans les callbacks jwt/session de auth.ts.
 * next-auth v5 beta ne permet pas d'augmenter le module JWT facilement
 * car le type est dans @auth/core/jwt qui n'est pas résolu en monorepo.
 */
