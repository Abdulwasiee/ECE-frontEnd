import React, { useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./CourseList.module.css";
import { AuthContext } from "../Auth/Auth";

const CourseList = ({ courses = [], staffCourses = [], onCourseClick }) => {
  const { userInfo } = useContext(AuthContext);
  const roleId = userInfo.role_id;
  const navigate = useNavigate();

  const handleEdit = (courseId) => {
    navigate(`/editCourse/${courseId}`);
  };

  const renderEditIcon = (courseId, e) => {
    e.stopPropagation(); // Prevent click event on list item
    handleEdit(courseId);
  };

  // Helper function to determine if any course has a non-null stream name
  const hasStreamColumn = (courseList) =>
    courseList.some((course) => course.stream_name !== null);

  const renderCoursesTable = (courseList) => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Course Code</th>
          <th>Batch Year</th>
          <th>Semester</th>
          {hasStreamColumn(courseList) && <th>Stream</th>}
          {(roleId === 1 || roleId === 4 || roleId === 5) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {courseList.map((course) => (
          <tr
            key={course.course_id}
            onClick={() => onCourseClick(course.course_id)}
          >
            <td>{course.course_name}</td>
            <td>{course.course_code}</td>
            <td>{course.batch_year}</td>
            <td>
              {course.semester_id === 1 ? "1st Semester" : "2nd Semester"}
            </td>
            {course.stream_name && <td>{course.stream_name}</td>}
            {(roleId === 1 || roleId === 4 || roleId === 5) && (
              <td>
                <FaEdit
                  className={styles.editIcon}
                  onClick={(e) => renderEditIcon(course.course_id, e)}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Courses</h2>
      {courses.length > 0 && renderCoursesTable(courses)}

      {staffCourses.length > 0 && (
        <div>
          <h2 className={styles.title}>Staff Courses</h2>
          {renderCoursesTable(staffCourses)}
        </div>
      )}
    </div>
  );
};

export default CourseList;
