import { useCallback } from 'react'
import { MainButton } from './components/main-button'

export default function App() {
  const onClick = useCallback(() => {
    console.log('Main button clicked')
  }, [])

  return (
    <>
      <div>Telegram Mini App</div>
      <MainButton onClick={onClick} text="Continue" />
    </>
  )
}
