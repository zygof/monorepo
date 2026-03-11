'use client';

import { useReducer } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, cn } from '@marrynov/ui';
import type { BookingState, BookingAction, Service, Product } from '@/types/salon';
import { allServices, beautyProducts, teamMembers } from '@/config/salon.config';
import { BookingStepper } from './booking-stepper';
import { BookingSummary } from './booking-summary';
import { StepServices } from './step-services';
import { StepDatetime } from './step-datetime';
import { StepContact } from './step-contact';
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
    case 'GO_NEXT':
      if (state.step === 1) return { ...state, step: 2 };
      if (state.step === 2) return { ...state, step: 3 };
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

  /* Validation per step */
  const isNextDisabled = (() => {
    if (state.step === 1) return state.selectedServices.length === 0;
    if (state.step === 2) return !state.date || !state.timeSlot;
    if (state.step === 3) {
      const { firstName, lastName, email, phone: tel, acceptCgv } = state.contact;
      return (
        !firstName.trim() || !lastName.trim() || !email.includes('@') || !tel.trim() || !acceptCgv
      );
    }
    return true;
  })();

  const isLastStep = state.step === 3;

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

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-14">
      <BookingStepper step={state.step} />

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
            <BookingSummary state={state} teamMembers={teamMembers} />
          </div>

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
                className="gap-2 text-text-muted hover:text-text"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Retour
              </Button>
            )}

            <Button
              variant="default"
              size="pill"
              disabled={isNextDisabled}
              onClick={() => {
                if (isLastStep) dispatch({ type: 'CONFIRM' });
                else dispatch({ type: 'GO_NEXT' });
              }}
              className="gap-2 shadow-primary-glow"
            >
              {isLastStep ? (
                <>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Confirmer mon rendez-vous
                </>
              ) : (
                <>
                  Continuer
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Desktop sticky summary */}
        <div className="hidden lg:block sticky top-28">
          <BookingSummary state={state} teamMembers={teamMembers} />
        </div>
      </div>
    </div>
  );
}
