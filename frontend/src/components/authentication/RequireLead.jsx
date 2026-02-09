import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function RequireLead({ children }) {
  const { user, loading } = useContext(AuthContext);
  console.log(user);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  if (user.role !== "leader") {
    return <Navigate to="/login" />;
  }

  return children;
}
