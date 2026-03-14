import { z } from 'zod';

/**
 * Schemas de validation partagés — source unique pour tous les formulaires.
 *
 * Conventions :
 *  - Tout string est .trim() sauf password
 *  - Email toujours .toLowerCase()
 *  - Téléphone : format La Réunion (0262/0692/0693/+262), min 10 chiffres
 *  - Les schemas exportent des types inférés pour usage dans react-hook-form
 *
 * TODO (backend) : ces mêmes schemas doivent être utilisés côté API (route handlers)
 * pour valider les payloads entrants — pas de double source de vérité.
 */

/* ── Helpers réutilisables ────────────────────────────────────────────── */

/** Regex téléphone France / La Réunion : 10+ chiffres, accepte +, espaces, tirets, points */
const PHONE_REGEX = /^(?:\+?(?:33|262)|0)\s*[1-9](?:[\s.-]?\d{2}){4}$/;

/** Nettoie un numéro de téléphone : supprime espaces, tirets, points */
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s.()-]/g, '');
}

/** Normalise un email : trim + lowercase */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/* ── Champs réutilisables ─────────────────────────────────────────────── */

export const emailField = z
  .string()
  .trim()
  .min(1, "L'email est requis")
  .email('Adresse email invalide')
  .transform((v) => v.toLowerCase());

export const phoneField = z
  .string()
  .trim()
  .min(1, 'Le téléphone est requis')
  .regex(PHONE_REGEX, 'Numéro invalide (ex: 0692 12 34 56)')
  .transform(normalizePhone);

export const phoneFieldOptional = z
  .string()
  .trim()
  .transform((v) => (v === '' ? '' : v))
  .pipe(
    z.union([
      z.literal(''),
      z
        .string()
        .regex(PHONE_REGEX, 'Numéro invalide (ex: 0692 12 34 56)')
        .transform(normalizePhone),
    ]),
  );

export const nameField = z
  .string()
  .trim()
  .min(2, 'Minimum 2 caractères')
  .max(50, 'Maximum 50 caractères');

/* ── Schema Booking Contact (step 3 du tunnel de réservation) ─────── */

export const bookingContactSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  email: emailField,
  phone: phoneField,
  notes: z.string().trim().max(1000, 'Maximum 1000 caractères').default(''),
  smsNotif: z.boolean().default(true),
  acceptCgv: z.literal(true, { error: 'Vous devez accepter les CGV' }),
});

export type BookingContactData = z.infer<typeof bookingContactSchema>;

/**
 * Version "input" du schema (avant transform) — utilisée pour react-hook-form
 * car les transforms sont appliquées au submit, pas pendant la saisie.
 */
export type BookingContactInput = z.input<typeof bookingContactSchema>;

/* ── Schema Contact Form (page /contact) ──────────────────────────── */

export const contactFormSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneFieldOptional,
  subject: z.string().trim().min(2, 'Minimum 2 caractères').max(120, 'Maximum 120 caractères'),
  message: z.string().trim().min(10, 'Minimum 10 caractères').max(2000, 'Maximum 2000 caractères'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/* ── Schema Auth ──────────────────────────────────────────────────── */

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(6, 'Minimum 6 caractères'),
});

export const signupSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  email: emailField,
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
});

export const forgotSchema = z.object({
  email: emailField,
});

export type LoginFields = z.infer<typeof loginSchema>;
export type SignupFields = z.infer<typeof signupSchema>;
export type ForgotFields = z.infer<typeof forgotSchema>;

export const resetPasswordSchema = z.object({
  email: emailField,
  token: z.string().min(1, 'Token requis'),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
});

export type ResetPasswordFields = z.infer<typeof resetPasswordSchema>;

/* ── Schema Profile (page /compte) ───────────────────────────────── */

export const profileSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  email: emailField,
  phone: phoneField,
});

export type ProfileFields = z.infer<typeof profileSchema>;

/* ── Schema Review (avis client) ─────────────────────────────────── */

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Veuillez donner une note').max(5),
  comment: z.string().trim().min(5, 'Minimum 5 caractères').max(500, 'Maximum 500 caractères'),
});

export type ReviewFields = z.infer<typeof reviewSchema>;

/* ── Schema Registration email (page confirmation) ────────────────── */

export const registerEmailSchema = z.object({
  email: emailField,
});
