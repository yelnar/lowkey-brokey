import { useLayoutEffect } from 'react'
import {
  selectIsActive,
  selectHasCompleted,
  syncCurrentDate,
} from '@lowkey-brokey/sdk'
import { Setup } from './pages/setup'
import { useAppDispatch } from './use-app-dispatch'
import { useSelector } from 'react-redux'
import { Active } from './pages/active'
import { Completed } from './pages/completed'
import { useBackgroundColor } from './hooks/use-background-color'

export default function App() {
  const dispatch = useAppDispatch()
  const isActive = useSelector(selectIsActive)
  const hasCompleted = useSelector(selectHasCompleted)

  useBackgroundColor('secondary')

  useLayoutEffect(() => {
    dispatch(syncCurrentDate(false))
  }, [dispatch])

  if (!isActive) {
    return <Setup />
  }

  if (hasCompleted) {
    return <Completed />
  }

  return <Active />
}
