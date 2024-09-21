import React from "react";
import styles from "./NewsList.module.css"; // Import CSS module

const NewsList = ({ newsData }) => {
  if (!newsData.length) {
    return <h2 className={styles.newsTitle}>No news available.</h2>;
  }

  return (
    <div className={styles.newsList}>
      {newsData.map((news, index) => (
        <div
          key={news.news_id}
          className={`${styles.newsItem} ${
            index % 2 === 0 ? styles.newsLeft : styles.newsRight
          }`}
        >
          <h2 className={styles.newsTitle}>{news.title}</h2>
          <p className={styles.newsContent}>{news.content}</p>
          <p className={styles.newsInfo}>
            Posted by {news.posted_by} - {news.role} on{" "}
            {new Date(news.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
