import { useEffect } from 'react'
import { useThemeParams, useWebApp } from '@twa.js/sdk-react'

export function useHeaderColor(color?: 'primary' | 'secondary') {
  const themeParams = useThemeParams()
  const webApp = useWebApp()

  useEffect(() => {
    const colors = themeParams.state.state
    webApp.setHeaderColor(
      colors[
        color === 'primary' ? 'backgroundColor' : 'secondaryBackgroundColor'
      ]
    )
  }, [webApp, themeParams, color])
}
