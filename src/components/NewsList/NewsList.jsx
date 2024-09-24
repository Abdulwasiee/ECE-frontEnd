import React, { useState } from "react";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";
import styles from "./NewsList.module.css"; // Import CSS module

const NewsList = ({ newsData }) => {
  if (newsData.length === 0) {
    return <h2 className={styles.noNewsMessage}>No news available.</h2>;
  }

  return (
    <Grid container spacing={2} className={styles.newsList}>
      {newsData.map((news) => (
        <Grid item xs={12} sm={6} md={4} key={news.news_id}>
          <Card className={styles.newsCard}>
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                className={styles.newsTitle}
              >
                {news.title}
              </Typography>
              <NewsContent content={news.content} />
              <Typography variant="caption" className={styles.newsInfo}>
                Posted by {news.posted_by} - {news.role} on{" "}
                {new Date(news.created_at).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// New component to handle content display
const NewsContent = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const words = content.split(" ");
  const isLongContent = words.length > 100;

  const displayedContent = isExpanded
    ? content
    : words.slice(0, 50).join(" ") + (isLongContent ? "..." : "");

  return (
    <div>
      <Typography variant="body2" className={styles.newsContent}>
        {displayedContent}
      </Typography>
      {isLongContent && (
        <Button
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.readMoreButton}
        >
          {isExpanded ? "Hide" : "Read More"}
        </Button>
      )}
    </div>
  );
};

export default NewsList;
