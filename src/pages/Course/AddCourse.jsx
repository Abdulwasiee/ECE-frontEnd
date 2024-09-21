import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../components/Auth/Auth";
import styles from "./addCourse.module.css"
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const AddCoursePage = () => {
  const { userInfo } = useContext(AuthContext);
  const { role_id, stream_id, batch_ids } = userInfo;
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [semesterId, setSemesterId] = useState(1);
  const [batchId, setBatchId] = useState(role_id === 5 ? batch_ids[0] : "");
  const [streamId, setStreamId] = useState("");
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
      <FormControl fullWidth margin="normal">
        <InputLabel id="batch-label">Batch</InputLabel>
        <Select
          labelId="batch-label"
          id="batch_id"
          value={batchId}
          onChange={(e) => {
            setBatchId(e.target.value);
            setStreamId(""); // Reset stream selection on batch change
          }}
          label="Batch"
        >
          <MenuItem value={1}>2nd Year</MenuItem>
          <MenuItem value={2}>3rd Year</MenuItem>
          <MenuItem value={3}>4th Year</MenuItem>
          <MenuItem value={4}>5th Year</MenuItem>
        </Select>
      </FormControl>
    );
  };

 const renderStreamSelection = () => {
   // Make sure batchId and semesterId are compared as numbers
   if (
     (Number(batchId) === 3 && Number(semesterId) === 2) ||
     Number(batchId) === 4
   ) {
     return (
       <FormControl fullWidth margin="normal">
         <InputLabel id="stream-label">Stream</InputLabel>
         <Select
           labelId="stream-label"
           id="stream_id"
           value={streamId}
           onChange={(e) => setStreamId(e.target.value)}
           label="Stream"
           required
         >
           <MenuItem value="">Select Stream</MenuItem>
           <MenuItem value={1}>Computer</MenuItem>
           <MenuItem value={2}>Communication</MenuItem>
           <MenuItem value={3}>Control</MenuItem>
           <MenuItem value={4}>Power</MenuItem>
         </Select>
       </FormControl>
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
          <TextField
            fullWidth
            margin="normal"
            label="Course Name"
            id="course_name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Course Code"
            id="course_code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          />
          {renderBatchSelection()}
          <FormControl fullWidth margin="normal">
            <InputLabel id="semester-label">Semester</InputLabel>
            <Select
              labelId="semester-label"
              id="semester_id"
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
              label="Semester"
            >
              <MenuItem value={1}>1st Semester</MenuItem>
              <MenuItem value={2}>2nd Semester</MenuItem>
            </Select>
          </FormControl>
          {renderStreamSelection()}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Add Course
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default AddCoursePage;
