/**
 * index.jsx — Application entry point.
 * Wraps the app with the AHP context provider.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { AHPProvider } from "./context/AHPContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AHPProvider>
      <App />
    </AHPProvider>
  </React.StrictMode>
);
