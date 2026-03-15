/**
 * UploadThing — File router définissant les endpoints d'upload.
 *
 * Chaque route = un type de fichier avec ses contraintes
 * (taille max, nombre max, auth requise, etc.)
 *
 * Pattern réutilisable : chaque template importe ce fichier
 * et peut ajouter/retirer des routes selon ses besoins.
 */

import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/lib/auth';

const f = createUploadthing();

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non authentifié');
  return session.user;
}

async function requireStaff() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE') {
    throw new Error('Accès réservé au personnel');
  }
  return user;
}

export const uploadRouter = {
  /** Avatar client — 1 image, max 2 Mo */
  avatarUpload: f({
    image: { maxFileSize: '2MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await requireAuth();
      return { userId: user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  /** Photos galerie (admin) — jusqu'à 10 images, max 4 Mo chacune */
  galleryUpload: f({
    image: { maxFileSize: '4MB', maxFileCount: 10 },
  })
    .middleware(async () => {
      const user = await requireStaff();
      return { userId: user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl, name: file.name };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
