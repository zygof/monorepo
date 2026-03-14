'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@marrynov/ui';
import type { BookingState, BookingAction, TeamMember } from '@/types/salon';

/* ── Helpers ─────────────────────────────────────────────────────────── */

const MONTHS_FR = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];
const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isDateOpen(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 1; // not Sunday (0), not Monday (1)
}

function isDatePast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

/** Minimum minutes of advance notice required to book a slot */
const MIN_LEAD_MIN = 60;

/** Returns (Date | null)[] for the calendar grid — null = empty cell */
function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = (firstDay.getDay() + 6) % 7; // 0=Mon, 6=Sun
  const days: (Date | null)[] = Array<null>(firstWeekday).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

/** Closing times in minutes from midnight */
const CLOSING_WEEKDAY = 18 * 60 + 30; // 18h30
const CLOSING_SATURDAY = 17 * 60; // 17h00

function minutesFromStr(timeStr: string): number {
  const parts = timeStr.split(':');
  return Number(parts[0]) * 60 + Number(parts[1]);
}

/** Static time slots with pseudo-random availability for demo realism.
 *  - tooLate  : start + totalDurationMin would exceed closing time
 *  - passed   : slot is in the past (today only, with MIN_LEAD_MIN buffer) */
function getTimeSlotsForDate(
  date: Date,
  totalDurationMin: number,
  nowMinutes: number | null, // null = not today
): Array<{ time: string; available: boolean; tooLate: boolean; passed: boolean }> {
  const isSaturday = date.getDay() === 6;
  const slots = isSaturday
    ? [
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
      ]
    : [
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
      ];
  const closingMin = isSaturday ? CLOSING_SATURDAY : CLOSING_WEEKDAY;
  const hash = date.getDate() * 3 + date.getMonth() * 7;
  return slots.map((time, i) => {
    const slotMin = minutesFromStr(time);
    return {
      time,
      available: (hash + i * 2 + 1) % 5 !== 0,
      tooLate: slotMin + totalDurationMin > closingMin,
      passed: nowMinutes !== null && slotMin <= nowMinutes + MIN_LEAD_MIN,
    };
  });
}

/** Returns true when today has no bookable slots left (all passed or tooLate) */
function isTodayFullyBooked(totalDurationMin: number): boolean {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isSaturday = now.getDay() === 6;
  const closingMin = isSaturday ? CLOSING_SATURDAY : CLOSING_WEEKDAY;
  const slots = isSaturday
    ? [
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
      ]
    : [
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
      ];
  return !slots.some((t) => {
    const m = minutesFromStr(t);
    return m > nowMin + MIN_LEAD_MIN && m + totalDurationMin <= closingMin;
  });
}

/* ── Sub-components ──────────────────────────────────────────────────── */

interface StylistCardProps {
  member: TeamMember;
  selected: boolean;
  onSelect: () => void;
}

function StylistCard({ member, selected, onSelect }: StylistCardProps) {
  return (
    <li>
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onSelect}
        className={cn(
          'group relative w-full rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          selected
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-border bg-surface hover:border-primary/40',
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-primary-light">
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text">{member.name}</p>
            <p className="text-xs text-text-muted truncate">{member.role}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {member.specialities.slice(0, 2).map((spec) => (
                <span
                  key={spec}
                  className="rounded-full bg-primary-light px-2 py-0.5 text-xs text-primary font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
          {selected && (
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary"
              aria-hidden="true"
            >
              <Check size={11} className="text-white" strokeWidth={3} />
            </span>
          )}
        </div>
      </button>
    </li>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */

interface StepDatetimeProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  teamMembers: TeamMember[];
}

export function StepDatetime({ state, dispatch, teamMembers }: StepDatetimeProps) {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const totalDurationMin = state.selectedServices.reduce(
    (sum, s) => sum + (s.durationMin ?? 60),
    0,
  );
  const todayStr = toDateString(today);
  const todayDisabled = !isDateOpen(today) || isTodayFullyBooked(totalDurationMin);

  const days = getMonthDays(calYear, calMonth);

  const nowMinutesForSlots =
    state.date === todayStr ? today.getHours() * 60 + today.getMinutes() : null;

  const timeSlots = state.date
    ? getTimeSlotsForDate(new Date(state.date + 'T00:00:00'), totalDurationMin, nowMinutesForSlots)
    : [];

  const canGoPrevMonth = !(calYear === today.getFullYear() && calMonth === today.getMonth());

  function prevMonth() {
    if (!canGoPrevMonth) return;
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else setCalMonth((m) => m - 1);
  }

  function nextMonth() {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else setCalMonth((m) => m + 1);
  }

  return (
    <section aria-labelledby="step-datetime-heading">
      <h2 id="step-datetime-heading" className="mb-1 text-2xl font-bold text-text font-serif">
        Date & Styliste
      </h2>
      <p className="mb-8 text-sm text-text-subtle">
        Choisissez votre styliste préféré(e), puis sélectionnez une date et un créneau disponible.
      </p>

      {/* Stylist selection */}
      <div className="mb-8">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
          Votre styliste
        </h3>
        <ul className="space-y-2" role="radiogroup" aria-label="Sélection du styliste">
          {/* First available */}
          <li>
            <button
              type="button"
              role="radio"
              aria-checked={state.stylistId === 'any'}
              onClick={() => dispatch({ type: 'SET_STYLIST', id: 'any' })}
              className={cn(
                'w-full rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                state.stylistId === 'any'
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-surface hover:border-primary/40',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text">
                    Premier(e) disponible{' '}
                    <span className="ml-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      Recommandé
                    </span>
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Le ou la styliste le(la) plus disponible sur votre créneau
                  </p>
                </div>
                {state.stylistId === 'any' && (
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary"
                    aria-hidden="true"
                  >
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </span>
                )}
              </div>
            </button>
          </li>

          {/* Individual stylists */}
          {teamMembers.map((member) => (
            <StylistCard
              key={member.id}
              member={member}
              selected={state.stylistId === member.id}
              onSelect={() => dispatch({ type: 'SET_STYLIST', id: member.id })}
            />
          ))}
        </ul>
      </div>

      {/* Calendar */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
          Choisissez une date
        </h3>

        <div className="rounded-2xl border border-border bg-surface p-5">
          {/* Month navigation */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrevMonth}
              aria-label="Mois précédent"
              className={cn(
                'rounded-lg p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                canGoPrevMonth
                  ? 'cursor-pointer hover:bg-primary-light text-text'
                  : 'text-border cursor-not-allowed',
              )}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <p className="text-sm font-semibold text-text capitalize">
              {MONTHS_FR[calMonth]} {calYear}
            </p>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Mois suivant"
              className="rounded-lg p-1.5 cursor-pointer text-text transition-colors hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 gap-1 text-center">
            {DAYS_FR.map((d) => (
              <div key={d} className="py-1 text-xs font-medium text-text-muted" aria-hidden="true">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} aria-hidden="true" />;
              const dateStr = toDateString(date);
              const isPast = isDatePast(date);
              const isClosed = !isDateOpen(date);
              const isToday = dateStr === todayStr;
              const isDisabled = isPast || isClosed || (isToday && todayDisabled);
              const isSelected = state.date === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => !isDisabled && dispatch({ type: 'SET_DATE', date: dateStr })}
                  disabled={isDisabled}
                  aria-label={`${date.getDate()} ${MONTHS_FR[calMonth]}${isClosed ? ' (fermé)' : ''}`}
                  aria-pressed={isSelected}
                  className={cn(
                    'relative rounded-lg py-2 text-sm font-medium transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    isSelected && 'cursor-pointer bg-primary text-white',
                    !isSelected &&
                      isToday &&
                      !isDisabled &&
                      'cursor-pointer border border-primary text-primary',
                    !isSelected &&
                      !isDisabled &&
                      !isToday &&
                      'cursor-pointer hover:bg-primary-light text-text',
                    isDisabled && 'text-border cursor-not-allowed',
                  )}
                >
                  {date.getDate()}
                  {isToday && !isSelected && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-text-muted text-center">Fermé le lundi et le dimanche</p>
        </div>
      </div>

      {/* Time slots */}
      {state.date && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
            Choisissez un créneau
          </h3>
          <div
            role="radiogroup"
            aria-label="Créneaux horaires disponibles"
            className="grid grid-cols-4 gap-2 sm:grid-cols-6"
          >
            {timeSlots.map(({ time, available, tooLate, passed }) => {
              const isDisabled = !available || tooLate || passed;
              const isSelected = state.timeSlot === time;
              const ariaLabel = `${time.replace(':', 'h')}${passed ? ' (déjà passé)' : tooLate ? ' (trop tard pour finir)' : !available ? ' (indisponible)' : ''}`;
              return (
                <button
                  key={time}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={ariaLabel}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && dispatch({ type: 'SET_TIME', slot: time })}
                  className={cn(
                    'rounded-xl border py-2.5 text-sm font-medium transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    isSelected && 'cursor-pointer border-primary bg-primary text-white',
                    !isSelected &&
                      !isDisabled &&
                      'cursor-pointer border-border bg-surface text-text hover:border-primary hover:text-primary',
                    passed &&
                      'border-border bg-surface text-border line-through opacity-35 cursor-not-allowed',
                    !available &&
                      !tooLate &&
                      !passed &&
                      'border-border bg-primary-light text-border line-through cursor-not-allowed',
                    tooLate &&
                      !passed &&
                      'border-dashed border-border bg-surface text-text-muted opacity-40 cursor-not-allowed',
                  )}
                >
                  {time.replace(':', 'h')}
                </button>
              );
            })}
          </div>
          {timeSlots.some((s) => s.tooLate) && totalDurationMin > 0 && (
            <p className="mt-3 text-xs text-text-muted">
              Les créneaux en pointillés sont trop tardifs pour terminer vos prestations (durée
              estimée&nbsp;:&nbsp;
              {totalDurationMin >= 60
                ? `${Math.floor(totalDurationMin / 60)}h${totalDurationMin % 60 > 0 ? String(totalDurationMin % 60).padStart(2, '0') : ''}`
                : `${totalDurationMin} min`}
              ).
            </p>
          )}
        </div>
      )}

      {!state.date && (
        <p className="text-center text-sm text-text-muted" role="status" aria-live="polite">
          Sélectionnez une date pour voir les créneaux disponibles.
        </p>
      )}
    </section>
  );
}
