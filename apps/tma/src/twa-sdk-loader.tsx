import { PropsWithChildren, useMemo } from 'react'
import { useSDK } from '@twa.js/sdk-react'
import { styled } from 'styled-components'

export function TWASDKLoader({ children }: PropsWithChildren) {
  const { didInit, components, error } = useSDK()
  const errorMessage = useMemo<null | string>(() => {
    if (!error) {
      return null
    }

    return error instanceof Error ? error.message : 'Unknown error'
  }, [error])

  if (!didInit) {
    return <Root>Loading...</Root>
  }

  if (error !== null) {
    return (
      <Root>
        <p>Unable to initialize. You should run it as Telegram Mini App.</p>
        <blockquote>
          <p>{errorMessage}</p>
        </blockquote>
      </Root>
    )
  }

  if (components === null) {
    return <Root>Loading...</Root>
  }

  return <>{children}</>
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: var(--tg-theme-bg-color);
`
