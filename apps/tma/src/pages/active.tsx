import { useSelector } from 'react-redux'
import { useAppDispatch } from '../use-app-dispatch'
import { useLayoutEffect } from 'react'
import {
  checkCurrentDate,
  selectCurrentDate,
  selectHasCurrentDatePassed,
} from '@lowkey-brokey/sdk'

export function Active() {
  const dispatch = useAppDispatch()

  const currentDate = useSelector(selectCurrentDate)
  const hasCurrentDatePassed = useSelector(selectHasCurrentDatePassed)

  useLayoutEffect(() => {
    dispatch(checkCurrentDate())
  }, [dispatch, currentDate])

  if (hasCurrentDatePassed === undefined) {
    return <div>Loading...</div>
  }

  if (hasCurrentDatePassed) {
    return <div>Transition Screen</div>
    // return <TransitionScreen />;
  }

  return <div>Today Screen</div>
  //   return <TodayScreen />;
}
