import { styled, keyframes } from 'styled-components'
import { MouseEventHandler, useCallback, useRef, useState } from 'react'
import { useHapticFeedback } from '@twa.js/sdk-react'
import { createPortal } from 'react-dom'
import { Trash2 } from 'lucide-react'
import { useAppDispatch } from '../use-app-dispatch'
import { deleteExpense } from '@lowkey-brokey/sdk'
import { useStore } from 'react-redux'
import { LocalStorage } from '../local-storage'
import { useBlur } from '../hooks/use-blur-background'

enum FocusState {
  NotFocused = 'NotFocused',
  Focusing = 'Focusing',
  Focused = 'Focused',
}

const LongPressDelay = 420

export function Expense({
  expense,
}: {
  expense: { timestamp: number; datetime: string; amount: number }
}) {
  const store = useStore()
  const dispatch = useAppDispatch()
  const haptic = useHapticFeedback()

  const { blurBackground, unblurBackground } = useBlur()

  const handleDelete = useCallback(() => {
    dispatch(deleteExpense(expense.timestamp))
    new LocalStorage().set('brokeyState', store.getState().brokey)
  }, [store, dispatch, expense])

  const rootRef = useRef<HTMLDivElement>(null)
  const timer = useRef(0)

  const [focusState, setFocusState] = useState<FocusState>(
    FocusState.NotFocused
  )

  const focus = useCallback(() => {
    haptic.impactOccurred('soft')
    setFocusState(FocusState.Focused)
    blurBackground()
  }, [blurBackground, haptic])

  const unfocus = useCallback(() => {
    unblurBackground()
    setFocusState(FocusState.NotFocused)
  }, [unblurBackground])

  const handleTouchStart = useCallback(() => {
    setFocusState(FocusState.Focusing)
    timer.current = setTimeout(focus, LongPressDelay)
  }, [focus])

  const handleTouchEnd = useCallback(() => {
    clearTimeout(timer.current)
    setFocusState(FocusState.NotFocused)
  }, [])

  const handleContextMenu = useCallback<MouseEventHandler>(
    (event) => {
      event.preventDefault()
      focus()
    },
    [focus]
  )

  const rootTopRef = useRef(0)
  if (focusState === FocusState.Focused && rootRef.current) {
    const { top } = rootRef.current.getBoundingClientRect()
    rootTopRef.current = top
  }

  return (
    <>
      <ExpenseCard
        ref={rootRef}
        focusState={focusState}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
      >
        <DateTime>{expense.datetime}</DateTime>
        <Amount>{expense.amount}</Amount>
      </ExpenseCard>
      {focusState === FocusState.Focused
        ? createPortal(
            <FocusWrapper onClick={unfocus}>
              <FocusPositioner top={rootTopRef.current}>
                <DeleteButton onClick={handleDelete}>
                  Delete <Trash2 size={20} strokeWidth={2.25} />
                </DeleteButton>
                <ExpenseCard>
                  <DateTime>{expense.datetime}</DateTime>
                  <Amount>{expense.amount}</Amount>
                </ExpenseCard>
              </FocusPositioner>
            </FocusWrapper>,
            document.getElementById('backdrop-root')!
          )
        : null}
    </>
  )
}

const shrinkAnimation = keyframes`
    from { transform: scale(1); }
    to { transform: scale(0.93); }
`

const ExpenseCard = styled.div<{ focusState?: FocusState }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 10px;
  background-color: var(--tg-theme-bg-color);
  width: 100%;

  animation-name: ${(props: { focusState?: FocusState }) =>
    props.focusState === FocusState.Focusing && shrinkAnimation};
  animation-duration: 0.3s;
  animation-delay: 0.1s;
  animation-timing-function: ease-in-out;
`

const DateTime = styled.div`
  font-size: 16px;
  color: var(--tg-theme-hint-color);
`

const Amount = styled.div`
  font-weight: bold;
  font-size: 18px;
`

const FocusWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0 25px;
`

const FocusPositioner = styled.div<{ top: number }>`
  position: relative;
  top: ${(props: { top: number }) => props.top}px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const DeleteButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0px;
  display: flex;
  direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: var(--tg-theme-secondary-bg-color);
  color: #e63946;
  padding: 12px 16px;
  gap: 60px;
  border-radius: 10px;
  border: none;
  outline: none;
`
