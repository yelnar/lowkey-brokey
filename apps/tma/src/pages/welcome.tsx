import { greet } from '@lowkey-brokey/sdk'
import { useCallback } from 'react'
import { MainButton } from '../components/main-button'
import { useAppDispatch } from '../use-app-dispatch'

export function Welcome() {
  const dispatch = useAppDispatch()

  const onMainButtonClick = useCallback(() => {
    dispatch(greet())
  }, [dispatch])

  return (
    <>
      <main>
        <h2>Hey there 👋</h2>

        <p>I am Brokey!</p>
        <p>I am here to help you manage your budget.</p>
        <p>I know my name does not sound like a budgeting app 😅</p>
        <p>But I promise I am good at it.</p>
      </main>
      <MainButton text="CONTINUE" onClick={onMainButtonClick} />
    </>
  )
}
