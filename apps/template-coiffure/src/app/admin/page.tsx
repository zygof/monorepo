import {
  Calendar,
  Euro,
  Star,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  Heart,
  BarChart3,
} from 'lucide-react';
import { db } from '@marrynov/database';

export default async function AdminDashboard() {
  const today = new Date();
  const todayDate = new Date(today.toISOString().split('T')[0] + 'T00:00:00Z');
  const weekAgo = new Date(todayDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(todayDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Stats parallèles
  const [
    todayAppointments,
    weekRevenue,
    monthRevenue,
    prevMonthRevenue,
    totalClients,
    newClientsMonth,
    avgRating,
    totalReviews,
    recentReviews,
    monthCompleted,
    monthNoShows,
    monthCancelled,
    weekCompletedCount,
    loyaltyActive,
    upcomingCount,
    topServices,
  ] = await Promise.all([
    // RDV du jour
    db.appointment.findMany({
      where: { date: todayDate, status: { notIn: ['CANCELLED'] } },
      include: {
        client: { select: { firstName: true, lastName: true, phone: true } },
        services: { include: { service: { select: { name: true } } } },
        stylist: { select: { firstName: true } },
      },
      orderBy: { startTime: 'asc' },
    }),
    // CA semaine
    db.appointment.aggregate({
      where: { status: 'COMPLETED', date: { gte: weekAgo } },
      _sum: { totalPrice: true },
    }),
    // CA mois
    db.appointment.aggregate({
      where: { status: 'COMPLETED', date: { gte: monthAgo } },
      _sum: { totalPrice: true },
    }),
    // CA mois précédent (pour tendance)
    db.appointment.aggregate({
      where: {
        status: 'COMPLETED',
        date: {
          gte: new Date(monthAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
          lt: monthAgo,
        },
      },
      _sum: { totalPrice: true },
    }),
    // Total clients
    db.user.count({ where: { role: 'CLIENT' } }),
    // Nouveaux clients ce mois
    db.user.count({ where: { role: 'CLIENT', createdAt: { gte: monthAgo } } }),
    // Note moyenne
    db.review.aggregate({ where: { visible: true }, _avg: { rating: true } }),
    // Total avis
    db.review.count({ where: { visible: true } }),
    // 5 derniers avis
    db.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        author: { select: { firstName: true, lastName: true } },
        appointment: {
          select: { services: { include: { service: { select: { name: true } } } } },
        },
      },
    }),
    // RDV complétés ce mois
    db.appointment.count({ where: { status: 'COMPLETED', date: { gte: monthAgo } } }),
    // No-shows ce mois
    db.appointment.count({ where: { status: 'NO_SHOW', date: { gte: monthAgo } } }),
    // Annulations ce mois
    db.appointment.count({ where: { status: 'CANCELLED', date: { gte: monthAgo } } }),
    // RDV complétés cette semaine
    db.appointment.count({ where: { status: 'COMPLETED', date: { gte: weekAgo } } }),
    // Clients fidélité actifs
    db.loyaltyRecord.count({ where: { currentVisits: { gt: 0 } } }),
    // RDV à venir
    db.appointment.count({
      where: { date: { gt: todayDate }, status: { in: ['PENDING', 'CONFIRMED'] } },
    }),
    // Top services (les plus réservés ce mois)
    db.appointmentService.groupBy({
      by: ['serviceId'],
      _count: { serviceId: true },
      where: { appointment: { date: { gte: monthAgo }, status: { notIn: ['CANCELLED'] } } },
      orderBy: { _count: { serviceId: 'desc' } },
      take: 5,
    }),
  ]);

  // Récupérer les noms des top services
  const topServiceNames = await db.service.findMany({
    where: { id: { in: topServices.map((s) => s.serviceId) } },
    select: { id: true, name: true, startingPrice: true },
  });

  const topServicesWithNames = topServices.map((s) => {
    const svc = topServiceNames.find((n) => n.id === s.serviceId);
    return { name: svc?.name ?? '—', count: s._count.serviceId, price: svc?.startingPrice ?? 0 };
  });

  // Calculs
  const caMonth = (monthRevenue._sum.totalPrice ?? 0) / 100;
  const caPrevMonth = (prevMonthRevenue._sum.totalPrice ?? 0) / 100;
  const caTrend = caPrevMonth > 0 ? ((caMonth - caPrevMonth) / caPrevMonth) * 100 : 0;
  const caWeek = (weekRevenue._sum.totalPrice ?? 0) / 100;
  const noShowRate =
    monthCompleted + monthNoShows > 0
      ? ((monthNoShows / (monthCompleted + monthNoShows)) * 100).toFixed(0)
      : '0';
  const fillRate =
    monthCompleted + monthCancelled + monthNoShows > 0
      ? ((monthCompleted / (monthCompleted + monthCancelled + monthNoShows)) * 100).toFixed(0)
      : '—';

  // Statut badges pour les RDV
  const statusLabels: Record<string, { label: string; cls: string }> = {
    PENDING: { label: 'En attente', cls: 'bg-warning/10 text-warning' },
    CONFIRMED: { label: 'Confirmé', cls: 'bg-success/10 text-success' },
    IN_PROGRESS: { label: 'En cours', cls: 'bg-primary-light text-primary' },
    COMPLETED: { label: 'Terminé', cls: 'bg-success/10 text-success' },
    NO_SHOW: { label: 'Absent', cls: 'bg-error/10 text-error' },
    WALK_IN: { label: 'Sans RDV', cls: 'bg-secondary-light text-secondary' },
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-text">Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">
          Vue d&apos;ensemble —{' '}
          {today.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* ── Stats principales ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="RDV aujourd'hui"
          value={String(todayAppointments.length)}
          sub={`${upcomingCount} à venir`}
          color="text-primary"
          bg="bg-primary-light"
        />
        <StatCard
          icon={Euro}
          label="CA du mois"
          value={`${caMonth.toFixed(0)} €`}
          sub={`${caWeek.toFixed(0)} € cette semaine`}
          color="text-success"
          bg="bg-success/10"
          trend={caTrend}
        />
        <StatCard
          icon={Users}
          label="Clients"
          value={String(totalClients)}
          sub={`+${newClientsMonth} ce mois`}
          color="text-secondary"
          bg="bg-secondary-light"
        />
        <StatCard
          icon={Star}
          label="Note moyenne"
          value={avgRating._avg.rating ? `${avgRating._avg.rating.toFixed(1)}/5` : '—'}
          sub={`${totalReviews} avis`}
          color="text-warning"
          bg="bg-warning/10"
        />
      </div>

      {/* ── Stats secondaires ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniStat
          icon={TrendingUp}
          label="Taux de remplissage"
          value={`${fillRate}%`}
          color="text-success"
        />
        <MiniStat
          icon={AlertTriangle}
          label="No-shows (30j)"
          value={`${monthNoShows}`}
          sub={`${noShowRate}% des RDV`}
          color={monthNoShows > 0 ? 'text-error' : 'text-success'}
        />
        <MiniStat
          icon={Heart}
          label="Fidélité active"
          value={String(loyaltyActive)}
          sub="clients"
          color="text-primary"
        />
        <MiniStat
          icon={BarChart3}
          label="RDV complétés (7j)"
          value={String(weekCompletedCount)}
          color="text-secondary"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── RDV du jour ───────────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-text">
            <Clock size={18} className="text-primary" aria-hidden="true" />
            Rendez-vous du jour
          </h2>
          {todayAppointments.length === 0 ? (
            <p className="mt-4 text-sm text-text-muted">Aucun rendez-vous aujourd&apos;hui.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {todayAppointments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-xl bg-background p-3 gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text">
                        {a.startTime} — {a.endTime}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusLabels[a.status]?.cls ?? ''}`}
                      >
                        {statusLabels[a.status]?.label ?? a.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted truncate">
                      {a.client.firstName} {a.client.lastName}
                      {a.stylist ? ` · ${a.stylist.firstName}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0">
                    {a.services.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary"
                      >
                        {s.service.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Top services du mois ──────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-text">
            <BarChart3 size={18} className="text-secondary" aria-hidden="true" />
            Top services (30 jours)
          </h2>
          {topServicesWithNames.length === 0 ? (
            <p className="mt-4 text-sm text-text-muted">Pas encore de données.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {topServicesWithNames.map((s, i) => {
                const maxCount = topServicesWithNames[0]?.count ?? 1;
                const pct = (s.count / maxCount) * 100;
                return (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text">{s.name}</span>
                      <span className="text-sm font-bold text-text">
                        {s.count} RDV · {(s.price / 100).toFixed(0)} €
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-border">
                      <div
                        className="h-2 rounded-full bg-secondary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── Avis récents ──────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-text">
          <Star size={18} className="text-warning" aria-hidden="true" />
          Avis récents
        </h2>
        {recentReviews.length === 0 ? (
          <p className="mt-4 text-sm text-text-muted">Aucun avis pour le moment.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentReviews.map((r) => (
              <div key={r.id} className="rounded-xl bg-background p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text">
                    {r.author.firstName} {r.author.lastName}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < r.rating ? 'fill-warning text-warning' : 'text-border'}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-text-muted line-clamp-3">{r.comment}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.appointment.services.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {s.service.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Composants Stats ──────────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  bg,
  trend,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color: string;
  bg: string;
  trend?: number;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
        <Icon size={22} className={color} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {sub && <p className="text-xs text-text-muted truncate">{sub}</p>}
          {trend !== undefined && trend !== 0 && (
            <span
              className={`text-[10px] font-semibold ${trend > 0 ? 'text-success' : 'text-error'}`}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(0)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <Icon size={18} className={color} aria-hidden="true" />
      <div>
        <p className="text-[11px] text-text-muted">{label}</p>
        <p className={`text-lg font-bold ${color}`}>
          {value}
          {sub && <span className="ml-1 text-xs font-normal text-text-muted">{sub}</span>}
        </p>
      </div>
    </div>
  );
}
