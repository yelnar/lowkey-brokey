import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'
import { CalendarSearch, Wallet } from 'lucide-react'
import { format } from 'date-fns'
import { calculate, selectCalculator } from '@lowkey-brokey/sdk'
import { useAppDispatch } from '../use-app-dispatch'
import { NumberUtils } from '../utils/number-utils'
import { useInitData } from '@twa.js/sdk-react'

export function Activation({
  title,
  subtitle,
  totalBudget,
  endDate,
  onBudgetChange,
  onEndDateChange,
}: {
  title: string
  subtitle: string
  totalBudget: number
  endDate: Date
  onBudgetChange: (budget: number) => void
  onEndDateChange: (endDate: Date) => void
}) {
  const dispatch = useAppDispatch()

  const calculator = useSelector(selectCalculator)
  const initData = useInitData()
  const languageCode = initData?.state?.state?.user?.languageCode

  useEffect(() => {
    dispatch(calculate(totalBudget, endDate))
  }, [dispatch, totalBudget, endDate])

  return (
    <Root>
      <Header>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Header>

      <InputContainer>
        <Label>
          <IconWrapper>
            <Wallet size={18} />
          </IconWrapper>
          Total Budget{' '}
        </Label>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="Total Budget"
          value={totalBudget}
          onChange={(e) => {
            const value = Number(e.target.value)
            onBudgetChange(Number.isNaN(value) ? 0 : value)
          }}
          autoFocus
        />
      </InputContainer>

      <InputContainer>
        <Label>
          <IconWrapper>
            <CalendarSearch size={18} />
          </IconWrapper>
          Last Day
        </Label>
        <Input
          type="date"
          placeholder="Last Day"
          min={format(new Date(), 'yyyy-MM-dd')}
          value={format(endDate, 'yyyy-MM-dd')}
          onChange={(e) => onEndDateChange(new Date(e.target.value))}
        />
      </InputContainer>

      <DailyAllowance>
        Your daily allowance will be{' '}
        <span>
          {NumberUtils.formatAmount(calculator.dailyBudget, languageCode)}
        </span>
      </DailyAllowance>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 25px;
  height: 100%;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: var(--tg-theme-text-color);
  margin: 0;
`

const Subtitle = styled.h2`
  font-size: 14px;
  font-weight: normal;
  color: var(--tg-theme-hint-color);
  margin: 0;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Label = styled.label`
  display: flex;
  font-size: 18px;
  align-items: center;
  gap: 8px;
  color: var(--tg-theme-hint-color);
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: var(--tg-theme-bg-color);
  border-radius: 38%;
`

const Input = styled.input`
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  font-size: 38px;
  color: var(--tg-theme-text-color);
  font-weight: bold;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-apperance: textfield;
  }

  &::-webkit-date-and-time-value {
    text-align: left;
  }
`

const DailyAllowance = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  text-align: center;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background: var(--tg-theme-bg-color);
  color: var(--tg-theme-hint-color);
  transition: top 0.2s ease-in-out;

  span {
    color: var(--tg-theme-text-color);
    font-weight: bold;
  }
`
