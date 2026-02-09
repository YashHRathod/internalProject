import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home/Home";
import Login from "./components/authentication/Login/Login";
import SignUp from "./components/authentication/SignUp/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";
import DashboardDev from "./components/DashboardDev/DashboardDev";
import Join from "./components/Join";

import RequireAuth from "./components/authentication/RequireAuth";
import RequireLead from "./components/authentication/RequireLead";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div>Checking authentication...</div>;
  }
  return (
    <Routes>
      {/* PUBLIC */}
      <Route
        path="/"
        element={
          <Layout>
            {!user && <Login />}

            {user?.role === "leader" && <Home />}

            {user?.role === "developer" && <DashboardDev />}
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
        path="/signup"
        element={
          <Layout>
            <SignUp />
          </Layout>
        }
      />
      <Route path="/workspace/join/:token" element={<Join />} />

      {/* DEVELOPER (NO LOGIN) */}
      {/* <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Layout>
              <DashboardDev />
            </Layout>
          </RequireAuth>
        }
      /> */}

      <Route
        path="/lead/dashboard/:workspaceId"
        element={
          <RequireAuth>
            <RequireLead>
              <Layout>
                <Dashboard />
              </Layout>
            </RequireLead>
          </RequireAuth>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
