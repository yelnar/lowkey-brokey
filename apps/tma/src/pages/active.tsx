import { useState } from 'react'
import { styled } from 'styled-components'
import { History } from '../layout/history'
import { Today } from '../layout/today'
import { Spend } from '../layout/spend'
import { useBackgroundColor } from '../hooks/use-background-color'
import { Cog } from 'lucide-react'
import { Settings } from '../layout/settings'
import { useTgMainButton } from '../hooks/use-tg-main-button'
import { useTgBackButton } from '../hooks/use-tg-back-button'
import { Button } from '../components/button'

export function Active() {
  const [isSpending, setSpending] = useState(false)
  const [isConfiguring, setConfiguring] = useState(false)

  useTgMainButton(false)
  useTgBackButton(false)
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

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`
