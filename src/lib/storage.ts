import type { Expense } from './types'

const STORAGE_KEY = 'gastos:expenses:v1'

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isExpense)
  } catch {
    return []
  }
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

export function isExpense(value: unknown): value is Expense {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.amount === 'number' &&
    Number.isFinite(candidate.amount) &&
    typeof candidate.category === 'string' &&
    typeof candidate.note === 'string' &&
    typeof candidate.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(candidate.date)
  )
}

export function parseImported(json: string): Expense[] {
  const parsed: unknown = JSON.parse(json)
  if (!Array.isArray(parsed)) throw new Error('El archivo no contiene una lista de gastos.')
  const expenses = parsed.filter(isExpense)
  if (expenses.length === 0) throw new Error('No se encontraron gastos válidos en el archivo.')
  return expenses
}
