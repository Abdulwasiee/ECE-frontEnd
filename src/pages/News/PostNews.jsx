import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./PostNews.module.css";
import Layout from "../../components/Layout/Layout";

const PostNews = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authorization token found. Please log in.");
      return;
    }

    setIsLoading(true); 

    try {
      const response = await axiosInstance.post(
        "/api/postNews",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.result.success) {
        setSuccess("News added successfully!");
        setTitle("");
        setContent("");
        setTimeout(() => navigate("/myPosts"), 2000);
      } else {
        setError(response.data.message || "Error adding news");
      }
    } catch (err) {
      setError("Network error or failed request");
      console.error("Error posting news:", err);
    } finally {
      setIsLoading(false); // Reset loading state after the request is complete
    }
  };

  return (
    <Layout>
      <div className={styles.postNewsContainer}>
        <h2 className={styles.heading}>Publish Announcement</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title:
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              Content:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner}></span> // Spinner element
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default PostNews;
