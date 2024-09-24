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
import styles from "./CoursePage.module.css"; // Import the CSS module

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(1); // Default batch for students and representatives
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null); // State for selected stream
  const { userInfo } = useContext(AuthContext);
  const { role_id } = userInfo;
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedSemester) {
      fetchCourses();
    }
  }, [selectedBatch, selectedSemester, selectedStream]); // Added selectedStream to dependencies

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
            stream_id: selectedStream, // Include selected stream ID
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
    setSelectedStream(null); // Reset stream selection when batch changes
  };

  const handleSemesterSelection = (event) => {
    setSelectedSemester(event.target.value);
    setSelectedStream(null); // Reset stream selection when semester changes
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
      >
        <MenuItem value={1}>1st Semester</MenuItem>
        <MenuItem value={2}>2nd Semester</MenuItem>
      </Select>
    </FormControl>
  );

  const renderStreamDropdown = () => {
    // Only show stream dropdown if selectedBatch is 4 or 5 and selectedSemester is 2
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
          >
            <MenuItem value={1}>Computer</MenuItem>
            <MenuItem value={2}>Communication</MenuItem>
            <MenuItem value={3}>Control</MenuItem>
            <MenuItem value={4}>Power</MenuItem>
          </Select>
        </FormControl>
      );
    }
    return null; // Don't render if conditions aren't met
  };

  return (
    <Layout>
      <Box className={styles.buttonContainer}>
        {(role_id === 4 || role_id === 1 || role_id === 5) && (
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
