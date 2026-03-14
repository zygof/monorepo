import { db } from '@marrynov/database';
import { auth } from '@/lib/auth';
import { DayPlanning } from '@/components/staff/day-planning';

interface StaffPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function StaffPage({ searchParams }: StaffPageProps) {
  const session = await auth();
  const params = await searchParams;
  const dateStr = params.date ?? new Date().toISOString().split('T')[0]!;
  const queryDate = new Date(dateStr + 'T00:00:00Z');
  const isAdmin = session?.user?.role === 'ADMIN';

  const appointments = await db.appointment.findMany({
    where: {
      date: queryDate,
      ...(isAdmin ? {} : { stylistId: session?.user?.id }),
    },
    orderBy: { startTime: 'asc' },
    include: {
      client: { select: { firstName: true, lastName: true, phone: true, email: true } },
      services: { include: { service: { select: { name: true, durationMin: true } } } },
      modRequests: { where: { status: 'PENDING' }, select: { id: true } },
    },
  });

  // Ajouter hasPendingModRequest pour chaque RDV
  const appointmentsWithModFlag = appointments.map((a) => ({
    ...a,
    hasPendingModRequest: a.modRequests.length > 0,
    modRequests: undefined,
  }));

  return (
    <DayPlanning
      initialDate={dateStr}
      appointments={JSON.parse(JSON.stringify(appointmentsWithModFlag))}
      userId={session?.user?.id ?? ''}
    />
  );
}
