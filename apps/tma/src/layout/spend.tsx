import { useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import { styled } from 'styled-components'
import { useHapticFeedback } from '@twa.js/sdk-react'
import { addExpense } from '@lowkey-brokey/sdk'
import { useAppDispatch } from '../use-app-dispatch'
import { LocalStorage } from '../local-storage'
import { useTgMainButton } from '../hooks/use-tg-main-button'
import { useTgBackButton } from '../hooks/use-tg-back-button'

export function Spend({ close }: { close: () => void }) {
  const store = useStore()
  const dispatch = useAppDispatch()
  const haptic = useHapticFeedback()

  const [amount, setAmount] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const spend = () => {
    const numericAmount = Number(amount.replace(',', '.'))
    if (Number.isNaN(numericAmount) || numericAmount === 0) {
      return
    }

    dispatch(addExpense(numericAmount, Date.now()))
    new LocalStorage().set('brokeyState', store.getState().brokey)
    haptic.impactOccurred('soft')
    setAmount('')
    close()
  }

  useTgMainButton(true, 'SPEND', spend, amount === '')
  useTgBackButton(true, close)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Root>
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
      />
    </Root>
  )
}

const Root = styled.div`
  display: block;
  height: 100vh;
  padding: 25px;
  background-color: var(--tg-theme-bg-color);
  transition: height 0.1s ease-in-out;
`

const Input = styled.input`
  width: 100%;
  height: 100%;
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  font-size: 56px;
  text-align: center;
  color: var(--tg-theme-text-color);
  font-weight: bold;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-apperance: textfield;
  }
`
