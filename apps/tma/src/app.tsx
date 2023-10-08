import { useLayoutEffect } from 'react'
import { selectIsActive, syncCurrentDate } from '@lowkey-brokey/sdk'
import { Setup } from './pages/setup'
import { useAppDispatch } from './use-app-dispatch'
import { useSelector } from 'react-redux'
import { Active } from './pages/active'
import { useHeaderColor } from './hooks/useHeaderColor'
import { useBackgroundColor } from './hooks/useBackgroundColor'

export default function App() {
  const dispatch = useAppDispatch()
  const isActive = useSelector(selectIsActive)

  useHeaderColor('secondary')
  useBackgroundColor('secondary')

  useLayoutEffect(() => {
    dispatch(syncCurrentDate(false))
  }, [dispatch])

  return isActive ? <Active /> : <Setup />
}
