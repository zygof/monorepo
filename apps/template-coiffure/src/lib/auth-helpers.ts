import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Helper : vérifier que l'utilisateur est connecté et a un rôle staff (EMPLOYEE ou ADMIN).
 * Retourne la session ou une NextResponse d'erreur.
 */
export async function requireStaff() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) };
  }
  if (session.user.role !== 'EMPLOYEE' && session.user.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Accès réservé au personnel' }, { status: 403 }) };
  }
  return { session };
}

/**
 * Helper : vérifier que l'utilisateur est admin.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) };
  }
  if (session.user.role !== 'ADMIN') {
    return {
      error: NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 }),
    };
  }
  return { session };
}
