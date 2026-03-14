import { db } from '@marrynov/database';
import { ScheduleManager } from '@/components/admin/schedule-manager';

export default async function AdminHorairesPage() {
  const slots = await db.scheduleSlot.findMany({
    orderBy: { dayOfWeek: 'asc' },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-text">Horaires</h1>
      <p className="mt-1 text-sm text-text-muted">
        Configurez les horaires d&apos;ouverture du salon.
      </p>
      <div className="mt-6">
        <ScheduleManager initialSlots={JSON.parse(JSON.stringify(slots))} />
      </div>
    </div>
  );
}
