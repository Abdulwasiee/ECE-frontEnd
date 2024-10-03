import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./AssignStaff.module.css";
import Layout from "../../components/Layout/Layout";
import { FaTrash } from "react-icons/fa";
import { Spinner } from "react-bootstrap"; // Importing Bootstrap Spinner for loading indication

const AssignStaffPage = () => {
  const { batchCourseId, courseId } = useParams();
  const [batchId, setBatchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [streamId, setStreamId] = useState("");
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [assignedStaff, setAssignedStaff] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState(null);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const role_id = 3;
  const navigate = useNavigate();

  const streams = [
    { id: 1, name: "Computer" },
    { id: 2, name: "Communication" },
    { id: 3, name: "Control" },
    { id: 4, name: "Power" },
  ];

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
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
      fetchUsers();
    }
    fetchAssignedStaff();
  }, [batchId, semesterId]);

  const handleAssignStaff = async () => {
    if (
      !batchId ||
      !semesterId ||
      (batchId === "4" && semesterId === "2" && !streamId) ||
      !selectedStaff
    ) {
      setErrorMessage("Please select all required fields.");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    setLoadingAssign(true); // Set loading state

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

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay before refreshing
      await fetchAssignedStaff();

      // Reset success message after a delay
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Error assigning staff:", error);
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message || "Failed to assign staff."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoadingAssign(false); // Reset loading state
    }
  };

  const handleDeleteStaff = async (user_id) => {
    setLoadingRemove(true); // Set loading state for removal
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.delete(`/api/removeStaffCourse`, {
        params: { user_id, course_id: courseId },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.result.success) {
        setSuccessMessage(response.data.result.message);

        await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay before refreshing
        fetchAssignedStaff();
        closeModal();

        // Reset success message after a delay
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000); // Reset after 2 seconds
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      setErrorMessage("Failed to delete staff.");
    } finally {
      setLoadingRemove(false); // Reset loading state
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

  const handleStaffSelection = (userId) => {
    setSelectedStaff(userId);
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
        <div className={styles.formInputs}>
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
        </div>

        <div className={styles.staffList}>
          <h3>Select Staff Member:</h3>
          <ul>
            {staffMembers.map((staff) => (
              <li key={staff.user_id}>
                <label className={styles.staffItem}>
                  <input
                    type="radio"
                    name="staff"
                    value={staff.user_id}
                    checked={selectedStaff === staff.user_id}
                    onChange={() => handleStaffSelection(staff.user_id)}
                  />
                  {staff.name}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <button className={styles.assignButton} onClick={handleAssignStaff}>
          {loadingAssign ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Assign Staff"
          )}
        </button>

        <div className={styles.assignedStaffSection}>
          <h2 className={styles.staffHeader}>Assigned Staff Member</h2>
          {assignedStaff.length > 0 ? (
            <table className={styles.assignedStaffTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Batch Year</th>
                  <th>Semester</th>
                  <th>Stream</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedStaff.map((staff) => (
                  <tr key={staff.user_id}>
                    <td>{staff.name}</td>
                    <td>{staff.batch_year}</td>
                    <td>{staff.semester_name}</td>
                    <td>{staff.stream_name}</td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={() => openModal(staff.user_id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No staff members assigned to this course.</p>
          )}
        </div>

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
                {loadingRemove ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Yes, Remove"
                )}
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
