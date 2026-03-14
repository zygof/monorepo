'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn, Button } from '@marrynov/ui';
import { Send, CheckCircle } from 'lucide-react';
import { contactFormSchema, type ContactFormData } from '@/lib/validation';

/* ── Styles ──────────────────────────────────────────────────────────── */

const INPUT_CLS =
  'h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-text placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

const LABEL_CLS = 'mb-1.5 block text-sm font-medium text-text';

const ERROR_CLS = 'mt-1 text-xs text-error';

/* ── Props ────────────────────────────────────────────────────────────── */

interface ContactFormProps {
  heading: string;
  description: string;
}

/**
 * Formulaire de contact — Client Component.
 *
 * Validation côté client avec react-hook-form + zod.
 * TODO (backend) : POST /api/contact → envoyer via Resend.
 */
export function ContactForm({ heading, description }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  async function onSubmit(_data: ContactFormData) {
    // TODO (backend) : POST /api/contact → envoyer via Resend
    // _data est validé et normalisé par zod (email lowercase, phone nettoyé)
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-success/30 bg-success/5 px-8 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle size={28} className="text-success" />
        </div>
        <h3 className="font-serif text-xl font-bold text-text">Message envoyé !</h3>
        <p className="max-w-sm text-sm leading-relaxed text-text-subtle">
          Merci pour votre message. Nous vous répondrons dans les plus brefs délais, généralement
          sous 24 heures.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2 font-serif text-2xl font-bold text-text">{heading}</h2>
      <p className="mb-8 text-sm text-text-subtle">{description}</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {/* Nom */}
        <div>
          <label htmlFor="contact-name" className={LABEL_CLS}>
            Nom complet <span className="text-error">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Marie Dupont"
            className={cn(INPUT_CLS, errors.name && 'border-error focus:ring-error/20')}
            {...register('name')}
          />
          {errors.name && <p className={ERROR_CLS}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className={LABEL_CLS}>
            Email <span className="text-error">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="marie@exemple.re"
            className={cn(INPUT_CLS, errors.email && 'border-error focus:ring-error/20')}
            {...register('email')}
          />
          {errors.email && <p className={ERROR_CLS}>{errors.email.message}</p>}
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="contact-phone" className={LABEL_CLS}>
            Téléphone <span className="text-xs text-text-muted font-normal">(optionnel)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder="0692 12 34 56 (optionnel)"
            className={cn(INPUT_CLS, errors.phone && 'border-error focus:ring-error/20')}
            {...register('phone')}
          />
          {errors.phone && <p className={ERROR_CLS}>{errors.phone.message}</p>}
        </div>

        {/* Objet */}
        <div>
          <label htmlFor="contact-subject" className={LABEL_CLS}>
            Objet <span className="text-error">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            placeholder="Demande de renseignement"
            className={cn(INPUT_CLS, errors.subject && 'border-error focus:ring-error/20')}
            {...register('subject')}
          />
          {errors.subject && <p className={ERROR_CLS}>{errors.subject.message}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className={LABEL_CLS}>
            Message <span className="text-error">*</span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Décrivez votre demande..."
            className={cn(
              INPUT_CLS,
              'h-auto resize-none py-3',
              errors.message && 'border-error focus:ring-error/20',
            )}
            {...register('message')}
          />
          {errors.message && <p className={ERROR_CLS}>{errors.message.message}</p>}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="default"
          disabled={isSubmitting}
          className="w-full py-3 mt-1 rounded-xl cursor-pointer"
        >
          {isSubmitting ? (
            'Envoi en cours...'
          ) : (
            <>
              <Send size={16} aria-hidden="true" />
              Envoyer le message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
