import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";

import { store } from "./model/store.js";

import { BrowserRouter } from "react-router-dom";

import "./index.css";

import { AnimatePresence } from "framer-motion";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AnimatePresence mode="popLayout">
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </AnimatePresence>
  </React.StrictMode>
);
