import { useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { addDays, formatRelative } from 'date-fns'
import { useAppDispatch } from '../use-app-dispatch'
import {
  checkCurrentDate,
  selectCurrentDate,
  selectEndDate,
  selectHasCurrentDatePassed,
  selectRemainingBudget,
} from '@lowkey-brokey/sdk'
import { styled } from 'styled-components'
import { History } from './history'
import { Today } from './today'
import { MainButton } from '../components/main-button'
import { Spend } from './spend'
import { useHeaderColor } from '../hooks/useHeaderColor'
import { round } from '../utils/round'
import { enUS } from 'date-fns/esm/locale'

const formatRelativeLocale = {
  lastWeek: 'MMM d',
  yesterday: 'MMM d',
  today: "'End of Today'",
  tomorrow: "'Tomorrow'",
  nextWeek: 'MMM d',
  other: 'MMM d',
}

const locale = {
  ...enUS,
  formatRelative: (token) => formatRelativeLocale[token],
}

export function Active() {
  const dispatch = useAppDispatch()

  const remainingBudget = useSelector(selectRemainingBudget)
  const endDate = useSelector(selectEndDate)

  const currentDate = useSelector(selectCurrentDate)
  const hasCurrentDatePassed = useSelector(selectHasCurrentDatePassed)

  const [isSpending, setSpending] = useState(false)

  useHeaderColor(isSpending ? 'primary' : 'secondary')

  useLayoutEffect(() => {
    dispatch(checkCurrentDate())
  }, [dispatch, currentDate])

  if (hasCurrentDatePassed === undefined) {
    return <div>Loading...</div>
  }

  if (hasCurrentDatePassed) {
    return <div>Transition Screen</div>
  }

  return isSpending ? (
    <Spend
      close={() => {
        console.log('close')
        setSpending(false)
      }}
    />
  ) : (
    <Root>
      <Today />
      <Overview>
        {round(remainingBudget)} until{' '}
        {formatRelative(addDays(new Date(endDate), 1), new Date(), { locale })}
      </Overview>
      <Button onClick={() => setSpending(true)}>Add Expense</Button>
      <History />
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  height: 100%;
  padding: 25px;
`

const Button = styled.button`
  padding: 15px;
  border-radius: 12px;
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-primary-text-color);
  font-size: 18px;
  font-weight: bold;
  border: none;
  outline: none;
  cursor: pointer;
`

const Overview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--tg-theme-hint-color);
`
