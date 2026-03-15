/**
 * Hooks UploadThing typés pour ce template.
 *
 * Chaque template doit créer son propre fichier uploadthing-hooks.ts
 * qui importe le type UploadRouter de son propre lib/uploadthing.ts.
 */

import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from '@uploadthing/react';
import type { UploadRouter } from '@/lib/uploadthing';

export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropzone = generateUploadDropzone<UploadRouter>();
export const { useUploadThing } = generateReactHelpers<UploadRouter>();
