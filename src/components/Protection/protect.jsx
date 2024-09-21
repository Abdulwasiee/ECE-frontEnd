import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/Auth";

const Protect = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndRedirect = () => {
      if (!token) {
        navigate("/signin");
      }
    };

    checkAndRedirect();
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <>{children}</> : null;
};

export default Protect;
