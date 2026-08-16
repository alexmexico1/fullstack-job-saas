import React from "react";

// Remove tracking parameters from the visible URL.
if (window.location.search) {
  const url = new URL(window.location.href);
  const trackingParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  trackingParams.forEach((param) => url.searchParams.delete(param));

  const cleanUrl = url.pathname + (url.search ? url.search : "") + url.hash;
  window.history.replaceState({}, document.title, cleanUrl);
}

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./services/authService.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import App from "./App.jsx";
import "./index.css";
import "./taskflow-layout.css";
import "./dashboard-reference.css";
import "./taskflow-reference-fixes.css";
import "./taskflow-final-polish.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
