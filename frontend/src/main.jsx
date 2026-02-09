import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ToastContainer, Bounce } from "react-toastify";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <Provider store={store}>
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  </Provider>
</BrowserRouter>

);
