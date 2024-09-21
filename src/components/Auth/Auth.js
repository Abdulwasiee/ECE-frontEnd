import React, { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../../utility/Axios.jsx";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State to store authentication status and user information
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({
    role_id: null,
    batch_ids: [],
    stream_id: null,
  });

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Use token directly if it's in the correct format
      const authHeader = `Bearer ${token}`;

      const response = await axiosInstance.get("/api/checkUser", {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });

      if (response.data.success) {
        setIsAuthenticated(true);

        // Extract role, batch IDs, and stream ID from the response
        const { role_id, batch_ids, stream_id } = response.data;

        // Update the userInfo state
        setUserInfo({
          role_id,
          batch_ids,
          stream_id,
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
