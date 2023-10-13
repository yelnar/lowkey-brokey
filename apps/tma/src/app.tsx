import { useLayoutEffect } from 'react'
import { useLaunchParams } from '@twa.js/sdk-react'
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
import { Update } from './pages/update'
import { useBackgroundColor } from './hooks/use-background-color'
import { requiresUpdate } from './utils/requires-update'

export default function App() {
  const dispatch = useAppDispatch()
  const isActive = useSelector(selectIsActive)
  const hasCompleted = useSelector(selectHasCompleted)

  useBackgroundColor('secondary')

  useLayoutEffect(() => {
    dispatch(syncCurrentDate(false))
  }, [dispatch])

  const { version } = useLaunchParams()
  const shouldUpdate = requiresUpdate(version)

  if (shouldUpdate) {
    return <Update />
  }

  if (!isActive) {
    return <Setup />
  }

  if (hasCompleted) {
    return <Completed />
  }

  return <Active />
}
