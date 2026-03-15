'use client';

import { useReducer, useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { Button, cn, toast } from '@marrynov/ui';
import type {
  BookingState,
  BookingAction,
  Service,
  Product,
  BookingPaymentInfo,
} from '@/types/salon';
import { allServices, beautyProducts, teamMembers } from '@/config/salon.config';
import { bookingContactSchema } from '@/lib/validation';
import { hasPayment } from '@/lib/offers';
import { BookingStepper } from './booking-stepper';
import { BookingSummary } from './booking-summary';
import { StepServices } from './step-services';
import { StepDatetime } from './step-datetime';
import { StepContact } from './step-contact';
import { StepPayment } from './step-payment';
import { StepConfirmation } from './step-confirmation';

/* ── Reducer ─────────────────────────────────────────────────────────── */

const INITIAL_CONTACT = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  notes: '',
  smsNotif: true,
  acceptCgv: false,
};

function createInitialState(preService?: Service, preProduct?: Product): BookingState {
  return {
    step: 1,
    selectedServices: preService ? [preService] : [],
    selectedProducts: preProduct ? [preProduct] : [],
    stylistId: 'any',
    date: null,
    timeSlot: null,
    contact: INITIAL_CONTACT,
    bookingId: null,
    paymentInfo: null,
    depositPaid: null,
  };
}

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'TOGGLE_SERVICE': {
      const exists = state.selectedServices.some((s) => s.id === action.service.id);
      if (exists) {
        // Désélectionner
        return {
          ...state,
          selectedServices: state.selectedServices.filter((s) => s.id !== action.service.id),
        };
      }
      // Sélectionner : remplace tout autre service de la même catégorie (1 max par catégorie)
      const withoutSameCategory = action.service.category
        ? state.selectedServices.filter((s) => s.category !== action.service.category)
        : state.selectedServices;
      return { ...state, selectedServices: [...withoutSameCategory, action.service] };
    }
    case 'TOGGLE_PRODUCT': {
      const exists = state.selectedProducts.some((p) => p.id === action.product.id);
      return {
        ...state,
        selectedProducts: exists
          ? state.selectedProducts.filter((p) => p.id !== action.product.id)
          : [...state.selectedProducts, action.product],
      };
    }
    case 'SET_STYLIST':
      return { ...state, stylistId: action.id };
    case 'SET_DATE':
      return { ...state, date: action.date, timeSlot: null };
    case 'SET_TIME':
      return { ...state, timeSlot: action.slot };
    case 'SET_CONTACT_FIELD':
      return { ...state, contact: { ...state.contact, [action.field]: action.value } };
    case 'SET_BOOKING_ID':
      return { ...state, bookingId: action.id };
    case 'SET_PAYMENT_INFO':
      return { ...state, paymentInfo: action.info };
    case 'SET_DEPOSIT_PAID':
      return { ...state, depositPaid: action.amount };
    case 'GO_NEXT':
      if (state.step === 1) return { ...state, step: 2 };
      if (state.step === 2) return { ...state, step: 3 };
      if (state.step === 3) return { ...state, step: 4 };
      return state;
    case 'GO_PREV':
      if (state.step === 2) return { ...state, step: 1 };
      if (state.step === 3) return { ...state, step: 2 };
      return state;
    case 'CONFIRM':
      return { ...state, step: 'confirmed' };
    default:
      return state;
  }
}

/* ── Component ───────────────────────────────────────────────────────── */

interface BookingWizardProps {
  preService?: Service;
  preProduct?: Product;
  salonName: string;
  phone: string;
  phoneRaw: string;
  whatsapp?: string;
  address: string;
  bookingInstructions?: string[];
}

export function BookingWizard({
  preService,
  preProduct,
  salonName,
  phone,
  phoneRaw,
  whatsapp,
  address,
  bookingInstructions,
}: BookingWizardProps) {
  const [state, dispatch] = useReducer(bookingReducer, undefined, () =>
    createInitialState(preService, preProduct),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const showPaymentStep = hasPayment();

  /* Validation per step */
  const isNextDisabled = (() => {
    if (state.step === 1) return state.selectedServices.length === 0;
    if (state.step === 2) return !state.date || !state.timeSlot;
    if (state.step === 3) {
      const result = bookingContactSchema.safeParse(state.contact);
      return !result.success;
    }
    return true;
  })();

  // Step 3 est le dernier step "formulaire" — le bouton Confirmer déclenche l'API
  const isStep3 = state.step === 3;

  /* ── API call — créer le RDV ─────────────────────────────────────── */
  const handleSubmitBooking = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: state.date,
          startTime: state.timeSlot,
          serviceIds: state.selectedServices.map((s) => s.id),
          stylistId: state.stylistId !== 'any' ? state.stylistId : undefined,
          firstName: state.contact.firstName,
          lastName: state.contact.lastName,
          email: state.contact.email,
          phone: state.contact.phone,
          notes: state.contact.notes || undefined,
          smsNotif: state.contact.smsNotif,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Erreur lors de la réservation');
      }

      const booking = await res.json();
      dispatch({ type: 'SET_BOOKING_ID', id: booking.id });

      // Premium : le booking retourne un clientSecret → step 4 (paiement)
      if (booking.clientSecret) {
        const paymentInfo: BookingPaymentInfo = {
          bookingId: booking.id,
          clientSecret: booking.clientSecret,
          depositAmount: booking.depositAmount,
          totalPrice: booking.totalPrice,
        };
        dispatch({ type: 'SET_PAYMENT_INFO', info: paymentInfo });
        dispatch({ type: 'GO_NEXT' }); // step 3 → step 4
      } else {
        // Standard : booking confirmé directement
        toast.success('Rendez-vous confirmé !', {
          description: 'Vous recevrez un email de confirmation.',
        });
        dispatch({ type: 'CONFIRM' }); // → 'confirmed'
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      toast.error('Impossible de réserver', { description: message });
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [state]);

  /* ── Callback paiement terminé (Premium) ─────────────────────────── */
  const handlePaymentComplete = useCallback((depositAmount: number) => {
    dispatch({ type: 'SET_DEPOSIT_PAID', amount: depositAmount });
    dispatch({ type: 'CONFIRM' });
  }, []);

  /* ── Confirmation screen ─────────────────────────────────────────── */
  if (state.step === 'confirmed') {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-14">
        <StepConfirmation
          state={state}
          teamMembers={teamMembers}
          salonName={salonName}
          phone={phone}
          phoneRaw={phoneRaw}
          whatsapp={whatsapp}
          address={address}
          bookingInstructions={bookingInstructions}
        />
      </div>
    );
  }

  /* ── Payment step (Premium, step 4) ──────────────────────────────── */
  if (state.step === 4) {
    return (
      <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-14">
        <BookingStepper step={state.step} showPaymentStep />

        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <StepPayment state={state} onPaymentComplete={handlePaymentComplete} />

          {/* Desktop sticky summary */}
          <div className="hidden lg:block sticky top-28">
            <BookingSummary state={state} teamMembers={teamMembers} showDeposit />
          </div>
        </div>
      </div>
    );
  }

  /* ── Steps 1-3 ───────────────────────────────────────────────────── */
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-14">
      <BookingStepper step={state.step} showPaymentStep={showPaymentStep} />

      <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* Step content */}
        <div>
          {state.step === 1 && (
            <StepServices
              state={state}
              dispatch={dispatch}
              services={allServices}
              products={beautyProducts}
            />
          )}
          {state.step === 2 && (
            <StepDatetime state={state} dispatch={dispatch} teamMembers={teamMembers} />
          )}
          {state.step === 3 && <StepContact state={state} dispatch={dispatch} />}

          {/* Mobile summary (inline, above CTA) */}
          <div className="mt-8 lg:hidden">
            <BookingSummary
              state={state}
              teamMembers={teamMembers}
              showDeposit={showPaymentStep && state.step === 3}
            />
          </div>

          {/* Erreur soumission */}
          {submitError && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error"
            >
              {submitError}
            </div>
          )}

          {/* Navigation */}
          <div
            className={cn(
              'mt-6 flex items-center gap-4',
              state.step === 1 ? 'justify-end' : 'justify-between',
            )}
          >
            {state.step > 1 && (
              <Button
                variant="ghost"
                size="default"
                onClick={() => dispatch({ type: 'GO_PREV' })}
                disabled={isSubmitting}
                className="gap-2 text-text-muted hover:text-text"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Retour
              </Button>
            )}

            {isStep3 ? (
              <Button
                variant="default"
                size="pill"
                disabled={isNextDisabled || isSubmitting}
                onClick={handleSubmitBooking}
                className="gap-2 shadow-primary-glow"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Réservation en cours…
                  </>
                ) : showPaymentStep ? (
                  <>
                    <CreditCard size={16} aria-hidden="true" />
                    Continuer vers le paiement
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    Confirmer mon rendez-vous
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="default"
                size="pill"
                disabled={isNextDisabled}
                onClick={() => dispatch({ type: 'GO_NEXT' })}
                className="gap-2 shadow-primary-glow"
              >
                Continuer
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>

        {/* Desktop sticky summary */}
        <div className="hidden lg:block sticky top-28">
          <BookingSummary
            state={state}
            teamMembers={teamMembers}
            showDeposit={showPaymentStep && state.step === 3}
          />
        </div>
      </div>
    </div>
  );
}
