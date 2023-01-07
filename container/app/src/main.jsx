import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./appstate/store";
import { ToastProvider } from "./components/Toast";
import "./style/index.css";
import PageRoutes from "./navigation";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastProvider>
      <PageRoutes />
    </ToastProvider>
  </Provider>
);
