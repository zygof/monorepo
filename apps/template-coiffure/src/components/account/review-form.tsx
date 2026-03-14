'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, Send } from 'lucide-react';
import { Button, cn } from '@marrynov/ui';
import { reviewSchema, type ReviewFields } from '@/lib/validation';

interface ReviewFormProps {
  appointmentId: string;
  onCancel: () => void;
  onSubmit: () => void;
}

export function ReviewForm({ appointmentId: _appointmentId, onCancel, onSubmit }: ReviewFormProps) {
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFields>({
    resolver: zodResolver(reviewSchema),
    mode: 'onBlur',
    defaultValues: { rating: 0, comment: '' },
  });

  const currentRating = watch('rating');

  async function handleReviewSubmit(_data: ReviewFields) {
    // TODO (backend) : POST /api/account/reviews
    await new Promise((r) => setTimeout(r, 500));
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit(handleReviewSubmit)} className="flex flex-col gap-3">
      {/* Star rating */}
      <div>
        <p className="mb-2 text-sm font-medium text-text">Votre note</p>
        <div className="flex gap-1" role="radiogroup" aria-label="Note sur 5 étoiles">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => {
                setValue('rating', star, { shouldValidate: true });
              }}
              className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
              role="radio"
              aria-checked={currentRating === star}
            >
              <Star
                size={24}
                className={cn(
                  'transition-colors',
                  (hoveredStar || currentRating) >= star
                    ? 'fill-secondary text-secondary'
                    : 'text-border',
                )}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="mt-1 text-xs text-error">{errors.rating.message}</p>}
      </div>

      {/* Comment */}
      <div>
        <textarea
          {...register('comment')}
          rows={3}
          placeholder="Partagez votre expérience..."
          className={cn(
            'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none',
            errors.comment && 'border-error focus:ring-error/20',
          )}
          aria-invalid={!!errors.comment}
        />
        {errors.comment && <p className="mt-1 text-xs text-error">{errors.comment.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5 rounded-lg">
          <Send size={12} aria-hidden="true" />
          {isSubmitting ? 'Envoi...' : "Publier l'avis"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="rounded-lg text-text-muted"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
