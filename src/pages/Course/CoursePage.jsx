import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import CourseList from "../../components/CourseList/CourseList";
import styles from "./CoursePage.module.css";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../components/Auth/Auth";

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
            streamId: stream_id,
            semesterId: selectedSemester,
          },
        }
      );
      console.log(response);
      if (response.status == 200) {
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

  const handleBatchSelection = (batchId) => {
    setSelectedBatch(batchId);
  };

  const handleSemesterSelection = (semesterId) => {
    setSelectedSemester(semesterId);
  };

  const renderBatchMenu = () => {
    if (role_id === 2 || role_id === 5) return null;

    return (
      <div className={styles.batchMenu}>
        <h2>Select Batch Year:</h2>
        <button
          onClick={() => handleBatchSelection(1)}
          className={styles.batchButton}
        >
          2nd Year
        </button>
        <button
          onClick={() => handleBatchSelection(2)}
          className={styles.batchButton}
        >
          3rd Year
        </button>
        <button
          onClick={() => handleBatchSelection(3)}
          className={styles.batchButton}
        >
          4th Year
        </button>
      </div>
    );
  };

  const renderSemesterMenu = () => (
    <div className={styles.semesterMenu}>
      <h2>Select Semester:</h2>
      <button
        onClick={() => handleSemesterSelection(1)}
        className={styles.semesterButton}
      >
        1st Semester
      </button>
      <button
        onClick={() => handleSemesterSelection(2)}
        className={styles.semesterButton}
      >
        2nd Semester
      </button>
    </div>
  );

  const handleAddCourse = () => {
    navigate("/addCourse");
  };

  return (
    <Layout>
      <div className={styles.container}>
        {(role_id === 4 || role_id === 1 || role_id === 5) && (
          <button className={styles.addCourseButton} onClick={handleAddCourse}>
            Add Course
          </button>
        )}
        {renderBatchMenu()}
        {renderSemesterMenu()}

        <CourseList
          courses={courses}
          onCourseClick={handleCourseSelection}
          roleId={role_id}
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </Layout>
  );
};

export default CoursePage;
