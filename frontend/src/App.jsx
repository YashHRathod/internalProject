import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import Layout from "./components/Layout";

import SignUp from "./components/authentication/SignUp/SignUp";
import Login from "./components/authentication/Login/Login";

function App() {
  // const test=localStorage.getItem("user")

  return (
    <>
      <Routes>
        <Route
          path="/SignUp"
          element={
            <Layout>
              <SignUp />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/Home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
