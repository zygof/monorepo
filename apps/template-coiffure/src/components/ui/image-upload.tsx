'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { cn, toast } from '@marrynov/ui';
import { useUploadThing } from '@/lib/uploadthing-hooks';

/**
 * ImageUpload — Composant réutilisable pour upload d'images via UploadThing.
 *
 * Supporte :
 * - Drag & drop
 * - Click pour sélectionner
 * - Preview de l'image actuelle
 * - Suppression (reset à null)
 * - Indicateur de progression
 *
 * Pattern duplicable : chaque template crée son propre fichier
 * uploadthing-hooks.ts qui type le router, puis utilise ce composant.
 */

interface ImageUploadProps {
  /** URL actuelle de l'image (si déjà uploadée) */
  value?: string | null;
  /** Callback quand l'upload est terminé */
  onChange: (url: string) => void;
  /** Callback quand l'image est supprimée */
  onRemove?: () => void;
  /** Endpoint UploadThing à utiliser */
  endpoint: 'avatarUpload' | 'galleryUpload';
  /** Forme du container */
  shape?: 'square' | 'circle';
  /** Taille du container en px */
  size?: number;
  /** Texte d'aide sous le bouton */
  hint?: string;
  /** Classes additionnelles */
  className?: string;
  /** Désactiver l'upload */
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  endpoint,
  shape = 'square',
  size = 160,
  hint = 'JPG ou PNG, max 2 Mo',
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const file = res?.[0];
      const url = file?.ufsUrl ?? file?.url;
      if (url) {
        onChange(url);
        setPreview(null);
        toast.success('Image uploadée !');
      }
    },
    onUploadError: (error) => {
      setPreview(null);
      toast.error("Échec de l'upload", {
        description: error.message || 'Veuillez réessayer.',
      });
    },
  });

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const file = files[0];
      if (!file) return;

      // Preview locale immédiate
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      startUpload([file]);
    },
    [startUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled || isUploading) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, isUploading, handleFiles],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files);
    },
    [handleFiles],
  );

  const displayUrl = preview || value;
  const isCircle = shape === 'circle';

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Drop zone / Preview */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !isUploading) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{ width: size, height: size }}
        className={cn(
          'relative flex items-center justify-center overflow-hidden border-2 border-dashed transition-colors',
          isCircle ? 'rounded-full' : 'rounded-2xl',
          isDragOver && !disabled ? 'border-primary bg-primary/5' : 'border-border bg-background',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-xs text-text-muted">Upload...</span>
          </div>
        ) : displayUrl ? (
          <Image src={displayUrl} alt="Aperçu" fill className="object-cover" sizes={`${size}px`} />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-text-muted">
            <ImageIcon size={24} />
            <span className="text-xs">Glisser ici</span>
          </div>
        )}

        {/* Remove button */}
        {displayUrl && !isUploading && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
              setPreview(null);
            }}
            className={cn(
              'absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-error text-white shadow-md transition-opacity cursor-pointer',
              'hover:bg-error/90',
            )}
            aria-label="Supprimer l'image"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Upload button */}
      <label
        className={cn(
          'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text shadow-sm transition-colors hover:bg-surface',
          (disabled || isUploading) && 'pointer-events-none opacity-50',
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleInputChange}
          disabled={disabled || isUploading}
        />
        <Upload size={14} aria-hidden="true" />
        {isUploading ? 'Upload en cours...' : 'Choisir une image'}
      </label>

      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
