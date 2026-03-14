import { db } from '@marrynov/database';
import { ReviewsManager } from '@/components/admin/reviews-manager';

export default async function AdminAvisPage() {
  const reviews = await db.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { firstName: true, lastName: true, email: true } },
      appointment: {
        select: {
          date: true,
          services: { include: { service: { select: { name: true } } } },
        },
      },
    },
  });

  const avg = await db.review.aggregate({ where: { visible: true }, _avg: { rating: true } });
  const total = reviews.length;
  const visible = reviews.filter((r) => r.visible).length;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-text">Avis clients</h1>
      <p className="mt-1 text-sm text-text-muted">
        {total} avis · {visible} visibles · Note moyenne : {avg._avg.rating?.toFixed(1) ?? '—'}/5
      </p>
      <div className="mt-6">
        <ReviewsManager initialReviews={JSON.parse(JSON.stringify(reviews))} />
      </div>
    </div>
  );
}
