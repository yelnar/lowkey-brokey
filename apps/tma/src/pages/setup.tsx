import { useEffect, useState } from 'react'
import { useAppDispatch } from '../use-app-dispatch'
import { useStore } from 'react-redux'
import { useHapticFeedback } from '@twa.js/sdk-react'
import { activate, calculate } from '@lowkey-brokey/sdk'
import { LocalStorage } from '../local-storage'
import { Activation } from '../layout/activation'
import { useTgMainButton } from '../hooks/use-tg-main-button'

export function Setup() {
  const store = useStore()
  const dispatch = useAppDispatch()
  const haptic = useHapticFeedback()

  const [totalBudget, setTotalBudget] = useState(0)
  const [endDate, setEndDate] = useState(new Date())

  const handleActivate = () => {
    dispatch(activate(totalBudget, endDate))
    new LocalStorage().set('brokeyState', store.getState().brokey)
    haptic.impactOccurred('soft')
  }

  useTgMainButton(true, 'START', handleActivate, totalBudget === 0)

  useEffect(() => {
    dispatch(calculate(totalBudget, endDate))
  }, [dispatch, totalBudget, endDate])

  return (
    <Activation
      title={'Setup your budget'}
      subtitle={'Choose total budget and end date'}
      totalBudget={totalBudget}
      endDate={endDate}
      onBudgetChange={setTotalBudget}
      onEndDateChange={setEndDate}
    />
  )
}
