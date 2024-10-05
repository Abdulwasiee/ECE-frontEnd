import React, { useState, useEffect, useContext } from "react";
import { axiosInstance } from "../../utility/Axios";
import styles from "./CreateUser.module.css";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../components/Auth/Auth";
import { Spinner } from "react-bootstrap"; // Importing Bootstrap Spinner for loading indication

const CreateUserPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    role_id: "3",
    id_number: "",
    name: "",
    email: "",
    batch_id: "2",
    semester_id: "",
    stream_id: null,
    course_id: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [batchOptions] = useState([
    { id: 1, name: "2nd Year" },
    { id: 2, name: "3rd Year" },
    { id: 3, name: "4th Year" },
    { id: 4, name: "5th Year" },
  ]);
  const [streamOptions] = useState([
    { id: 1, name: "Computer" },
    { id: 2, name: "Communication" },
    { id: 3, name: "Control" },
    { id: 4, name: "Power" },
  ]);

  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [loading, setLoading] = useState(false); // State for loading spinner
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (formData.batch_id && formData.semester_id) {
      fetchCourseOptions(
        formData.batch_id,
        formData.semester_id,
        formData.stream_id
      );
    }
  }, [formData.batch_id, formData.semester_id, formData.stream_id]);

  const fetchCourseOptions = async (batch_id, semester_id, stream_id) => {
    try {
      const response = await axiosInstance.get(`/api/getCourses/${batch_id}`, {
        params: {
          semester_id: semester_id || undefined,
          ...(stream_id &&
          ((batch_id === "3" && semester_id === "2") || batch_id === "4")
            ? { stream_id }
            : {}),
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourseOptions(response.data.result.courses);
    } catch (error) {
      console.error("Error fetching course options:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "batch_id" || name === "semester_id" || name === "stream_id") {
      setFormData((prev) => ({ ...prev, course_id: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isChecked) {
      setMessage("Please confirm the data is correct.");
      setIsSuccess(false);
      return;
    }

    const formDataToSubmit = {
      ...formData,
      role_id: formData.role_id || userInfo.role_id,
    };

    setLoading(true); // Start loading
    try {
      const response = await axiosInstance.post(
        "/api/addUsers",
        formDataToSubmit,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMessage("User created successfully.");
        setIsSuccess(true);
        setTimeout(() => {
          // Refresh the page after 1 second
          window.location.reload();
        }, 1000); // 1000 ms = 1 second
      } else {
        setMessage(response.data.result.message);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("An error occurred while creating the user.");
      setIsSuccess(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked); // Update checkbox state
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.heading}>Create User</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {userInfo.role_id === 1 && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Role:
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select Role</option>
                  <option value="4">Department</option>
                  <option value="3">Staff</option>
                  <option value="5">Representative</option>
                </select>
              </label>
            </div>
          )}
          {userInfo.role_id === 4 && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Role:
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="3">Staff</option>
                  <option value="5">ٌRepresentative</option>
                </select>
              </label>
            </div>
          )}

          {["id_number", "name", "email"].map((field) => (
            <div className={styles.formGroup} key={field}>
              <label className={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
                <input
                  type={"text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
            </div>
          ))}

          {(userInfo.role_id == 1 || userInfo.role_id == 4) &&
            (formData.role_id === "3" || formData.role_id === "5") && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Batch:
                  <select
                    name="batch_id"
                    value={formData.batch_id}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {batchOptions.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

          {(formData.role_id === "3" ||
            (formData.role_id === "5" && formData.batch_id === "3")) && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Semester:
                <select
                  name="semester_id"
                  value={formData.semester_id}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </label>
            </div>
          )}

          {((formData.batch_id == 3 && formData.semester_id == "2") ||
            formData.batch_id === "4") && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Stream:
                <select
                  name="stream_id"
                  value={formData.stream_id}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select Stream</option>
                  {streamOptions.map((stream) => (
                    <option key={stream.id} value={stream.id}>
                      {stream.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {formData.role_id === "3" && courseOptions.length > 0 && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Course:
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select Course</option>
                  {courseOptions.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {/* Confirmation Checkbox */}
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className={styles.checkbox}
              />
              I confirm that the provided data, especially the email, is
              correct.
            </label>
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={!isChecked || loading} // Disable button unless checkbox is checked or loading
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                .....Creating User
              </>
            ) : (
              "Create User"
            )}
          </button>

          {message && (
            <p
              className={
                isSuccess ? styles.successMessage : styles.errorMessage
              }
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default CreateUserPage;
