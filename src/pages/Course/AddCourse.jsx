import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./addCourse.module.css";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../components/Auth/Auth";

const AddCoursePage = () => {
  const { userInfo } = useContext(AuthContext);
  const { role_id, stream_id, batch_ids } = userInfo;
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [semesterId, setSemesterId] = useState(1);
  const [batchId, setBatchId] = useState(role_id === 5 ? batch_ids[0] : null);
  const [streamId, setStreamId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    const formData = {
      course_name: courseName,
      course_code: courseCode,
      batch_id: batchId,
      semesterId,
      streamId: role_id === 5 ? stream_id : streamId,
    };

    try {
      const response = await axiosInstance.post("/api/addCourse", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.result.success) {
        navigate("/courses");
      } else {
        setError(response.data.result.message || "Error adding course.");
      }
    } catch (error) {
      setError("Error adding course.");
      console.error("Error adding course:", error);
    }
  };

  const renderBatchSelection = () => {
    if (role_id === 5) return null;

    return (
      <div className={styles.formGroup}>
        <label htmlFor="batch_id">Batch:</label>
        <select
          id="batch_id"
          value={batchId}
          onChange={(e) => {
            setBatchId(e.target.value);
            setStreamId(null); // Reset stream selection on batch change
          }}
        >
          <option value={1}>2nd Year</option>
          <option value={2}>3rd Year</option>
          <option value={3}>4th Year</option>
          <option value={5}>5th Year</option>
        </select>
      </div>
    );
  };

  const renderStreamSelection = () => {
    // Stream selection for 4th year, 2nd semester and 5th year
    if ((batchId === "3" && semesterId === "2") || batchId === "5") {
      return (
        <div className={styles.formGroup}>
          <label htmlFor="stream_id">Stream:</label>
          <select
            id="stream_id"
            value={streamId}
            onChange={(e) => setStreamId(e.target.value)}
            required
          >
            <option value="">Select Stream</option>
            <option value={1}>Computer</option>
            <option value={2}>Communication</option>
            <option value={3}>Control</option>
            <option value={4}>Power</option>
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2>Add New Course</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="course_name">Course Name:</label>
            <input
              type="text"
              id="course_name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="course_code">Course Code:</label>
            <input
              type="text"
              id="course_code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>
          {renderBatchSelection()} 
          <div className={styles.formGroup}>
            <label htmlFor="semester_id">Semester:</label>
            <select
              id="semester_id"
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
            >
              <option value={1}>1st Semester</option>
              <option value={2}>2nd Semester</option>
            </select>
          </div>
          {renderStreamSelection()}
          <button type="submit" className={styles.submitButton}>
            Add Course
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddCoursePage;
