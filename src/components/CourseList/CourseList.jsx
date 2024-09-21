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

  const renderCourses = (courseList) =>
    courseList.map((course) => (
      <li
        key={course.course_id}
        className={styles.listItem}
        onClick={() => onCourseClick(course.course_id)}
      >
        <span>
          {course.course_name}
          {course.batch_year && ` - Batch Year: ${course.batch_year}`}
        </span>
        {(roleId === 1 || roleId === 4 || roleId === 5) && (
          <FaEdit
            className={styles.editIcon}
            onClick={(e) => renderEditIcon(course.course_id, e)}
          />
        )}
      </li>
    ));

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Courses</h2>
      {courses.length > 0 && (
        <ul className={styles.list}>{renderCourses(courses)}</ul>
      )}

      {staffCourses.length > 0 && (
        <div>
          <h2 className={styles.title}>Staff Courses</h2>
          <ul className={styles.list}>{renderCourses(staffCourses)}</ul>
        </div>
      )}
    </div>
  );
};

export default CourseList;
