import { useEffect, useLayoutEffect } from 'react'
import {
  selectIsActive,
  selectUserHasBeenGreeted,
  syncCurrentDate,
} from '@lowkey-brokey/sdk'
import { Welcome } from './pages/welcome'
import { Setup } from './pages/setup'
import { useAppDispatch } from './use-app-dispatch'
import { useSelector } from 'react-redux'
import { useWebApp } from '@twa.js/sdk-react'

export default function App() {
  const dispatch = useAppDispatch()
  const webApp = useWebApp()

  const isActive = useSelector(selectIsActive)
  const userHasBeenGreeted = useSelector(selectUserHasBeenGreeted)

  useLayoutEffect(() => {
    webApp.setHeaderColor('#000000')
  }, [webApp])

  useLayoutEffect(() => {
    dispatch(syncCurrentDate())
  }, [dispatch])

  if (!isActive && !userHasBeenGreeted) {
    return <Welcome />
  }

  if (!isActive) {
    return <Setup />
  }

  return <div style={{ color: 'red' }}>Active Screen</div>
}
