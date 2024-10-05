import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import CourseList from "../../components/CourseList/CourseList";
import { AuthContext } from "../../components/Auth/Auth";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import Layout from "../../components/Layout/Layout";
import styles from "./CoursePage.module.css";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedStream, setSelectedStream] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const { role_id } = userInfo;
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedSemester) {
      fetchCourses();
    }
  }, [selectedBatch, selectedSemester, selectedStream]);

  const fetchCourses = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axiosInstance.get(
        `/api/getCourses/${selectedBatch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            stream_id: selectedStream,
            semester_id: selectedSemester,
          },
        }
      );
      if (response.status === 200) {
        const courseList = response.data.result.courses;
        if (courseList.length === 0) {
          setError(response.data.result.message);
          setCourses([]);
        } else {
          setCourses(courseList);
          setError(null);
        }
      } else {
        setError(response.data.message || "Error fetching courses.");
      }
    } catch (error) {
      setError("Error fetching courses.");
      console.error("Error fetching courses:", error);
    }
  };

  const handleCourseSelection = (courseId) => {
    navigate(`/materials/${courseId}`);
  };

  const handleBatchSelection = (event) => {
    setSelectedBatch(event.target.value);
    setSelectedStream(null);
  };

  const handleSemesterSelection = (event) => {
    setSelectedSemester(event.target.value);
    setSelectedStream(null);
  };

  const handleStreamSelection = (event) => {
    setSelectedStream(event.target.value);
  };

  const handleAddCourse = () => {
    navigate("/addCourse");
  };

  const renderBatchDropdown = () => {
    if (role_id === 2 || role_id === 5) return null;

    return (
      <FormControl className={styles.smallSelect}>
        <InputLabel id="batch-select-label">Select Batch</InputLabel>
        <Select
          labelId="batch-select-label"
          value={selectedBatch}
          label="Select Batch"
          onChange={handleBatchSelection}
          className={styles.selectInput}
        >
          <MenuItem value={1}>2nd Year</MenuItem>
          <MenuItem value={2}>3rd Year</MenuItem>
          <MenuItem value={3}>4th Year</MenuItem>
          <MenuItem value={4}>5th Year</MenuItem>
        </Select>
      </FormControl>
    );
  };

  const renderSemesterDropdown = () => (
    <FormControl className={styles.smallSelect}>
      <InputLabel id="semester-select-label">Select Semester</InputLabel>
      <Select
        labelId="semester-select-label"
        value={selectedSemester}
        label="Select Semester"
        onChange={handleSemesterSelection}
        className={styles.selectInput}
      >
        <MenuItem value={1}>1st Semester</MenuItem>
        <MenuItem value={2}>2nd Semester</MenuItem>
      </Select>
    </FormControl>
  );

  const renderStreamDropdown = () => {
    if (
      (selectedBatch === 3 && selectedSemester === 2) ||
      selectedBatch === 4
    ) {
      return (
        <FormControl className={styles.smallSelect}>
          <InputLabel id="stream-select-label">Select Stream</InputLabel>
          <Select
            labelId="stream-select-label"
            value={selectedStream}
            label="Select Stream"
            onChange={handleStreamSelection}
            className={styles.selectInput}
          >
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
      <Box className={styles.buttonContainer}>
        {(role_id === 4 || role_id === 1) && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCourse}
            className={styles.addButton}
          >
            Add Course
          </Button>
        )}
      </Box>

      <Box p={3} maxWidth="1200px" mx="auto" className={styles.container}>
        <Box className={styles.dropdownContainer}>
          {renderBatchDropdown()}
          {renderSemesterDropdown()}
          {renderStreamDropdown()} {/* Include stream dropdown */}
        </Box>

        <CourseList
          courses={courses}
          onCourseClick={handleCourseSelection}
          roleId={role_id}
        />
        {error && (
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default CoursePage;
