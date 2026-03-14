'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@marrynov/ui';

/**
 * Page de retour après 3D Secure.
 *
 * URL : /reserver/paiement-retour?booking_id=xxx&payment_intent=pi_xxx&redirect_status=succeeded
 *
 * Stripe redirige ici après l'authentification 3DS.
 * On vérifie le statut et on confirme le paiement côté serveur.
 */

type PaymentReturnStatus = 'loading' | 'success' | 'failed' | 'error';

export default function PaiementRetourPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 size={32} className="animate-spin text-primary" />
        </main>
      }
    >
      <PaiementRetourContent />
    </Suspense>
  );
}

function PaiementRetourContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentReturnStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function confirmPayment() {
      const bookingId = searchParams.get('booking_id');
      const paymentIntent = searchParams.get('payment_intent');
      const redirectStatus = searchParams.get('redirect_status');

      if (!bookingId || !paymentIntent) {
        setStatus('error');
        setErrorMessage("Paramètres manquants dans l'URL de retour.");
        return;
      }

      if (redirectStatus !== 'succeeded') {
        setStatus('failed');
        setErrorMessage(
          redirectStatus === 'failed'
            ? 'Le paiement a échoué. Votre carte a peut-être été refusée.'
            : "Le paiement n'a pas abouti. Veuillez réessayer.",
        );
        return;
      }

      try {
        const res = await fetch(`/api/bookings/${bookingId}/confirm-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent }),
        });

        if (res.ok) {
          setStatus('success');
        } else {
          const data = await res.json();
          // Si déjà payé, c'est un succès (idempotent)
          if (data.status === 'PAID') {
            setStatus('success');
          } else {
            setStatus('failed');
            setErrorMessage(data.error ?? 'Erreur lors de la confirmation.');
          }
        }
      } catch {
        setStatus('error');
        setErrorMessage('Impossible de contacter le serveur. Veuillez vérifier votre réservation.');
      }
    }

    confirmPayment();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <Loader2
              size={48}
              className="mx-auto mb-4 animate-spin text-primary"
              aria-hidden="true"
            />
            <h1 className="mb-2 font-serif text-2xl font-bold text-text">
              Vérification du paiement…
            </h1>
            <p className="text-sm text-text-subtle">
              Nous confirmons votre paiement auprès de votre banque.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-5 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2
                  size={48}
                  className="text-success"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>
            <h1 className="mb-2 font-serif text-2xl font-bold text-text">Paiement confirmé !</h1>
            <p className="mb-8 text-sm text-text-subtle">
              Votre acompte a été encaissé et votre rendez-vous est confirmé. Un email de
              confirmation vous a été envoyé.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild variant="default" size="pill" className="w-full gap-2">
                <Link href="/compte">
                  <Calendar size={14} aria-hidden="true" />
                  Voir mes rendez-vous
                </Link>
              </Button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Retour à l&apos;accueil
              </Link>
            </div>
          </>
        )}

        {(status === 'failed' || status === 'error') && (
          <>
            <div className="mb-5 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error/10">
                <XCircle size={48} className="text-error" strokeWidth={1.5} aria-hidden="true" />
              </div>
            </div>
            <h1 className="mb-2 font-serif text-2xl font-bold text-text">
              {status === 'failed' ? 'Paiement échoué' : 'Erreur'}
            </h1>
            <p className="mb-8 text-sm text-text-subtle">{errorMessage}</p>
            <div className="flex flex-col gap-3">
              <Button asChild variant="default" size="pill" className="w-full gap-2">
                <Link href="/reserver">Réessayer la réservation</Link>
              </Button>
              <Button asChild variant="outline" size="pill" className="w-full gap-2">
                <Link href="/contact">Contacter le salon</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
