import { useEffect } from 'react'
import { useThemeParams, useWebApp } from '@twa.js/sdk-react'

export function useBackgroundColor(color?: 'primary' | 'secondary') {
  const themeParams = useThemeParams()
  const webApp = useWebApp()

  useEffect(() => {
    const colors = themeParams.state.state
    webApp.setBackgroundColor(
      colors[
        color === 'primary' ? 'backgroundColor' : 'secondaryBackgroundColor'
      ]
    )
  }, [webApp, themeParams, color])
}
