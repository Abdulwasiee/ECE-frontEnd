import React, { useContext } from "react";
import { FaEdit, FaUserPlus } from "react-icons/fa"; // Import the assign icon
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

  const handleAssign = (batchCourseId, e, courseId) => {
    e.stopPropagation(); // Prevent click event on list item
    navigate(`/assignStaff/${batchCourseId}/${courseId}`); // Navigate to assignStaff route
  };

  const renderEditIcon = (courseId, e) => {
    e.stopPropagation(); // Prevent click event on list item
    handleEdit(courseId);
  };

  // Helper function to determine if any course has a non-null stream name
  const hasStreamColumn = (courseList) =>
    courseList.some((course) => course.stream_name !== null);

  const renderCoursesTable = (courseList, showActions) => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Course Code</th>
          <th>Batch Year</th>
          <th>Semester</th>
          {hasStreamColumn(courseList) && <th>Stream</th>}
          {showActions && (roleId === 1 || roleId === 4) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {courseList.map((course) => (
          <tr
            key={course.course_id}
            onClick={() => onCourseClick(course.batch_course_id)}
          >
            <td>{course.course_name}</td>
            <td>{course.course_code}</td>
            <td>{course.batch_year}</td>
            <td>
              {course.semester_id === 1 ? "1st Semester" : "2nd Semester"}
            </td>
            {course.stream_name && <td>{course.stream_name}</td>}
            {showActions && (roleId === 1 || roleId === 4) && (
              <td>
                <FaEdit
                  className={styles.editIcon}
                  onClick={(e) => renderEditIcon(course.course_id, e)}
                />
                <FaUserPlus
                  className={styles.assignIcon}
                  onClick={(e) =>
                    handleAssign(course.batch_course_id, e, course.course_id)
                  } // Handle assign click
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
      {courses.length > 0 && renderCoursesTable(courses, true)}{" "}
      {/* Show actions */}
      {staffCourses.length > 0 && renderCoursesTable(staffCourses, false)}{" "}
      {/* No actions */}
    </div>
  );
};

export default CourseList;
