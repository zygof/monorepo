import { db } from '@marrynov/database';
import { GalleryManager } from '@/components/admin/gallery-manager';

export default async function AdminGaleriePage() {
  const items = await db.galleryItem.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-text">Galerie</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Gérez les photos du salon — ajoutez via URL, modifiez ou masquez.
      </p>
      <GalleryManager initialItems={JSON.parse(JSON.stringify(items))} />
    </div>
  );
}
