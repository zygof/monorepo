import { db } from '@marrynov/database';
import { AppointmentsManager } from '@/components/admin/appointments-manager';

export default async function AdminRdvPage() {
  const [appointments, stylists, pendingRequests] = await Promise.all([
    db.appointment.findMany({
      orderBy: [{ date: 'desc' }, { startTime: 'asc' }],
      include: {
        client: { select: { id: true, firstName: true, lastName: true, phone: true, email: true } },
        stylist: { select: { id: true, firstName: true, lastName: true } },
        services: { include: { service: { select: { name: true, durationMin: true } } } },
        modRequests: {
          where: { status: 'PENDING' },
          include: { requester: { select: { firstName: true, lastName: true } } },
        },
      },
      take: 100,
    }),
    db.user.findMany({
      where: { role: { in: ['EMPLOYEE', 'ADMIN'] } },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: 'asc' },
    }),
    db.modificationRequest.count({ where: { status: 'PENDING' } }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-text">Rendez-vous</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Gérez les rendez-vous, réassignez les stylistes et traitez les demandes de modification.
      </p>
      <AppointmentsManager
        initialAppointments={JSON.parse(JSON.stringify(appointments))}
        stylists={stylists}
        pendingRequestsCount={pendingRequests}
      />
    </div>
  );
}
