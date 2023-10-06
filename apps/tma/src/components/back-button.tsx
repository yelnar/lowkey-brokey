import { useEffect } from 'react'
import { useBackButton } from '@twa.js/sdk-react'

export function BackButton({ onClick }: { onClick: () => void }) {
  const backButton = useBackButton()

  useEffect(() => {
    backButton.show()

    return () => {
      backButton.hide()
    }
  }, [backButton])

  useEffect(() => {
    backButton.on('click', onClick)

    return () => {
      backButton.off('click', onClick)
    }
  }, [backButton, onClick])

  return null
}
