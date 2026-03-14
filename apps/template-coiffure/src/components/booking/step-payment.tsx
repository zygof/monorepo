'use client';

import { useState, useCallback } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AlertCircle, CreditCard, Loader2, Lock, Shield } from 'lucide-react';
import { Button } from '@marrynov/ui';
import type { BookingPaymentInfo, BookingState } from '@/types/salon';
import { getDepositPercentage, formatCentsToEuros } from '@/lib/offers';

/* ── Stripe loader (singleton) ─────────────────────────────────────── */

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

/* ── Payment Form (inside Elements context) ────────────────────────── */

interface PaymentFormProps {
  paymentInfo: BookingPaymentInfo;
  onSuccess: (depositAmount: number) => void;
}

function PaymentForm({ paymentInfo, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!stripe || !elements) return;

      setIsProcessing(true);
      setError(null);

      try {
        // Confirmer le paiement via Stripe.js
        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
          confirmParams: {
            return_url: `${window.location.origin}/reserver/paiement-retour?booking_id=${paymentInfo.bookingId}`,
          },
        });

        if (stripeError) {
          // Erreurs attendues (carte déclinée, fonds insuffisants, etc.)
          setError(getErrorMessage(stripeError));
          setIsProcessing(false);
          return;
        }

        if (paymentIntent?.status === 'succeeded') {
          // Confirmer côté serveur
          await fetch(`/api/bookings/${paymentInfo.bookingId}/confirm-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
          });

          onSuccess(paymentInfo.depositAmount);
          return;
        }

        // Statut inattendu (requires_action, etc.)
        if (paymentIntent?.status === 'requires_action') {
          // 3D Secure en cours — Stripe gère automatiquement via redirect
          return;
        }

        setError("Le paiement n'a pas pu être finalisé. Veuillez réessayer.");
      } catch (err) {
        console.error('[StepPayment] error:', err);
        setError('Une erreur est survenue. Veuillez réessayer.');
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, elements, paymentInfo, onSuccess],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Récapitulatif acompte */}
      <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text">Acompte à régler</p>
            <p className="text-xs text-text-muted">
              {getDepositPercentage()}% du montant total estimé
            </p>
          </div>
          <p className="text-2xl font-bold text-secondary">
            {formatCentsToEuros(paymentInfo.depositAmount)}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-secondary/10 pt-3">
          <span className="text-xs text-text-muted">Total estimé de la prestation</span>
          <span className="text-sm font-medium text-text">
            {formatCentsToEuros(paymentInfo.totalPrice)}
          </span>
        </div>
        <p className="mt-2 text-xs text-text-muted">
          Le solde sera réglé au salon le jour du rendez-vous.
        </p>
      </div>

      {/* Stripe PaymentElement */}
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard size={16} className="text-text-muted" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-text">Informations de paiement</h3>
        </div>
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: 'tabs',
            business: { name: process.env.NEXT_PUBLIC_SALON_NAME ?? 'Salon' },
          }}
        />
      </div>

      {/* Erreur */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-error/20 bg-error/5 px-4 py-3"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-error" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-error">Paiement refusé</p>
            <p className="mt-0.5 text-xs text-error/80">{error}</p>
          </div>
        </div>
      )}

      {/* Bouton de paiement */}
      <Button
        type="submit"
        variant="default"
        size="pill"
        disabled={!stripe || !isReady || isProcessing}
        className="w-full gap-2 shadow-primary-glow"
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Traitement en cours…
          </>
        ) : (
          <>
            <Lock size={14} aria-hidden="true" />
            Payer l&apos;acompte de {formatCentsToEuros(paymentInfo.depositAmount)}
          </>
        )}
      </Button>

      {/* Badges de confiance */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Shield size={12} aria-hidden="true" />
            Paiement sécurisé SSL
          </span>
          <span className="flex items-center gap-1">
            <Lock size={12} aria-hidden="true" />
            Cryptage 256-bit
          </span>
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <span className="text-xs text-text-muted">Propulsé par</span>
          <svg viewBox="0 0 60 25" fill="none" width={42} aria-label="Stripe">
            <path
              d="M5.86 10.69c0-.76.63-1.06 1.67-1.06.98 0 2.22.3 3.2.83V7.25a8.51 8.51 0 00-3.2-.59c-2.62 0-4.36 1.37-4.36 3.65 0 3.56 4.9 2.99 4.9 4.53 0 .9-.78 1.19-1.87 1.19-1.13 0-2.57-.47-3.71-1.1v3.27a9.42 9.42 0 003.71.78c2.68 0 4.52-1.33 4.52-3.65-.01-3.84-4.86-3.15-4.86-4.64zm8.42-4.04l-2.58.55v2.56H10v2.62h1.7v4.27c0 1.78 1.36 2.53 2.81 2.53.85 0 1.57-.15 1.97-.34v-2.5c-.33.13-1.97.58-1.97-.87v-3.09h1.97V9.76h-1.97zm7.68 0l-.17.78a3.2 3.2 0 00-1.22-.2c-1.39 0-2.36.92-2.79 2.47l-.2-.19V9.76h-2.66v9.24h2.73v-6.1c.55-1.87 2.37-1.54 2.87-1.34zm3.89 0c-1.58 0-2.6.75-3.17 1.27l-.21-1.02H19.8v12.55l2.72-.58.01-3.05c.58.42 1.44 1.01 2.85 1.01 2.88 0 5.5-2.31 5.5-7.42-.01-4.67-2.66-6.76-5.01-6.76zm-.88 9.22c-.95 0-1.51-.34-1.9-.76l-.02-6.01c.41-.47.99-.79 1.92-.79 1.47 0 2.48 1.65 2.48 3.77 0 2.17-1 3.79-2.48 3.79zm13.92-1.11c0 2.64 1.93 3.42 3.56 3.42 1.02 0 1.87-.25 2.53-.6v-2.3c-.59.28-1.25.44-2.09.44-1.03 0-1.83-.41-1.83-1.95v-3.87h2.13V7.28h-2.13V4.55l-2.17.46v2.27h-1.78v2.52h1.78zm8.82-6.21c-2.9 0-4.79 2.47-4.79 5.47s1.88 5.47 4.79 5.47c1.32 0 2.34-.5 3.1-1.33l-.2-.94-.21-.62c-.53.6-1.39 1.03-2.35 1.03-1.64 0-2.58-1.17-2.66-3.14h5.68c.02-.28.03-.58.03-.85 0-2.79-1.56-5.09-4.39-5.09zm-2.27 4.22c.14-1.55.93-2.52 2.14-2.52 1.17 0 1.88.9 1.89 2.52zm-7.72-4.22c-1.45 0-2.38.68-2.89 1.15l-.19-.9h-2.37v12.55l2.68-.57.01-3.05c.53.38 1.3.92 2.59.92 2.62 0 5.01-2.11 5.01-6.76-.01-4.26-2.43-5.34-4.84-5.34zm-.8 8.15c-.87 0-1.38-.31-1.73-.7l-.02-5.52c.38-.43.91-.72 1.75-.72 1.34 0 2.27 1.5 2.27 3.46 0 2-.91 3.48-2.27 3.48z"
              fill="#6772E5"
            />
          </svg>
        </div>
      </div>
    </form>
  );
}

/* ── Error message mapping ────────────────────────────────────────── */

function getErrorMessage(error: { type: string; code?: string; message?: string }): string {
  switch (error.code) {
    case 'card_declined':
      return 'Votre carte a été refusée. Veuillez utiliser une autre carte.';
    case 'insufficient_funds':
      return 'Fonds insuffisants. Veuillez utiliser une autre carte.';
    case 'expired_card':
      return 'Votre carte est expirée. Veuillez utiliser une carte valide.';
    case 'incorrect_cvc':
      return 'Le code de sécurité (CVC) est incorrect.';
    case 'processing_error':
      return 'Erreur de traitement. Veuillez réessayer dans quelques instants.';
    case 'incorrect_number':
      return 'Le numéro de carte est incorrect.';
    default:
      return error.message ?? 'Une erreur est survenue lors du paiement.';
  }
}

/* ── StepPayment (wrapper with Elements) ──────────────────────────── */

interface StepPaymentProps {
  state: BookingState;
  onPaymentComplete: (depositAmount: number) => void;
}

export function StepPayment({ state, onPaymentComplete }: StepPaymentProps) {
  const { paymentInfo } = state;

  if (!stripePromise) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-6 text-center">
        <AlertCircle size={32} className="mx-auto mb-3 text-error" aria-hidden="true" />
        <h3 className="mb-1 text-base font-bold text-error">Paiement indisponible</h3>
        <p className="text-sm text-error/80">
          La configuration Stripe est manquante. Contactez le salon pour finaliser votre
          réservation.
        </p>
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-primary" aria-hidden="true" />
        <span className="ml-3 text-sm text-text-muted">Préparation du paiement…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-1 font-serif text-2xl font-bold text-text">Paiement de l&apos;acompte</h2>
        <p className="text-sm text-text-subtle">
          Un acompte est demandé pour confirmer votre rendez-vous. Le solde sera réglé au salon.
        </p>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: paymentInfo.clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#b8860b',
              colorBackground: '#ffffff',
              colorText: '#1e1e1e',
              colorDanger: '#dc2626',
              fontFamily: 'system-ui, sans-serif',
              borderRadius: '12px',
              spacingUnit: '4px',
            },
            rules: {
              '.Input': {
                border: '1px solid #e5e5e5',
                boxShadow: 'none',
                padding: '12px',
              },
              '.Input:focus': {
                border: '1px solid #b8860b',
                boxShadow: '0 0 0 1px #b8860b',
              },
              '.Label': {
                fontWeight: '500',
                fontSize: '14px',
                marginBottom: '6px',
              },
            },
          },
          locale: 'fr',
        }}
      >
        <PaymentForm paymentInfo={paymentInfo} onSuccess={onPaymentComplete} />
      </Elements>
    </div>
  );
}
