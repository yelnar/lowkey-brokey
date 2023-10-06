import { styled } from 'styled-components'
import { useEffect, useState } from 'react'
import { MainButton } from '../components/main-button'
import { useAppDispatch } from '../use-app-dispatch'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { activate, calculate, selectCalculator } from '@lowkey-brokey/sdk'
import { CalendarSearch, Wallet } from 'lucide-react'

export function Setup() {
  // const themeParams = useThemeParams()
  // const initData = useInitData()
  // const launchParams = useLaunchParams()

  // return (
  //   <pre>
  //     <code>{JSON.stringify(themeParams, null, ' ')}</code>
  //   </pre>
  // )

  const dispatch = useAppDispatch()

  const calculator = useSelector(selectCalculator)

  const [totalBudget, setTotalBudget] = useState(0)
  const [endDate, setEndDate] = useState(new Date())

  const handleActivate = () => {
    dispatch(activate(totalBudget, endDate))
  }

  useEffect(() => {
    dispatch(calculate(totalBudget, endDate))
  }, [dispatch, totalBudget, endDate])

  return (
    <Root>
      <Heading>Track your budget</Heading>

      <InputContainer>
        <Label>
          <IconWrapper>
            <Wallet size={18} />
          </IconWrapper>
          Total Budget{' '}
        </Label>
        <Input
          type="text"
          inputmode="numeric"
          placeholder="Total Budget"
          value={totalBudget}
          onChange={(e) => {
            const value = Number(e.target.value)
            setTotalBudget(Number.isNaN(value) ? 0 : value)
          }}
          autoFocus
        />
      </InputContainer>

      <InputContainer>
        <Label>
          <IconWrapper>
            <CalendarSearch size={18} />
          </IconWrapper>
          End Date
        </Label>
        <Input
          type="date"
          placeholder="End Date"
          value={format(endDate, 'yyyy-MM-dd')}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
      </InputContainer>

      <DailyAllowance>
        Your daily allowance will be <span>{calculator.dailyBudget}</span>.
      </DailyAllowance>

      <MainButton
        text="START"
        onClick={handleActivate}
        disabled={totalBudget === 0}
      />
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`

const Heading = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: var(--tg-theme-text-color);
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
  font-size: 48px;
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
  color: var(--tg-theme-hint-color);

  span {
    color: var(--tg-theme-text-color);
    font-weight: bold;
  }
`
