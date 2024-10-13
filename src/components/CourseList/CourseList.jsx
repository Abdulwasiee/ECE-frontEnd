import React, { useContext } from "react";
import { FaEdit, FaUserPlus, FaBook } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import styles from "./CourseList.module.css";
import { AuthContext } from "../Auth/Auth";
import Encryptor from "../Protection/Encryptor";

const CourseList = ({ courses = [], staffCourses = [], onCourseClick }) => {
  const { userInfo } = useContext(AuthContext);
  const roleId = userInfo.role_id;
  const navigate = useNavigate();

  const handleEdit = (courseId) => {
    const encryptedCourseId = Encryptor.encrypt(courseId);
    navigate(`/editCourse/${encryptedCourseId}`);
  };

  const handleAssign = (batchCourseId, e, courseId, selectedCourse) => {
    const encryptedBatchCourseId = Encryptor.encrypt(batchCourseId);
    const encryptedCourseId = Encryptor.encrypt(courseId);
    e.stopPropagation(); 
    navigate(
      `/assignStaff/${encryptedBatchCourseId}/${encryptedCourseId}/${selectedCourse}`
    );
  };

  const renderCourses = (courseList, showActions) => (
    <div className={styles.courseList}>
      {courseList.map((course) => (
        <div className={styles.courseCard}>
          <div className={styles.courseIcon}>
            <FaBook />
          </div>
          <div
            key={course.course_id}
            onClick={() => onCourseClick(course.batch_course_id)}
            className={styles.courseInfo}
          >
            <h3>{course.course_name}</h3>
            <p>Code: {course.course_code}</p>
            <p>Batch Year: {course.batch_year}</p>
            <p>
              Semester:{" "}
              {course.semester_id === 1 ? "1st Semester" : "2nd Semester"}
            </p>
            {course.stream_name && <p>Stream: {course.stream_name}</p>}
          </div>
          {showActions && (roleId === 1 || roleId === 4) && (
            <div className={styles.courseActions}>
              <FaEdit
                className={styles.editIcon}
                onClick={(e) => handleEdit(course.course_id, e)}
              />
              <FaUserPlus
                className={styles.assignIcon}
                onClick={(e) =>
                  handleAssign(
                    course.batch_course_id,
                    e,
                    course.course_id,
                    course.course_name
                  )
                }
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Courses</h2>
      {courses.length > 0 && renderCourses(courses, true)} {/* Show actions */}
      {staffCourses.length > 0 && renderCourses(staffCourses, false)}{" "}
    </div>
  );
};

export default CourseList;
