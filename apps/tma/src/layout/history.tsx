import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'
import { formatRelative } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { selectExpenses } from '@lowkey-brokey/sdk'
import { Expense } from './expense'

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

  return (
    <Root>
      {formattedExpenses.map((expense) => (
        <Expense key={expense.timestamp} expense={expense} />
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
