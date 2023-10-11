import { useBackButton } from '@twa.js/sdk-react'
import { useCallback, useEffect } from 'react'

export function useTgBackButton(visible = true, onClick?: () => void) {
  const backButton = useBackButton()

  useEffect(() => {
    onClick && backButton.on('click', onClick)

    return () => {
      backButton.off('click', onClick)
    }
  }, [backButton, onClick])

  useEffect(() => {
    visible && backButton.show()

    return () => {
      backButton.hide()
    }
  }, [backButton, visible])

  const show = useCallback(() => {
    backButton.show()
  }, [backButton])

  const hide = useCallback(() => {
    backButton.hide()
  }, [backButton])

  return { show, hide }
}
