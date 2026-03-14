import { db } from '@marrynov/database';
import { ProductsManager } from '@/components/admin/products-manager';

export default async function AdminProduitsPage() {
  const products = await db.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-text">Produits</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Gérez les produits recommandés — ajoutez, modifiez ou désactivez.
      </p>
      <ProductsManager initialProducts={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
