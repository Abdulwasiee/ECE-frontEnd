import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import NewsList from "../../components/NewsList/NewsList";
import styles from "./MyPost.module.css";
import Layout from "../../components/Layout/Layout";
import { FaPlus, FaTimes } from "react-icons/fa";

const MyNewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showButton, setShowButton] = useState(false); // State to manage button visibility
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
      <div className={styles.newsPage}>
        <h2 className={styles.heading}>My Updates</h2>
        {loading && <p className={styles.loading}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <NewsList
            newsData={newsData}
            setNewsData={setNewsData} // Pass the setNewsData function here
            isMypost={true}
          />
        )}

        {/* Icon to toggle visibility of the button */}
        <div className={styles.iconContainer}>
          {showButton ? (
            <FaTimes
              className={`${styles.toggleIcon} ${styles.vibrateIcon}`}
              onClick={() => setShowButton(false)}
            />
          ) : (
            <FaPlus
              className={`${styles.toggleIcon} ${styles.vibrateIcon}`}
              onClick={() => setShowButton(true)}
            />
          )}
        </div>

        {/* Apply the 'visible' class when button should be visible */}
        <div
          className={`${styles.stickyButtons} ${
            showButton ? styles.visible : styles.hidden
          }`}
        >
          <button
            className={styles.addButton}
            onClick={() => navigate("/postNews")}
          >
            Publish Announcement
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default MyNewsPage;
