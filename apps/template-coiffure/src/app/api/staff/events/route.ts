import { auth } from '@/lib/auth';
import { staffEventBus, type StaffEvent } from '@/lib/event-bus';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/staff/events — Server-Sent Events pour les notifications temps réel.
 *
 * Le client ouvre une connexion SSE et reçoit les events quand les données changent.
 * Nécessite d'être connecté en tant que EMPLOYEE ou ADMIN.
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response('Non authentifié', { status: 401 });
  }

  if (session.user.role !== 'EMPLOYEE' && session.user.role !== 'ADMIN') {
    return new Response('Accès réservé au personnel', { status: 403 });
  }

  let cleanup: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Envoyer un heartbeat toutes les 30s pour garder la connexion
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch (error) {
          console.error('[GET /api/staff/events] heartbeat error:', error);
          doCleanup();
        }
      }, 30000);

      // Event initial de connexion
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`),
      );

      // Écouter les events
      const unsubscribe = staffEventBus.subscribe((event: StaffEvent) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch (error) {
          console.error('[GET /api/staff/events] enqueue error:', error);
          doCleanup();
        }
      });

      function doCleanup() {
        unsubscribe();
        clearInterval(heartbeat);
      }

      // Exposer le cleanup pour cancel()
      cleanup = doCleanup;
    },
    cancel() {
      // Appelé quand le client se déconnecte
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
