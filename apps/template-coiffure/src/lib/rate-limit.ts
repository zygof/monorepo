/**
 * Rate limiter en mémoire — protection contre le brute force et le spam.
 *
 * Utilise un LRU simple basé sur une Map avec nettoyage automatique.
 * Suffisant pour un déploiement single-instance (Dokploy).
 * Pour du multi-instance, migrer vers Redis (@upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimiterConfig {
  /** Nombre max de requêtes dans la fenêtre */
  limit: number;
  /** Durée de la fenêtre en secondes */
  windowSeconds: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(name: string): Map<string, RateLimitEntry> {
  let store = stores.get(name);
  if (!store) {
    store = new Map();
    stores.set(name, store);
  }
  return store;
}

/**
 * Crée un rate limiter nommé.
 *
 * Usage :
 * ```ts
 * const limiter = createRateLimiter('auth-login', { limit: 5, windowSeconds: 60 });
 *
 * export async function POST(request: Request) {
 *   const ip = getClientIp(request);
 *   const { success, remaining } = limiter.check(ip);
 *   if (!success) {
 *     return NextResponse.json({ error: 'Trop de tentatives' }, { status: 429 });
 *   }
 *   // ...
 * }
 * ```
 */
export function createRateLimiter(name: string, config: RateLimiterConfig) {
  const store = getStore(name);

  // Nettoyage des entrées expirées toutes les 60s
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }, 60_000);

  // Éviter que le timer empêche le process de quitter
  if (cleanup.unref) cleanup.unref();

  return {
    check(key: string): { success: boolean; remaining: number; resetAt: number } {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || now > entry.resetAt) {
        // Nouvelle fenêtre
        const resetAt = now + config.windowSeconds * 1000;
        store.set(key, { count: 1, resetAt });
        return { success: true, remaining: config.limit - 1, resetAt };
      }

      if (entry.count >= config.limit) {
        return { success: false, remaining: 0, resetAt: entry.resetAt };
      }

      entry.count++;
      return { success: true, remaining: config.limit - entry.count, resetAt: entry.resetAt };
    },
  };
}

/**
 * Extraire l'IP du client depuis les headers.
 * Fonctionne derrière Traefik/Nginx (X-Forwarded-For).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}
