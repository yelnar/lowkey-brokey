import { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { styled } from 'styled-components'

export function Button({
  children,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { fullWidth?: boolean }
>) {
  return <Root {...props}>{children}</Root>
}

const Root = styled.button`
  padding: 15px;
  max-height: 50px;
  border-radius: 12px;
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  font-size: 18px;
  font-weight: bold;
  border: none;
  outline: none;
  cursor: pointer;
  width: ${({ fullWidth }: { fullWidth: boolean }) =>
    fullWidth ? '100%' : 'auto'};
`
