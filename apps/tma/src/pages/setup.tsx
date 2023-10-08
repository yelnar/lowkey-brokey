import { useEffect, useState } from 'react'
import { MainButton } from '../components/main-button'
import { useAppDispatch } from '../use-app-dispatch'
import { useStore } from 'react-redux'

import { activate, calculate } from '@lowkey-brokey/sdk'

import { LocalStorage } from '../local-storage'
import { Activation } from './activation'

export function Setup() {
  const store = useStore()
  const dispatch = useAppDispatch()

  const [totalBudget, setTotalBudget] = useState(0)
  const [endDate, setEndDate] = useState(new Date())

  const handleActivate = () => {
    dispatch(activate(totalBudget, endDate))
    new LocalStorage().set('brokeyState', store.getState().brokey)
  }

  useEffect(() => {
    dispatch(calculate(totalBudget, endDate))
  }, [dispatch, totalBudget, endDate])

  return (
    <>
      <Activation
        title={'Setup your budget'}
        subtitle={'Choose total budget and end date'}
        totalBudget={totalBudget}
        endDate={endDate}
        onBudgetChange={setTotalBudget}
        onEndDateChange={setEndDate}
      />
      <MainButton text="START" onClick={handleActivate} />
    </>
  )
}
