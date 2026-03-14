import { db } from '@marrynov/database';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ClientsManager } from '@/components/staff/clients-manager';

export default async function StaffClientsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/?auth=login&callbackUrl=/staff/clients');
  if (session.user.role !== 'EMPLOYEE' && session.user.role !== 'ADMIN') redirect('/');

  const clients = await db.user.findMany({
    where: { role: 'CLIENT' },
    orderBy: { lastName: 'asc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatarUrl: true,
      createdAt: true,
      appointments: {
        orderBy: { date: 'desc' },
        take: 5,
        select: {
          id: true,
          date: true,
          startTime: true,
          status: true,
          totalPrice: true,
          services: { include: { service: { select: { name: true } } } },
          stylist: { select: { firstName: true } },
        },
      },
      clientNotes: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          author: { select: { firstName: true, lastName: true } },
        },
      },
      loyalty: {
        select: { currentVisits: true, totalVisits: true, rewardsEarned: true },
      },
      _count: { select: { appointments: true } },
    },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-text">Clients</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Consultez la fiche de vos clients, ajoutez des notes et suivez leur historique.
      </p>
      <ClientsManager initialClients={JSON.parse(JSON.stringify(clients))} />
    </div>
  );
}
