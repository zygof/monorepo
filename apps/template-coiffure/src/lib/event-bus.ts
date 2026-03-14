/**
 * Simple in-process event bus for SSE notifications.
 *
 * Quand une action modifie les RDV, notes, etc., on émet un event.
 * Les connexions SSE actives reçoivent l'event et le client fait un router.refresh().
 *
 * Limites : fonctionne uniquement au sein d'un même process Node.js.
 * En prod multi-instance, utiliser Redis Pub/Sub ou similaire.
 */

type Listener = (event: StaffEvent) => void;

export interface StaffEvent {
  type:
    | 'appointment_updated'
    | 'appointment_created'
    | 'appointment_cancelled'
    | 'mod_request'
    | 'client_note'
    | 'review_created';
  payload?: Record<string, unknown>;
  timestamp: number;
}

class EventBus {
  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(type: StaffEvent['type'], payload?: Record<string, unknown>) {
    const event: StaffEvent = { type, payload, timestamp: Date.now() };
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch {
        /* ignore */
      }
    }
  }

  get connectionCount() {
    return this.listeners.size;
  }
}

// Singleton global (survit aux hot reloads en dev)
const globalForBus = globalThis as unknown as { __staffEventBus?: EventBus };
export const staffEventBus = globalForBus.__staffEventBus ?? new EventBus();
globalForBus.__staffEventBus = staffEventBus;
