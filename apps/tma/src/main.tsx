import React from 'react'
import ReactDOM from 'react-dom/client'
import { SDKProvider } from '@twa.js/sdk-react'
import { ErrorBoundary } from 'react-error-boundary'
import { createStore, hydrateBrokey, BrokeyState } from '@lowkey-brokey/sdk'
import { TWASDKLoader } from './twa-sdk-loader'
import App from './app'
import { Fallback } from './fallback'
import { Provider } from 'react-redux'
import { GlobalStyleWithTGColors } from './global-style'
import { LocalStorage } from './local-storage'

let store
function initializeStore() {
  store = createStore()
  const brokeyState = new LocalStorage().get<BrokeyState>('brokeyState')
  brokeyState && store.dispatch(hydrateBrokey(brokeyState))
}
initializeStore()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      {/* cssVars: true */}
      <SDKProvider initOptions={{ debug: import.meta.env.DEV }}>
        <TWASDKLoader>
          <Provider store={store}>
            <GlobalStyleWithTGColors />
            <App />
          </Provider>
        </TWASDKLoader>
      </SDKProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
