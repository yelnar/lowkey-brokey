import { useCallback, useMemo } from 'react'
import { useSelector, useStore } from 'react-redux'
import { styled } from 'styled-components'
import { formatRelative } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { deleteExpense, selectExpenses } from '@lowkey-brokey/sdk'
import { Expense } from './expense'
import { useAppDispatch } from '../use-app-dispatch'
import { LocalStorage } from '../local-storage'

const formatRelativeLocale = {
  lastWeek: "MMM d',' HH':'mm",
  yesterday: "'Yesterday at' HH':'mm",
  today: "'Today at' HH':'mm",
  tomorrow: "MMM d',' HH':'mm",
  nextWeek: "MMM d',' HH':'mm",
  other: "MMM d',' HH':'mm", // Difference: Add time to the date
}

const locale = {
  ...enUS,
  formatRelative: (token: keyof typeof formatRelativeLocale) =>
    formatRelativeLocale[token],
}

export function History() {
  const store = useStore()
  const dispatch = useAppDispatch()
  const expenses = useSelector(selectExpenses)

  const formattedExpenses = useMemo(() => {
    return Array.from(expenses)
      .reverse()
      .map((expense) => ({
        ...expense,
        datetime: formatRelative(expense.timestamp, new Date(), {
          locale,
        }),
      }))
  }, [expenses])

  const handleDelete = useCallback(
    (expenseTimestamp: number) => {
      dispatch(deleteExpense(expenseTimestamp))
      new LocalStorage().set('brokeyState', store.getState().brokey)
    },
    [store, dispatch]
  )

  return (
    <Root>
      {formattedExpenses.map((expense) => (
        <Expense
          key={expense.timestamp}
          expense={expense}
          onDelete={handleDelete}
        />
      ))}
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-bottom: 20px;
`
