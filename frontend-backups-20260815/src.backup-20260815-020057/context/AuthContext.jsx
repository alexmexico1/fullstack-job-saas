import { createContext, useState, useEffect, useContext } from "react";

// Added "export" here to satisfy the named imports in files like Login.jsx
export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({
        token,
        name: "Demo User",
      });
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token, name: "Demo User" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}