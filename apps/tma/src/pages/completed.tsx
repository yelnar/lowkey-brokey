import { deactivate, selectRemainingBudget } from '@lowkey-brokey/sdk'
import { useSelector, useStore } from 'react-redux'
import { styled } from 'styled-components'
import { NumberUtils } from '../utils/number-utils'
import { useAppDispatch } from '../use-app-dispatch'
import { LocalStorage } from '../local-storage'

export function Completed() {
  const store = useStore()
  const dispatch = useAppDispatch()
  const remainingBudget = useSelector(selectRemainingBudget)

  const handleComplete = () => {
    dispatch(deactivate())
    new LocalStorage().set('brokeyState', store.getState().brokey)
  }

  return (
    <Root>
      <h1>We've reached the end!</h1>
      <p>
        {remainingBudget > 0
          ? `Great job! You saved ${NumberUtils.formatAmount(remainingBudget)}!`
          : 'You will do better next time!'}
      </p>

      <Button fullWidth onClick={handleComplete}>
        Start a new plan
      </Button>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;

  h1 {
    font-size: 24px;
    font-weight: bold;
    color: var(--tg-theme-text-color);
    margin: 0;
  }

  p {
    font-size: 16px;
    font-weight: normal;
    color: var(--tg-theme-hint-color);
    margin: 0;
    margin-bottom: 16px;
  }
`

const Button = styled.button<{ fullWidth?: boolean }>`
  padding: 15px;
  max-height: 50px;
  border-radius: 12px;
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-primary-text-color);
  font-size: 18px;
  font-weight: bold;
  border: none;
  outline: none;
  cursor: pointer;
  width: ${({ fullWidth }: { fullWidth: boolean }) =>
    fullWidth ? '100%' : 'auto'};
`
