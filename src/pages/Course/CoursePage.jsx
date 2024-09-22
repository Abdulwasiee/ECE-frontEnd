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

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(1); // Default batch for students and representatives
  const [selectedSemester, setSelectedSemester] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const { role_id, stream_id } = userInfo;
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedSemester) {
      fetchCourses();
    }
  }, [selectedBatch, selectedSemester]);

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
            stream_id: stream_id,
            semester_id: selectedSemester,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        const courseList = response.data.result.courses;
        console.log(courseList);
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
  };

  const handleSemesterSelection = (event) => {
    setSelectedSemester(event.target.value);
  };

  const handleAddCourse = () => {
    navigate("/addCourse");
  };

  const renderBatchDropdown = () => {
    if (role_id === 2 || role_id === 5) return null;

    return (
      <Box mb={3}>
        <FormControl fullWidth>
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
      </Box>
    );
  };

  const renderSemesterDropdown = () => (
    <Box mb={3}>
      <FormControl fullWidth>
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
    </Box>
  );

  return (
    <Layout>
      <Box p={3} maxWidth="1200px" mx="auto">
        {(role_id === 4 || role_id === 1 || role_id === 5) && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddCourse}
            sx={{ mb: 3 }}
          >
            Add Course
          </Button>
        )}

        {renderBatchDropdown()}
        {renderSemesterDropdown()}

        <CourseList
          courses={courses}
          onCourseClick={handleCourseSelection}
          roleId={role_id}
        />
        {error && (
          <Typography variant="body2" color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>
    </Layout>
  );
};

export default CoursePage;
