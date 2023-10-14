import { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { styled } from 'styled-components'

export function ExpenseOverlay({
  children,
  onUnfocus,
  top,
}: PropsWithChildren<{
  onUnfocus: () => void
  top: number
}>) {
  return createPortal(
    <Root onClick={onUnfocus} onTouchEnd={onUnfocus}>
      <Position top={top}>{children}</Position>
    </Root>,
    document.getElementById('backdrop-root')!
  )
}

const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0 25px;
`

const Position = styled.div<{ top: number }>`
  position: relative;
  top: ${(props: { top: number }) => props.top}px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
