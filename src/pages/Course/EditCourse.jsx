import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./EditCourse.module.css"; // Import CSS module
import Layout from "../../components/Layout/Layout";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    course_name: "",
    course_code: "",
    batch_id: "",
    semester_id: "",
    stream_id: "",
  });
  const token = localStorage.getItem("authToken");
  const [isStreamVisible, setIsStreamVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/getCourseById/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourse({
          course_name: data.result.course.course_name,
          course_code: data.result.course.course_code,
          batch_id: data.result.course.batch_id,
          semester_id: data.result.course.semester_id,
          stream_id: data.result.course.stream_id,
        });

        handleStreamVisibility(data.batch_id, data.semester_id);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleStreamVisibility = (batchId, semesterId) => {
    const showStream =
      (batchId === "3" && semesterId === "1") || batchId === "4";
    setIsStreamVisible(showStream);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });

    if (name === "batch_id" || name === "semester_id") {
      handleStreamVisibility(course.batch_id, course.semester_id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show modal for confirmation
  };

  const handleConfirmUpdate = async () => {
    try {
      const { course_name, course_code, batch_id, semester_id, stream_id } =
        course;

      const response = await axiosInstance.put(
        `/api/updateCourse/${courseId}`,
        {
          course_name,
          course_code,
          streamId: isStreamVisible ? stream_id : null,
          semesterId: semester_id,
          batch_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setShowModal(false); // Hide modal
      navigate("/courses"); // Redirect to courses page after update
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <Layout>
      <div className={styles.editCourseContainer}>
        <h2>Edit Course</h2>

        <div className={styles.notification}>
          <div className={styles.notificationTitle}>
            Important Notice: Course Editing Implications
          </div>
          <div className={styles.notificationContent}>
            When you update a course, it’s important to remember that it’s not
            just about changing the course name or code. Modifying the batch or
            semester can cause the course to shift to the updated version for
            all users, including staff and students.
            <br />
            <br />
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label>Course Name</label>
            <input
              type="text"
              name="course_name"
              value={course.course_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Course Code</label>
            <input
              type="text"
              name="course_code"
              value={course.course_code}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Batch</label>
            <select
              name="batch_id"
              value={course.batch_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Batch</option>
              <option value="1">2 Years</option>
              <option value="2">3 Years</option>
              <option value="3">4 Years</option>
              <option value="4">5 Years</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Semester</label>
            <select
              name="semester_id"
              value={course.semester_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Semester</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
            </select>
          </div>
          {isStreamVisible && (
            <div className={styles.formGroup}>
              <label>Stream</label>
              <select
                name="stream_id"
                value={course.stream_id || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Stream</option>
                <option value="1">Computer</option>
                <option value="2">Communication</option>
                <option value="3">Control</option>
                <option value="4">Power</option>
              </select>
            </div>
          )}
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className={styles.checkbox}
              />
              I confirm that I understand the changes I am about to make.
            </label>
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isChecked}
          >
            Update Course
          </button>
        </form>

        {/* Modal for confirmation */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Confirm Course Update</h3>
              <p>Are you sure you want to update this course?</p>
              <button
                onClick={handleConfirmUpdate}
                className={styles.confirmButton}
              >
                Yes, Update
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditCourse;
