import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./AssignStaff.module.css";
import Layout from "../../components/Layout/Layout";
import { FaTrash } from "react-icons/fa"; // Importing delete icon

const AssignStaffPage = () => {
  const { batchCourseId, courseId } = useParams(); // Get the batch course ID and course ID from URL params
  const [batchId, setBatchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [streamId, setStreamId] = useState("");
  const [staffMembers, setStaffMembers] = useState([]); // To hold staff users
  const [selectedStaff, setSelectedStaff] = useState(""); // Selected staff member
  const [assignedStaff, setAssignedStaff] = useState([]); // To hold assigned staff members
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
  const [successMessage, setSuccessMessage] = useState(""); // For displaying success messages
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [staffToRemove, setStaffToRemove] = useState(null); // Staff ID to remove
  const role_id = 3; // Default role ID for staff
  const navigate = useNavigate();

  // Streams based on your requirements
  const streams = [
    { id: 1, name: "Computer" },
    { id: 2, name: "Communication" },
    { id: 3, name: "Control" },
    { id: 4, name: "Power" },
  ];

  // Fetch staff users based on batchId, semesterId, streamId
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
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to fetch staff members.");
    }
  };

  // Fetch assigned staff based on courseId
  const fetchAssignedStaff = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.get(`/api/assignedStaff`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { courseId },
      });

      if (response.data.response.success) {
        setAssignedStaff(response.data.response.staff);
      }
    } catch (error) {
      console.error("Error fetching assigned staff:", error);
      setErrorMessage("Failed to fetch assigned staff.");
    }
  };

  useEffect(() => {
    if (batchId && semesterId) {
      fetchUsers(); // Fetch users when batchId or semesterId changes
    }
    fetchAssignedStaff(); // Fetch assigned staff on component mount
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

  const handleDeleteStaff = async (user_id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.delete(`/api/removeStaffCourse`, {
        params: { user_id, course_id: courseId },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.result.success) {
        setSuccessMessage(response.data.result.message);
      }
      fetchAssignedStaff();
      setShowModal(false); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting staff:", error);
      setErrorMessage("Failed to delete staff.");
    }
  };

  const openModal = (user_id) => {
    setStaffToRemove(user_id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setStaffToRemove(null);
  };

  return (
    <Layout>
      {/* Display Assigned Staff Section */}
      <div className={styles.assignedStaffSection}>
        <h2>Assigned Staff Members</h2>
        {assignedStaff.length > 0 ? (
          <ul>
            {assignedStaff.map((staff) => (
              <li key={staff.user_id} className={styles.assignedStaffItem}>
                <div className={styles.staffDetails}>
                  <div>
                    <strong>Name:</strong> {staff.name}
                  </div>
                  <div>
                    <strong>Batch Year:</strong> {staff.batch_year}
                  </div>
                  <div>
                    <strong>Semester:</strong> {staff.semester_name}
                  </div>
                  <div>
                    <strong>Stream:</strong> {staff.stream_name}
                  </div>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => openModal(staff.user_id)}
                  aria-label="Delete staff"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No staff members assigned to this course.</p>
        )}
      </div>

      <div className={styles.assignStaffPage}>
        <h1>Assign Staff to Course</h1>
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        {/* Form Section */}
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
            <option value="1">2 year</option>
            <option value="2">3 year</option>
            <option value="3">4 year</option>
            <option value="4">5 year</option>
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

        {(batchId === "3" && semesterId === "2") || batchId === "4" ? (
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

        {/* Confirmation Modal */}
        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to remove this staff member from the
                course?
              </p>
              <button
                className={styles.confirmButton}
                onClick={() => handleDeleteStaff(staffToRemove)}
              >
                Yes, Remove
              </button>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignStaffPage;
