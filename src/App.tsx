import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { Summary } from './components/Summary'
import {
  addDays,
  endOfPeriod,
  formatPeriodLabel,
  isInPeriod,
  shiftPeriod,
  startOfPeriod,
  toISODate,
} from './lib/dates'
import { parseImported } from './lib/storage'
import type { Expense, Period } from './lib/types'
import { useExpenses } from './lib/useExpenses'
import type { ExpenseDraft } from './lib/useExpenses'

const PERIODS: { id: Period; label: string }[] = [
  { id: 'day', label: 'Día' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mes' },
]

const dayLabel = new Intl.DateTimeFormat('es-ES', { weekday: 'short' })
const shortLabel = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' })

export default function App() {
  const { expenses, addExpense, updateExpense, removeExpense, replaceAll } = useExpenses()
  const [period, setPeriod] = useState<Period>('month')
  const [reference, setReference] = useState(() => new Date())
  const [editing, setEditing] = useState<Expense | null>(null)
  const [message, setMessage] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const visible = useMemo(
    () =>
      expenses
        .filter((expense) => isInPeriod(expense.date, reference, period))
        .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1)),
    [expenses, reference, period],
  )

  const total = visible.reduce((sum, expense) => sum + expense.amount, 0)

  const byCategory = useMemo(() => {
    const totals = new Map<string, number>()
    for (const expense of visible) {
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount)
    }
    return [...totals.entries()]
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value)
  }, [visible])

  const trend = useMemo(() => buildTrend(expenses, reference, period), [expenses, reference, period])

  const days = trend.length
  const average = period === 'day' ? (visible.length ? total / visible.length : 0) : total / days
  const averageLabel = period === 'day' ? 'Media por gasto' : 'Media diaria'

  function handleSubmit(draft: ExpenseDraft) {
    if (editing) {
      updateExpense(editing.id, draft)
      setEditing(null)
    } else {
      addExpense(draft)
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gastos-${toISODate(new Date())}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const imported = parseImported(await file.text())
      replaceAll(imported)
      setMessage(`Importados ${imported.length} gastos.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo importar el archivo.')
    }
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Gastos</h1>
          <p className="text-sm text-neutral-400">Tus datos se guardan solo en este navegador.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 transition hover:bg-neutral-800"
          >
            Exportar
          </button>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 transition hover:bg-neutral-800"
          >
            Importar
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </header>

      <ExpenseForm editing={editing} onSubmit={handleSubmit} onCancelEdit={() => setEditing(null)} />

      {message && (
        <p className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100">{message}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900 p-1">
          {PERIODS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPeriod(item.id)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                period === item.id
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <NavButton label="Anterior" onClick={() => setReference((d) => shiftPeriod(d, period, -1))}>
            ‹
          </NavButton>
          <span className="min-w-[11rem] text-center text-sm font-medium">
            {formatPeriodLabel(reference, period)}
          </span>
          <NavButton label="Siguiente" onClick={() => setReference((d) => shiftPeriod(d, period, 1))}>
            ›
          </NavButton>
          <button
            type="button"
            onClick={() => setReference(new Date())}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 transition hover:bg-neutral-800"
          >
            Hoy
          </button>
        </div>
      </div>

      <Summary
        total={total}
        average={average}
        averageLabel={averageLabel}
        count={visible.length}
        byCategory={byCategory}
        trend={trend}
      />

      <ExpenseList expenses={visible} onEdit={setEditing} onRemove={removeExpense} />
    </div>
  )
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="h-8 w-8 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 transition hover:bg-neutral-800"
    >
      {children}
    </button>
  )
}

function buildTrend(expenses: Expense[], reference: Date, period: Period) {
  const start = period === 'day' ? addDays(reference, -6) : startOfPeriod(reference, period)
  const end = period === 'day' ? reference : endOfPeriod(reference, period)

  const totals = new Map<string, number>()
  for (const expense of expenses) {
    totals.set(expense.date, (totals.get(expense.date) ?? 0) + expense.amount)
  }

  const points: { label: string; value: number }[] = []
  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    const iso = toISODate(cursor)
    points.push({
      label: period === 'month' ? String(cursor.getDate()) : formatTick(cursor, period),
      value: Math.round((totals.get(iso) ?? 0) * 100) / 100,
    })
  }
  return points
}

function formatTick(date: Date, period: Period): string {
  return period === 'week' ? dayLabel.format(date) : shortLabel.format(date)
}
