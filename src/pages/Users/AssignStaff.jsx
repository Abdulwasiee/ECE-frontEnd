import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./AssignStaff.module.css"; // Import the CSS module
import Layout from "../../components/Layout/Layout";

const AssignStaffPage = () => {
  const { batchCourseId } = useParams(); // Get the batch course ID from URL params
  const [batchId, setBatchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [streamId, setStreamId] = useState("");
  const [staffMembers, setStaffMembers] = useState([]); // To hold staff users
  const [selectedStaff, setSelectedStaff] = useState(""); // Selected staff member
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
  const [successMessage, setSuccessMessage] = useState(""); // For displaying success messages
  const role_id =3; // Default role ID for staff
  const navigate = useNavigate();

  // Streams based on your requirements
  const streams = [
    { id: 1, name: "Computer" },
    { id: 2, name: "Communication" },
    { id: 3, name: "Control" },
    { id: 4, name: "Power" },
  ];

  // Fetch users based on batchId, semesterId, streamId
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token from local storage
      const response = await axiosInstance.get(`/api/getUsers/${role_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          batch_id: batchId,
          semester_id: semesterId,
          stream_id: streamId,
        },
      });
      setStaffMembers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to fetch staff members.");
    }
  };

  useEffect(() => {
    if (batchId && semesterId) {
      fetchUsers(); // Fetch users when batchId or semesterId changes
    }
  }, [batchId, semesterId, streamId]);

  const handleAssignStaff = async () => {
    // Validate fields
    if (
      !batchId ||
      !semesterId ||
      (batchId === "4" && semesterId === "2" && !streamId) ||
      !selectedStaff
    ) {
      setErrorMessage("Please select all required fields.");
      return;
    }
    setErrorMessage(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success message

    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.post(
        `/api/assignStaff`,
        {
          user_id: selectedStaff,
          batch_course_id: batchCourseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Staff assigned successfully!");
      navigate("/courses"); // Redirect to the courses page or desired route
    } catch (error) {
      console.error("Error assigning staff:", error);
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message || "Failed to assign staff."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Layout>
      <div className={styles.assignStaffPage}>
        <h1>Assign Staff to Course</h1>
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="batch" className={styles.label}>
            Batch:
          </label>
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className={styles.select}
          >
            <option value="">Select Batch</option>
            <option value="2">Batch 2</option>
            <option value="3">Batch 3</option>
            <option value="4">Batch 4</option>
            <option value="5">Batch 5</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="semester" className={styles.label}>
            Semester:
          </label>
          <select
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            className={styles.select}
          >
            <option value="">Select Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>
        {(batchId === "4" && semesterId === "2") || batchId === "5" ? (
          <div className={styles.formGroup}>
            <label htmlFor="stream" className={styles.label}>
              Stream:
            </label>
            <select
              value={streamId}
              onChange={(e) => setStreamId(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Stream</option>
              {streams.map((stream) => (
                <option key={stream.id} value={stream.id}>
                  {stream.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className={styles.formGroup}>
          <label htmlFor="staff" className={styles.label}>
            Select Staff:
          </label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className={styles.select}
          >
            <option value="">Select Staff Member</option>
            {staffMembers.map((staff) => (
              <option key={staff.user_id} value={staff.user_id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.assignButton} onClick={handleAssignStaff}>
          Assign Staff
        </button>
      </div>
    </Layout>
  );
};

export default AssignStaffPage;
