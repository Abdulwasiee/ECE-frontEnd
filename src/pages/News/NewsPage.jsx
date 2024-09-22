import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import NewsList from "../../components/NewsList/NewsList";
import styles from "./NesPage.module.css";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../components/Auth/Auth";

const NewsPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const roleId = userInfo.role_id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      const token = localStorage.getItem("authToken");
      try {
        // Fetch news
        const newsResponse = await axiosInstance.get("/api/getNews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(Response);
        setNewsData(newsResponse.data.result.result);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchNews();
  }, []);

  return (
    <Layout>
      <div className={styles.newsPage}>
        {loading && <p className={styles.loading}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && <NewsList newsData={newsData} />}

        {roleId === 4 && (
          <div className={styles.stickyButtons}>
            <button
              className={styles.addButton}
              onClick={() => navigate("/postNews")}
            >
              Post News
            </button>
            <button
              className={styles.myPostsButton}
              onClick={() => navigate("/myPosts")}
            >
              My Posts
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NewsPage;
