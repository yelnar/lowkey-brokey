import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { styled, keyframes } from 'styled-components'
import { useHapticFeedback } from '@twa.js/sdk-react'
import { Trash2 } from 'lucide-react'
import { useBlur } from '../hooks/use-blur-background'
import { ExpenseOverlay } from './expense-overlay'
import { BlurDurationInMs } from '../global-style'

enum FocusState {
  Unfocused = 'Unfocused',
  Focusing = 'Focusing',
  Focused = 'Focused',
}

const LongDurationInMs = 300
const LongPressDelayInMs = 100

export function Expense({
  expense,
  onDelete,
}: {
  expense: { timestamp: number; datetime: string; amount: number }
  onDelete: (expenseTimestamp: number) => void
}) {
  const haptic = useHapticFeedback()

  const { blurBackground, unblurBackground } = useBlur()

  const rootRef = useRef<HTMLDivElement>(null)

  const [focusState, setFocusState] = useState<FocusState>(FocusState.Unfocused)

  const unfocus = useCallback(() => {
    setFocusState(FocusState.Unfocused)
  }, [])

  const handleDelete = useCallback(() => {
    unblurBackground()
    onDelete(expense.timestamp)
  }, [expense.timestamp, unblurBackground, onDelete])

  const handleTouchStart = useCallback(() => {
    setFocusState(FocusState.Focusing)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (focusState === FocusState.Focusing) {
      setFocusState(FocusState.Unfocused)
    }
  }, [focusState])

  const handleContextMenu = useCallback<MouseEventHandler>((event) => {
    event.preventDefault()
    setFocusState(FocusState.Focused)
  }, [])

  useEffect(() => {
    let timer = 0

    if (focusState === FocusState.Focusing) {
      // Wait for the long press to finish before setting to focused
      timer = setTimeout(() => {
        setFocusState(FocusState.Focused)
      }, LongDurationInMs + LongPressDelayInMs)
    }

    return () => {
      timer && clearTimeout(timer)
    }
  }, [focusState])

  useEffect(() => {
    if (focusState === FocusState.Focused) {
      blurBackground()
      haptic.impactOccurred('soft')
    } else if (focusState === FocusState.Unfocused) {
      unblurBackground()
    }
  }, [focusState, blurBackground, unblurBackground, haptic])

  const [isOverlayVisible, setOverlayVisible] = useState(false)

  useEffect(() => {
    if (focusState === FocusState.Focused) {
      setOverlayVisible(true)
    } else if (focusState === FocusState.Unfocused) {
      // Wait for the animation to finish before hiding the overlay
      const timer = setTimeout(() => {
        setOverlayVisible(false)
      }, BlurDurationInMs)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [focusState])

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

      {isOverlayVisible ? (
        <ExpenseOverlay onUnfocus={unfocus} top={rootTopRef.current}>
          {focusState === FocusState.Focused ? (
            <DeleteButton onClick={handleDelete} onTouchEnd={handleDelete}>
              Delete <Trash2 size={20} strokeWidth={2.25} />
            </DeleteButton>
          ) : null}
          <ExpenseCard>
            <DateTime>{expense.datetime}</DateTime>
            <Amount>{expense.amount}</Amount>
          </ExpenseCard>
        </ExpenseOverlay>
      ) : null}
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
  animation-duration: ${LongDurationInMs}ms;
  animation-delay: ${LongPressDelayInMs}ms;
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
