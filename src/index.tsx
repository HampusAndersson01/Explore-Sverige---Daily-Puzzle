import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { LanguageProvider } from "./LanguageContext";
import "./styles/index.css";
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
