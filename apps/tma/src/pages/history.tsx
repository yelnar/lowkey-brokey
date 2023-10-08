import { selectExpenses } from '@lowkey-brokey/sdk'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'
import { formatRelative } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useMemo } from 'react'

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
        <Item key={expense.timestamp}>
          <DateTime>{expense.datetime}</DateTime>
          <Amount>{expense.amount}</Amount>
        </Item>
      ))}
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 10px;
  background-color: var(--tg-theme-bg-color);
`

const DateTime = styled.div`
  font-size: 16px;
  color: var(--tg-theme-hint-color);
`
const Amount = styled.div`
  font-weight: bold;
  font-size: 18px;
`
