import React, { useState } from "react";
import styles from "./RequstPassword.module.css";
import { axiosInstance } from "../../utility/Axios";
import Layout from "../Layout/Layout";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setLoading(true); // Start loading spinner

    try {
      const response = await axiosInstance.post("/api/requestPasswordReset", {
        email,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Request Password Reset</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <div className={styles.spinner}></div> // Spinner while loading
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </Layout>
  );
};

export default RequestPasswordReset;
