import { useWebApp } from '@twa.js/sdk-react'
import { styled } from 'styled-components'
import { Button } from '../components/button'

export function Update() {
  const webApp = useWebApp()

  const handleUpdate = () => {
    webApp.openLink('https://telegram.org/apps')
  }

  return (
    <Root>
      <h1>Update is required</h1>
      <p>Please update Telegram to use Brokey.</p>

      <Button fullWidth onClick={handleUpdate}>
        Update
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
    text-align: center;
  }
`
