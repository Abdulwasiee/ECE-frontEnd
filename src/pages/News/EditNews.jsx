import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./EditNews.module.css";
import Layout from "../../components/Layout/Layout";

const EditNews = () => {
  const { newsId } = useParams(); // Get newsId from URL
  const navigate = useNavigate();
  const [news, setNews] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axiosInstance.get(`/api/getNewsById/${newsId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.result.success) {
          setNews({
            title: response.data.result.result[0].title,
            content: response.data.result.result[0].content,
          });
        } else {
          setError("Error fetching news data.");
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching news.");
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNews({ ...news, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.put(
        `/api/updateNews/${newsId}`,
        {
          title: news.title,
          content: news.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      if (response.data.result.success) {
        navigate("/myPosts"); // Redirect to My News page after successful update
      } else {
        setError("Failed to update news.");
      }
    } catch (err) {
      setError("Error updating news.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.heading}>Edit Post</h2>
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={news.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows="10"
              value={news.content}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.updateButton}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditNews;
