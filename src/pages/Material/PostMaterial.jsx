import React, { useState, useEffect, useContext } from "react";
import { axiosInstance } from "../../utility/Axios";
import uploadStyles from "./PostMaterial.module.css";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../components/Auth/Auth";

const FileUploadPage = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [batchId, setBatchId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semester_id, setsemester_id] = useState("");
  const [stream_id, setstream_id] = useState("");
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { userInfo } = useContext(AuthContext);
  const userRole = userInfo?.role_id;
  const userBatches = userInfo?.batch_ids;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (userRole) {
      if (userRole === 1) {
        fetchBatches();
      } else if (userRole === 3) {
        fetchUserBatches(userBatches);
      } else if (userRole === 5 && userBatches.length) {
        setBatchId(userBatches[0]);
        fetchCourses(userBatches[0], semester_id, stream_id);
      }
    }
  }, [userRole, userBatches]);

  const fetchBatches = () => {
    setBatches([
      { batch_id: 1, batch_name: "2nd Year" },
      { batch_id: 2, batch_name: "3rd Year" },
      { batch_id: 3, batch_name: "4th Year" },
      { batch_id: 4, batch_name: "5th Year" },
    ]);
  };

  const fetchCourses = async (batchId, semester_id = "", stream_id = "") => {
    if (!batchId) return;

    try {
      const response = await axiosInstance.get(`/api/getCourses/${batchId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { semester_id, stream_id },
      });
      setCourses(response.data.result.courses || []);
    } catch (error) {
      setError("Error fetching courses");
    }
  };

  const handleBatchChange = (event) => {
    const selectedBatchId = event.target.value;
    setBatchId(selectedBatchId);
    setCourseId("");
    setsemester_id("");
    setstream_id("");
    fetchCourses(selectedBatchId, semester_id, stream_id);
  };

  const handleCourseChange = (event) => {
    setCourseId(event.target.value);
  };

  const handleSemesterChange = (event) => {
    const selectedsemester_id = event.target.value;
    setsemester_id(selectedsemester_id);
    fetchCourses(batchId, selectedsemester_id, stream_id);
  };

  const handleStreamChange = (event) => {
    const selectedstream_id = event.target.value;
    setstream_id(selectedstream_id);
    fetchCourses(batchId, semester_id, selectedstream_id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !file || !courseId) {
      setError("Title, file, and course selection are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("batchCourseId", courseId);
    formData.append("file", file);
    formData.append("semesterId", semester_id);
    formData.append("streamId", stream_id);

    try {
      const response = await axiosInstance.post("/api/uploadFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(response.data.message);
      setError(null);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      setError(error.response?.data?.message || "Error uploading file");
      setSuccess(null);
    }
  };

  return (
    <Layout>
      <div className={uploadStyles.fileUploadContainer}>
        <h1 className={uploadStyles.heading}>Upload Material</h1>
        {error && <p className={uploadStyles.error}>{error}</p>}
        {success && <p className={uploadStyles.success}>{success}</p>}
        <form onSubmit={handleSubmit} className={uploadStyles.uploadForm}>
          {(userRole === 1 || userRole === 3) && (
            <div className={uploadStyles.formGroup}>
              <label htmlFor="batch" className={uploadStyles.label}>
                Batch:
              </label>
              <select
                id="batch"
                value={batchId || ""}
                onChange={handleBatchChange}
                className={uploadStyles.input}
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch.batch_id} value={batch.batch_id}>
                    {batch.batch_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={uploadStyles.formGroup}>
            <label htmlFor="semester" className={uploadStyles.label}>
              Semester:
            </label>
            <select
              id="semester"
              value={semester_id || ""}
              onChange={handleSemesterChange}
              className={uploadStyles.input}
            >
              <option value="">Select Semester</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
            </select>
          </div>

          {userRole === 1 &&
            ((batchId === "3" && semester_id === "2") || batchId === "4") && (
              <div className={uploadStyles.formGroup}>
                <label htmlFor="stream" className={uploadStyles.label}>
                  Stream:
                </label>
                <select
                  id="stream"
                  value={stream_id || ""}
                  onChange={handleStreamChange}
                  className={uploadStyles.input}
                >
                  <option value="">Select Stream</option>
                  <option value="1">Computer</option>
                  <option value="2">Communcation</option>
                  <option value="3">Control</option>
                  <option value="4">power</option>
                </select>
              </div>
            )}

          {(userRole === 1 || userRole === 3 || userRole === 5) && (
            <div className={uploadStyles.formGroup}>
              <label htmlFor="course" className={uploadStyles.label}>
                Course:
              </label>
              <select
                id="course"
                value={courseId || ""}
                onChange={handleCourseChange}
                className={uploadStyles.input}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={uploadStyles.formGroup}>
            <label htmlFor="title" className={uploadStyles.label}>
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={uploadStyles.input}
            />
          </div>

          <div className={uploadStyles.formGroup}>
            <label htmlFor="file" className={uploadStyles.label}>
              File:
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              className={uploadStyles.input}
            />
          </div>

          <button type="submit" className={uploadStyles.submitButton}>
            Upload
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default FileUploadPage;
