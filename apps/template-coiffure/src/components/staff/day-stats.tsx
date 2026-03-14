import { Calendar, Clock, Euro, Users } from 'lucide-react';

interface DayStatsProps {
  appointments: Array<{
    status: string;
    totalPrice: number;
    startTime: string;
    services: Array<{ service: { durationMin: number } }>;
  }>;
}

export function DayStats({ appointments }: DayStatsProps) {
  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
  const active = appointments.filter((a) =>
    ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(a.status),
  );
  const caEstime = appointments
    .filter((a) => !['CANCELLED', 'NO_SHOW'].includes(a.status))
    .reduce((sum, a) => sum + a.totalPrice, 0);

  // Prochain RDV
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const next = active
    .filter((a) => {
      const [h, m] = a.startTime.split(':').map(Number);
      return (h ?? 0) * 60 + (m ?? 0) >= nowMinutes;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

  const stats = [
    {
      icon: Calendar,
      label: 'RDV du jour',
      value: `${completed}/${total}`,
      color: 'text-primary',
      bg: 'bg-primary-light',
    },
    {
      icon: Users,
      label: 'En attente',
      value: String(active.length),
      color: 'text-secondary',
      bg: 'bg-secondary-light',
    },
    {
      icon: Euro,
      label: 'CA estimé',
      value: `${(caEstime / 100).toFixed(0)} €`,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      icon: Clock,
      label: 'Prochain',
      value: next ? next.startTime : '—',
      color: 'text-text',
      bg: 'bg-background',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-card"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
            <s.icon size={18} className={s.color} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs text-text-muted">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
