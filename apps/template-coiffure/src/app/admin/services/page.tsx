import { db } from '@marrynov/database';
import { ServicesManager } from '@/components/admin/services-manager';

export default async function AdminServicesPage() {
  const services = await db.service.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-text">Services</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Gérez le catalogue de prestations — ajoutez, modifiez ou désactivez vos services.
      </p>
      <ServicesManager initialServices={JSON.parse(JSON.stringify(services))} />
    </div>
  );
}
