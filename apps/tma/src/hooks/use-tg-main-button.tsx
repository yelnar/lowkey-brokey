import { useMainButton } from '@twa.js/sdk-react'
import { useCallback, useEffect } from 'react'

export function useTgMainButton(
  visible = true,
  text?: string,
  onClick?: () => void,
  disabled?: boolean
) {
  const mainButton = useMainButton()

  useEffect(() => {
    text && mainButton.setText(text)
  }, [mainButton, text])

  useEffect(() => {
    onClick && mainButton.on('click', onClick)
    return () => {
      mainButton.off('click', onClick)
    }
  }, [mainButton, onClick])

  useEffect(() => {
    if (disabled) {
      mainButton.setBackgroundColor('#2F2F2F')
      mainButton.setTextColor('#595959')
      mainButton.disable()
    } else {
      mainButton.setBackgroundColor()
      mainButton.setTextColor()
      mainButton.enable()
    }
  }, [mainButton, disabled])

  useEffect(() => {
    visible && mainButton.show()

    return () => {
      mainButton.hide()
    }
  }, [mainButton, visible])

  const show = useCallback(() => {
    mainButton.show()
  }, [mainButton])

  const hide = useCallback(() => {
    mainButton.hide()
  }, [mainButton])

  return { show, hide }
}
