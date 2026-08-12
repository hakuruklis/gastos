import type { Period } from './types'

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth() + months, 1)
  return next
}

/** Monday as first day of the week. */
export function startOfWeek(date: Date): Date {
  const day = (date.getDay() + 6) % 7
  return addDays(new Date(date.getFullYear(), date.getMonth(), date.getDate()), -day)
}

export function startOfPeriod(date: Date, period: Period): Date {
  if (period === 'day') return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  if (period === 'week') return startOfWeek(date)
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfPeriod(date: Date, period: Period): Date {
  const start = startOfPeriod(date, period)
  if (period === 'day') return start
  if (period === 'week') return addDays(start, 6)
  return new Date(start.getFullYear(), start.getMonth() + 1, 0)
}

export function shiftPeriod(date: Date, period: Period, direction: number): Date {
  if (period === 'day') return addDays(date, direction)
  if (period === 'week') return addDays(date, 7 * direction)
  return addMonths(date, direction)
}

export function isInPeriod(iso: string, reference: Date, period: Period): boolean {
  const start = toISODate(startOfPeriod(reference, period))
  const end = toISODate(endOfPeriod(reference, period))
  return iso >= start && iso <= end
}

const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
const dayFormatter = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const shortFormatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' })

export function formatPeriodLabel(date: Date, period: Period): string {
  if (period === 'day') return capitalize(dayFormatter.format(date))
  if (period === 'week') {
    const start = startOfWeek(date)
    return `${shortFormatter.format(start)} – ${shortFormatter.format(addDays(start, 6))}`
  }
  return capitalize(monthFormatter.format(date))
}

export function formatShortDate(iso: string): string {
  return shortFormatter.format(parseISODate(iso))
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
