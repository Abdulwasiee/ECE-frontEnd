import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import NewsList from "../../components/NewsList/NewsList";
import styles from "./MyPost.module.css";
import Layout from "../../components/Layout/Layout";

const MyNewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewsByUser = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("No authorization token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/api/getNewsByUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.result.success) {
          setNewsData(response.data.result.result);
        } else {
          throw new Error(response.data.message || "Error fetching news");
        }

        setLoading(false);
      } catch (err) {
        setError("Error fetching news");
        setLoading(false);
        console.error("Error fetching news:", err);
      }
    };

    fetchNewsByUser();
  }, [navigate]);

  return (
    <Layout>
      <div className={styles.stickyButtons}>
        <button
          className={styles.addButton}
          onClick={() => navigate("/postNews")}
        >
          Post News
        </button>
      </div>
      <div className={styles.newsPage}>
        <h2 className={styles.heading}>My News Posts</h2>
        {loading && <p className={styles.loading}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <NewsList
            newsData={newsData}
            setNewsData={setNewsData} // Pass the setNewsData function here
            isMypost={true}
          />
        )}
      </div>
    </Layout>
  );
};

export default MyNewsPage;
