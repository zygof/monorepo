import { db } from '@marrynov/database';
import { TeamManager } from '@/components/admin/team-manager';

export default async function AdminEquipePage() {
  const members = await db.user.findMany({
    where: { role: { in: ['EMPLOYEE', 'ADMIN'] } },
    orderBy: [{ role: 'asc' }, { firstName: 'asc' }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      bio: true,
      specialities: true,
      yearsExperience: true,
      quote: true,
      instagram: true,
      imageUrl: true,
    },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-text">Équipe</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Gérez les stylistes et administrateurs du salon.
      </p>
      <TeamManager initialMembers={JSON.parse(JSON.stringify(members))} />
    </div>
  );
}
