import { useCallback } from 'react'

export function useBlur() {
  const blurBackground = useCallback(() => {
    document.getElementById('root')!.classList.add('blur')
  }, [])

  const unblurBackground = useCallback(() => {
    document.getElementById('root')!.classList.remove('blur')
  }, [])

  return { blurBackground, unblurBackground }
}
