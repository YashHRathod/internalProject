import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ToastContainer, Bounce } from "react-toastify";
import { AuthProvider } from "./context/AuthContext.jsx";
import { persistor, store } from './store/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}></PersistGate>
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  </Provider>
</BrowserRouter>

);
