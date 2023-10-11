import { useState } from 'react'
import { styled } from 'styled-components'
import { History } from '../layout/history'
import { Today } from '../layout/today'
import { Spend } from '../layout/spend'
import { useHeaderColor } from '../hooks/useHeaderColor'
import { useBackgroundColor } from '../hooks/useBackgroundColor'
import { Cog } from 'lucide-react'
import { Settings } from '../layout/settings'
import { useTgMainButton } from '../hooks/use-tg-main-button'
import { useTgBackButton } from '../hooks/use-tg-back-button'

export function Active() {
  const [isSpending, setSpending] = useState(false)
  const [isConfiguring, setConfiguring] = useState(false)

  useTgMainButton(false)
  useTgBackButton(false)
  useHeaderColor(isSpending ? 'primary' : 'secondary')
  useBackgroundColor(isSpending ? 'primary' : 'secondary')

  if (isConfiguring) {
    return (
      <Settings
        close={() => {
          setConfiguring(false)
        }}
      />
    )
  }

  if (isSpending) {
    return (
      <Spend
        close={() => {
          setSpending(false)
        }}
      />
    )
  }

  return (
    <Root>
      <Today />

      <ButtonsContainer>
        <Button onClick={() => setSpending(true)} fullWidth>
          Add Expense
        </Button>
        <Button
          onClick={() => {
            setConfiguring(true)
          }}
        >
          <Cog size={20} strokeWidth={2.25} />
        </Button>
      </ButtonsContainer>
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
  padding: 25px 25px 0 25px;
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

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`
