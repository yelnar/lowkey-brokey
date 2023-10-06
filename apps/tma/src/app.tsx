import { useLayoutEffect } from 'react'
import { selectIsActive, syncCurrentDate } from '@lowkey-brokey/sdk'
import { Setup } from './pages/setup'
import { useAppDispatch } from './use-app-dispatch'
import { useSelector } from 'react-redux'
import { Active } from './pages/active'
import { useHeaderColor } from './hooks/useHeaderColor'

export default function App() {
  const dispatch = useAppDispatch()

  useHeaderColor('secondary')

  const isActive = useSelector(selectIsActive)

  useLayoutEffect(() => {
    dispatch(syncCurrentDate())
  }, [dispatch])

  if (!isActive) {
    return <Setup />
  }

  return <Active />
}
