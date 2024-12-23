import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, useLocation } from "react-router-dom";
import "preline/preline";
import "./i18n";

declare global {
  interface Window {
    HSStaticMethods: {
      autoInit: () => void;
    };
  }
}

function MainApp() {
  const location = useLocation();

  useEffect(() => {
    if (
      window.HSStaticMethods &&
      typeof window.HSStaticMethods.autoInit === "function"
    ) {
      window.HSStaticMethods.autoInit();
    }
  }, [location.pathname]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  </React.StrictMode>
);
