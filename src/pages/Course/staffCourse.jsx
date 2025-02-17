import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import CourseList from "../../components/CourseList/CourseList";
import styles from "./staffCourse.module.css";
import Layout from "../../components/Layout/Layout";
import Encryptor from "../../components/Protection/Encryptor";

const StaffCoursePage = () => {
  const [staffCourses, setStaffCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffCourses = async () => {
      const token = localStorage.getItem("authToken");

      try {
        // Fetch staff courses
        const response = await axiosInstance.get("/api/getStaffCourse", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.result.success) {
          setStaffCourses(response.data.result.courses);
        } else {
          setError(response.data.result.message);
        }
      } catch (error) {
        setError("Error fetching staff courses.");
        console.error("Error fetching staff courses:", error);
      }
    };

    fetchStaffCourses();
  }, [navigate]);

  const handleCourseClick = (courseId) => {
    const encryptedCourseId = Encryptor.encrypt(courseId);
    navigate(`/materials/${encryptedCourseId}`);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Your Courses</h2>
        </div>
        {/* Pass staff courses to CourseList */}
        <CourseList
          staffCourses={staffCourses} // Pass staffCourses here
          onCourseClick={handleCourseClick}
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </Layout>
  );
};

export default StaffCoursePage;
