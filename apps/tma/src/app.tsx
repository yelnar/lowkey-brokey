import { useLayoutEffect } from 'react'
import { selectIsActive, syncCurrentDate } from '@lowkey-brokey/sdk'
import { Setup } from './pages/setup'
import { useAppDispatch } from './use-app-dispatch'
import { useSelector } from 'react-redux'
import { useThemeParams, useWebApp } from '@twa.js/sdk-react'
import { Active } from './pages/active'

export default function App() {
  const dispatch = useAppDispatch()
  const webApp = useWebApp()
  const themeParams = useThemeParams()

  const isActive = useSelector(selectIsActive)

  useLayoutEffect(() => {
    webApp.setHeaderColor(themeParams.state.state.secondaryBackgroundColor)
  }, [webApp, themeParams])

  useLayoutEffect(() => {
    dispatch(syncCurrentDate())
  }, [dispatch])

  if (!isActive) {
    return <Setup />
  }

  return <Active />
}
