import { styled } from 'styled-components'
import { round } from '../utils/round'
import { useSelector } from 'react-redux'
import { selectCurrentBalance } from '@lowkey-brokey/sdk'

export function Today() {
  const currentBalance = useSelector(selectCurrentBalance)

  return (
    <Root>
      <HeadingHint>Available Today</HeadingHint>
      <Heading>{round(currentBalance)}</Heading>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Heading = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: var(--tg-theme-text-color);
  margin: 0;
`

const HeadingHint = styled.h2`
  font-size: 18px;
  font-weight: normal;
  //   color: var(--tg-theme-hint-color);
  color: var(--tg-theme-text-color);
  margin: 0;
`
