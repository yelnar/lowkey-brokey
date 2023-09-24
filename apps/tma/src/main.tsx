import React from "react";
import ReactDOM from "react-dom/client";
import { SDKProvider } from "@twa.js/sdk-react";
import "./global.css";
import App from "./app";
import { TWASDKLoader } from "./twa-sdk-loader";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SDKProvider initOptions={{ debug: true, cssVars: true }}>
      <TWASDKLoader>
        <App />
      </TWASDKLoader>
    </SDKProvider>
  </React.StrictMode>
);
