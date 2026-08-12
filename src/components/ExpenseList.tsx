import { formatShortDate } from '../lib/dates'
import { formatCurrency } from '../lib/format'
import { CATEGORY_COLORS } from '../lib/types'
import type { Expense } from '../lib/types'

type Props = {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onRemove: (id: string) => void
}

export function ExpenseList({ expenses, onEdit, onRemove }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900 p-10 text-center text-sm text-neutral-400">
        No hay gastos en este periodo.
      </div>
    )
  }

  return (
    <ul className="divide-y divide-neutral-800 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      {expenses.map((expense) => (
        <li key={expense.id} className="group flex items-center gap-3 px-4 py-3">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[expense.category] ?? '#a3a3a3' }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {expense.note || expense.category}
            </p>
            <p className="text-xs text-neutral-400">
              {expense.category} · {formatShortDate(expense.date)}
            </p>
          </div>
          <span className="text-sm font-semibold tabular-nums">
            {formatCurrency(expense.amount)}
          </span>
          <div className="flex gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={() => onEdit(expense)}
              className="rounded-md px-2 py-1 text-xs text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onRemove(expense.id)}
              className="rounded-md px-2 py-1 text-xs text-neutral-400 transition hover:bg-red-950 hover:text-red-400"
            >
              Borrar
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
