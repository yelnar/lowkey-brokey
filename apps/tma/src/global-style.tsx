import { createGlobalStyle, css } from 'styled-components'
import { normalize } from 'styled-normalize'
import { useThemeParams } from '@twa.js/sdk-react'

const createGlobalThemeVariables = (props: TelegramThemeColors) => css`
  :root {
    --tg-theme-bg-color: ${props.backgroundColor || '#000000'};
    --tg-theme-text-color: ${props.textColor || '#fafafa'};
    --tg-theme-hint-color: ${props.hintColor || '#a1a1aa'};
    --tg-theme-link-color: ${props.linkColor || '#62bcf9'};
    --tg-theme-button-color: ${props.buttonColor || '#2ea6ff'};
    --tg-theme-button-text-color: ${props.buttonTextColor || '#ffffff'};
    --tg-theme-secondary-bg-color: ${props.secondaryBackgroundColor ||
    '#27272a'};
  }
`

export const ThemeGlobalStyle = css`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html,
  body {
    background: var(--tg-theme-secondary-bg-color);
    color: var(--tg-theme-text-color);
    padding: 15px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`

type TelegramThemeColors = {
  backgroundColor: string
  buttonTextColor: string
  buttonColor: string
  hintColor: string
  linkColor: string
  textColor: string
  secondaryBackgroundColor: string
}

const GlobalStyle = createGlobalStyle<TelegramThemeColors>`
  ${(props) => createGlobalThemeVariables(props)}
  ${normalize}
  ${ThemeGlobalStyle}
`

export const GlobalStyleWithTGColors = () => {
  const themeParams = useThemeParams()
  return <GlobalStyle {...themeParams.state.state} />
}
