import { styled } from 'styled-components'
import { useSelector } from 'react-redux'
import { enUS } from 'date-fns/locale'
import { addDays, formatRelative } from 'date-fns'
import {
  selectCurrentBalance,
  selectEndDate,
  selectRemainingBudget,
} from '@lowkey-brokey/sdk'
import { NumberUtils } from '../utils/number-utils'
import { useInitData } from '@twa.js/sdk-react'

const formatRelativeLocale = {
  lastWeek: 'MMM d',
  yesterday: 'MMM d',
  today: 'MMM d',
  tomorrow: "'Tomorrow'",
  nextWeek: 'MMM d',
  other: 'MMM d',
}

const locale = {
  ...enUS,
  formatRelative: (token: keyof typeof formatRelativeLocale) =>
    formatRelativeLocale[token],
}

export function Today() {
  const currentBalance = useSelector(selectCurrentBalance)
  const remainingBudget = useSelector(selectRemainingBudget)
  const endDate = useSelector(selectEndDate)

  const initData = useInitData()
  const languageCode = initData?.state?.state?.user?.languageCode

  return (
    <Root>
      <HeadingHint>Available Today</HeadingHint>
      <Heading>
        {NumberUtils.formatAmount(currentBalance, languageCode)}
      </Heading>
      <Overview>
        {NumberUtils.formatAmount(remainingBudget, languageCode)} until{' '}
        {formatRelative(addDays(new Date(endDate), 1), new Date(), { locale })}
      </Overview>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`

const Heading = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: var(--tg-theme-text-color);
  margin: 0;
`

const HeadingHint = styled.h2`
  font-size: 18px;
  font-weight: normal;
  color: var(--tg-theme-text-color);
  margin: 0;
`

const Overview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--tg-theme-hint-color);
`
