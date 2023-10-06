import React from 'react'
import ReactDOM from 'react-dom/client'
import { SDKProvider } from '@twa.js/sdk-react'
import { ErrorBoundary } from 'react-error-boundary'
import { createStore } from '@lowkey-brokey/sdk'
import { TWASDKLoader } from './twa-sdk-loader'
import App from './app'
import { Fallback } from './fallback'
import { Provider } from 'react-redux'
import { GlobalStyleWithTGColors } from './global-style'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      {/* cssVars: true */}
      <SDKProvider initOptions={{ debug: true }}>
        <TWASDKLoader>
          <Provider store={createStore()}>
            <GlobalStyleWithTGColors />
            <App />
          </Provider>
        </TWASDKLoader>
      </SDKProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
