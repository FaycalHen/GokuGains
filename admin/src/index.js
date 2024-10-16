import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Create a root

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router> {/* Wrap App with Router */}
        <App />
      </Router>
    </PersistGate>
  </Provider>
);
