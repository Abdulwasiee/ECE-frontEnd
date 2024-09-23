import React, { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../../utility/Axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({
    role_id: null,
    batch_ids: [],
    stream_id: null,
    first_name: null,
    last_name: null,
    user_id: null,
  });

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const authHeader = `Bearer ${token}`;

      const response = await axiosInstance.get("/api/checkUser", {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });
      if (response.data.success) {
        setIsAuthenticated(true);

        // Extract role, batch IDs, stream ID, first name, and last name from the response
        const {
          role_id,
          batch_ids,
          stream_id,
          first_name,
          last_name,
          user_id,
        } = response.data;

        // Update the userInfo state
        setUserInfo({
          role_id,
          batch_ids,
          stream_id,
          first_name,
          last_name,
          user_id,
        });
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (token) => {
    localStorage.setItem("authToken", token);
    await checkAuthStatus();
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUserInfo({
      role_id: null,
      batch_ids: [],
      stream_id: null,
      first_name: null,
      last_name: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userInfo,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
