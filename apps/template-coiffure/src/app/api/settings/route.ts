import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';

/**
 * GET /api/settings — Paramètres publics du salon (key-value).
 *
 * Retourne tous les paramètres (nom, adresse, téléphone, etc.)
 * sous forme d'objet { [key]: value }.
 */
export async function GET() {
  try {
    const settings = await db.salonSetting.findMany();

    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/settings] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
