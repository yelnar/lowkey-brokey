import { useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import { styled } from 'styled-components'
import { addExpense } from '@lowkey-brokey/sdk'
import { MainButton } from '../components/main-button'
import { BackButton } from '../components/back-button'
import { useAppDispatch } from '../use-app-dispatch'
import { LocalStorage } from '../local-storage'

export function Spend({ close }: { close: () => void }) {
  const store = useStore()
  const dispatch = useAppDispatch()

  const [amount, setAmount] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const spend = () => {
    const numericAmount = Number(amount.replace(',', '.'))
    if (Number.isNaN(numericAmount)) {
      return
    }

    dispatch(addExpense(numericAmount, Date.now()))
    new LocalStorage().set('brokeyState', store.getState().brokey)
    setAmount('')
    close()
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Root>
      <BackButton onClick={close} />
      <Input
        type="text"
        value={amount}
        ref={inputRef}
        onChange={(e) => {
          const value = e.target.value
          const [match] = value.match(/([0-9]+[.|,]?)[0-9]*/) ?? []
          setAmount(match ?? '')
        }}
        inputMode="decimal"
        placeholder="Enter Amount"
      />
      <MainButton text={'SPEND'} onClick={spend} />
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  height: 100%;
  padding: 25px;
  background-color: var(--tg-theme-bg-color);
`

const Input = styled.input`
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  font-size: 48px;
  color: var(--tg-theme-text-color);
  font-weight: bold;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-apperance: textfield;
  }

  &::-webkit-date-and-time-value {
    text-align: left;
  }
`
