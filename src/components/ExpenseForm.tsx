import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { toISODate } from '../lib/dates'
import { CATEGORIES } from '../lib/types'
import type { Expense } from '../lib/types'
import type { ExpenseDraft } from '../lib/useExpenses'

type Props = {
  editing: Expense | null
  onSubmit: (draft: ExpenseDraft) => void
  onCancelEdit: () => void
}

const inputClass =
  'w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-neutral-500'

export function ExpenseForm({ editing, onSubmit, onCancelEdit }: Props) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => toISODate(new Date()))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editing) return
    setAmount(String(editing.amount))
    setCategory(editing.category)
    setNote(editing.note)
    setDate(editing.date)
    setError('')
  }, [editing])

  function reset() {
    setAmount('')
    setCategory(CATEGORIES[0])
    setNote('')
    setDate(toISODate(new Date()))
    setError('')
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsedAmount = Number(amount.replace(',', '.'))
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Introduce un importe mayor que 0.')
      return
    }
    onSubmit({ amount: Math.round(parsedAmount * 100) / 100, category, note: note.trim(), date })
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_1.5fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">Importe</span>
          <input
            className={inputClass}
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-label="Importe"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">Categoría</span>
          <select
            className={inputClass}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Categoría"
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">Fecha</span>
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-label="Fecha"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">Nota</span>
          <input
            className={inputClass}
            placeholder="Opcional"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            aria-label="Nota"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="h-[38px] rounded-lg bg-neutral-100 px-4 text-sm font-medium text-neutral-900 transition hover:bg-white"
          >
            {editing ? 'Guardar' : 'Añadir'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                reset()
                onCancelEdit()
              }}
              className="h-[38px] rounded-lg border border-neutral-800 px-3 text-sm text-neutral-300 transition hover:bg-neutral-800"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </form>
  )
}
