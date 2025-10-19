import React from "react";
import ReactDOM from "react-dom/client";
import { hydrate, render } from "react-dom";
import "@/index.css";
import App from "@/App";

const rootElement = document.getElementById("root");

// Use hydrate for react-snap pre-rendered pages, render for normal
if (rootElement.hasChildNodes()) {
  hydrate(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
