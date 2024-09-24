import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import uploadStyles from "./PostMaterial.module.css";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../components/Auth/Auth";

const FileUploadPage = () => {
  const { courseId } = useParams(); // Get courseId from params
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { userInfo } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !file) {
      setError("Title and file are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("batchCourseId", courseId); // Pass courseId in the request body

    try {
      const response = await axiosInstance.post("/api/uploadFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(response.data.message);
      setError(null);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      setError(error.response?.data?.message || "Error uploading file");
      setSuccess(null);
    }
  };

  return (
    <Layout>
      <div className={uploadStyles.fileUploadContainer}>
        <h1 className={uploadStyles.heading}>Upload Material</h1>
        {error && <p className={uploadStyles.error}>{error}</p>}
        {success && <p className={uploadStyles.success}>{success}</p>}
        <form onSubmit={handleSubmit} className={uploadStyles.uploadForm}>
          <div className={uploadStyles.formGroup}>
            <label htmlFor="title" className={uploadStyles.label}>
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={uploadStyles.input}
            />
          </div>

          <div className={uploadStyles.formGroup}>
            <label htmlFor="file" className={uploadStyles.label}>
              File:
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              className={uploadStyles.input}
            />
          </div>

          <button type="submit" className={uploadStyles.submitButton}>
            Upload
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default FileUploadPage;
