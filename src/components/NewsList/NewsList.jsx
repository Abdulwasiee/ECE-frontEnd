import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./NewsList.module.css"; // Import CSS module
import Encryptor from "../Protection/Encryptor";

const NewsList = ({ newsData, setNewsData, isMypost }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  if (newsData.length === 0) {
    return <h2 className={styles.noNewsMessage}>No news available.</h2>;
  }

  const handleDeleteClick = (newsId) => {
    setSelectedNewsId(newsId);
    setOpenDialog(true); // Open confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/api/deleteNews/${selectedNewsId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the state to remove the deleted post
      setNewsData((prevNewsData) =>
        prevNewsData.filter((news) => news.news_id !== selectedNewsId)
      );
    } catch (error) {
      console.error("Failed to delete news", error);
    } finally {
      setOpenDialog(false); // Close the modal
    }
  };

  const handleEditClick = (newsId) => {
    const newsIde = Encryptor.encrypt(newsId);
    navigate(`/editNews/${newsIde}`); // Navigate to the edit news page using encrypted id
  };

  return (
    <>
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
                  Posted by {news.posted_by ? news.posted_by : "you"} <br />
                  Role: department <br /> On:{" "}
                  {new Date(news.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
              {isMypost && (
                <div className={styles.actionButtons}>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEditClick(news.news_id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteClick(news.news_id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete confirmation modal */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this news post? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Component for handling the content display
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
