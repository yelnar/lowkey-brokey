import { useEffect } from 'react'
import { useMainButton } from '@twa.js/sdk-react'

export function MainButton({
  onClick,
  text,
  disabled,
}: {
  onClick: () => void
  text: string
  disabled?: boolean
}) {
  const mainButton = useMainButton()

  useEffect(() => {
    mainButton.setText(text).show()

    return () => {
      mainButton.hide()
    }
  }, [mainButton, text])

  useEffect(() => {
    mainButton.on('click', onClick)

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

  return null
}
