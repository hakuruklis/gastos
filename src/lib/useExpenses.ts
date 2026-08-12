import { useCallback, useEffect, useState } from 'react'
import { loadExpenses, saveExpenses } from './storage'
import type { Expense } from './types'

export type ExpenseDraft = Omit<Expense, 'id'>

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses())

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const addExpense = useCallback((draft: ExpenseDraft) => {
    setExpenses((current) => [{ ...draft, id: crypto.randomUUID() }, ...current])
  }, [])

  const updateExpense = useCallback((id: string, draft: ExpenseDraft) => {
    setExpenses((current) =>
      current.map((expense) => (expense.id === id ? { ...draft, id } : expense)),
    )
  }, [])

  const removeExpense = useCallback((id: string) => {
    setExpenses((current) => current.filter((expense) => expense.id !== id))
  }, [])

  const replaceAll = useCallback((next: Expense[]) => {
    setExpenses(next)
  }, [])

  return { expenses, addExpense, updateExpense, removeExpense, replaceAll }
}
