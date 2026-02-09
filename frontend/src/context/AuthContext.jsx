import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refreshAuth: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
