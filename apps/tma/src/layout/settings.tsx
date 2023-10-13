import { useEffect, useState } from 'react'
import { useSelector, useStore } from 'react-redux'
import { useHapticFeedback } from '@twa.js/sdk-react'
import {
  activate,
  calculate,
  selectEndDate,
  selectRemainingBudget,
} from '@lowkey-brokey/sdk'
import { useAppDispatch } from '../use-app-dispatch'
import { LocalStorage } from '../local-storage'
import { NumberUtils } from '../utils/number-utils'
import { Activation } from './activation'
import { useTgMainButton } from '../hooks/use-tg-main-button'
import { useTgBackButton } from '../hooks/use-tg-back-button'

export function Settings({ close }: { close: () => void }) {
  const store = useStore()
  const dispatch = useAppDispatch()
  const haptic = useHapticFeedback()

  const currentEndDate = useSelector(selectEndDate)
  const currentRemainingBudget = useSelector(selectRemainingBudget)

  const [totalBudget, setTotalBudget] = useState(
    NumberUtils.round(currentRemainingBudget)
  )
  const [endDate, setEndDate] = useState(
    currentEndDate ? new Date(currentEndDate) : new Date()
  )

  const handleUpdateBudget = () => {
    dispatch(activate(totalBudget, endDate))
    new LocalStorage().set('brokeyState', store.getState().brokey)
    haptic.impactOccurred('soft')
    close()
  }

  useTgMainButton(true, 'UPDATE', handleUpdateBudget, totalBudget === 0)
  useTgBackButton(true, close)

  useEffect(() => {
    dispatch(calculate(totalBudget, endDate))
  }, [dispatch, totalBudget, endDate])

  return (
    <Activation
      title={'Reset your plan'}
      subtitle="Start with a clean slate"
      totalBudget={totalBudget}
      endDate={endDate}
      onBudgetChange={setTotalBudget}
      onEndDateChange={setEndDate}
    />
  )
}
