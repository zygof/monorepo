import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';
import { requireStaff } from '@/lib/auth-helpers';
import { staffEventBus } from '@/lib/event-bus';

/** GET /api/staff/clients/:id/notes — Liste les notes d'un client */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireStaff();
    if (error) return error;

    const { id } = await params;

    const notes = await db.clientNote.findMany({
      where: { clientId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('[GET /api/staff/clients/:id/notes] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** POST /api/staff/clients/:id/notes — Ajouter une note sur un client */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error, session } = await requireStaff();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    if (!body.content?.trim()) {
      return NextResponse.json({ error: 'Le contenu est requis' }, { status: 400 });
    }

    if (body.content.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Note trop longue (max 2000 caractères)' },
        { status: 400 },
      );
    }

    // Vérifier que le client existe
    const client = await db.user.findUnique({ where: { id }, select: { id: true } });
    if (!client) {
      return NextResponse.json({ error: 'Client introuvable' }, { status: 404 });
    }

    const note = await db.clientNote.create({
      data: {
        clientId: id,
        authorId: session!.user!.id,
        content: body.content.trim(),
      },
      include: {
        author: { select: { firstName: true, lastName: true } },
      },
    });

    staffEventBus.emit('client_note', { clientId: id, noteId: note.id });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('[POST /api/staff/clients/:id/notes] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
