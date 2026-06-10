import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// 1. Set your backend URL (Vercel uses production, fallback to local)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

// 2. Create the missing React Context
const AuthContext = createContext(null);

// 3. Create the missing AuthProvider component your main.jsx needs
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Decode or set user state here if needed
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      setUser({ token: response.data.token });
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. Create the missing useAuth hook your login/register pages are calling
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 5. Keep your existing individual API helper functions so nothing else breaks
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};