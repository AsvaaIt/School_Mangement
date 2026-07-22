import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("asvaa_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (schoolCode, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { schoolCode, email, password });
      const userData = data.data;
      localStorage.setItem("asvaa_token", userData.token);
      localStorage.setItem("asvaa_user", JSON.stringify(userData));
      localStorage.setItem("asvaa_school_code", userData.school.code);
      localStorage.setItem("asvaa_school_name", userData.school.name);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Check your credentials.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      const userData = data.data;
      localStorage.setItem("asvaa_token", userData.token);
      localStorage.setItem("asvaa_user", JSON.stringify(userData));
      localStorage.setItem("asvaa_school_code", userData.school.code);
      localStorage.setItem("asvaa_school_name", userData.school.name);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("asvaa_token");
    localStorage.removeItem("asvaa_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
