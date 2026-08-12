export type Expense = {
  id: string
  amount: number
  category: string
  note: string
  /** ISO date, YYYY-MM-DD */
  date: string
}

export type Period = 'day' | 'week' | 'month'

export const CATEGORIES = [
  'Comida',
  'Transporte',
  'Hogar',
  'Salud',
  'Ocio',
  'Compras',
  'Servicios',
  'Otros',
] as const

export const CATEGORY_COLORS: Record<string, string> = {
  Comida: '#0ea5e9',
  Transporte: '#f59e0b',
  Hogar: '#8b5cf6',
  Salud: '#ef4444',
  Ocio: '#ec4899',
  Compras: '#14b8a6',
  Servicios: '#64748b',
  Otros: '#22c55e',
}
