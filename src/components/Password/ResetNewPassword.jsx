import React, { useState } from "react";
import styles from "./ResetNewPassword.module.css";
import { axiosInstance } from "../../utility/Axios";
import { useParams } from "react-router-dom";
import Layout from "../Layout/Layout";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const handleInputChange = (e) => {
    if (e.target.id === "newPassword") {
      setNewPassword(e.target.value);
    } else {
      setConfirmPassword(e.target.value);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/resetPassword", {
        token,
        newPassword,
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
            <span className={styles.icon} onClick={handleTogglePassword}>
              {showPassword ? "🙈" : "👁️"} {/* Toggling icon */}
            </span>
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password:
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
            <span className={styles.icon} onClick={handleToggleConfirmPassword}>
              {showConfirmPassword ? "🙈" : "👁️"} {/* Toggling icon */}
            </span>
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <div className={styles.spinner}></div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </Layout>
  );
};

export default ResetPassword;
