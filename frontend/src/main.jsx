
/* TASKFLOW_URL_CLEANUP */
if (typeof window !== "undefined") {
  const url = new URL(window.location.href);

  if (url.searchParams.has("utm_source")) {
    url.searchParams.delete("utm_source");
    window.history.replaceState(
      {},
      document.title,
      url.pathname +
        (url.searchParams.toString()
          ? "?" + url.searchParams.toString()
          : "") +
        url.hash
    );
  }
}

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./services/authService.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import App from "./App.jsx";
import "./index.css";
import "./taskflow-layout.css";
import "./taskflow-premium.css";
import "./taskflow-dark.css";

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
