import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./AssignStaff.module.css";
import Layout from "../../components/Layout/Layout";
import { FaTrash } from "react-icons/fa";
import { Spinner } from "react-bootstrap"; // Importing Bootstrap Spinner for loading indication
import { AuthContext } from "../../components/Auth/Auth";

const AssignStaffPage = () => {
  const { userInfo } = useContext(AuthContext);
  const role = userInfo.role_id; // Admin if role === 1
  const { batchCourseId, courseId } = useParams();
  const [batchId, setBatchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [streamId, setStreamId] = useState("");
  const [members, setMembers] = useState([]); // For both staff and departments
  const [selectedMember, setSelectedMember] = useState(""); // For both staff and department
  const [assignedMembers, setAssignedMembers] = useState([]); // For both staff and departments
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [assignType, setAssignType] = useState("staff"); // Default assign type is staff
  const role_id = assignType === "staff" ? 3 : 4; // 3 for staff, 4 for department
  const navigate = useNavigate();

  const streams = [
    { id: 1, name: "Computer" },
    { id: 2, name: "Communication" },
    { id: 3, name: "Control" },
    { id: 4, name: "Power" },
  ];

  // Fetch Users based on the assign type (staff/department)
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.get(`/api/getUsers/${role_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          batch_id: assignType === "staff" ? batchId : null,
          semester_id: assignType === "staff" ? semesterId : null,
          stream_id: assignType === "staff" ? streamId : null,
        },
      });
      setMembers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage(`Failed to fetch ${assignType}.`);
    }
  };

  // Fetch already assigned members
  const fetchAssignedMembers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.get(`/api/assignedStaff`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { courseId },
      });

      if (response.data.response.success) {
        setAssignedMembers(response.data.response.staff);
      }
    } catch (error) {
      console.error("Error fetching assigned staff:", error);
      setErrorMessage(`Failed to fetch assigned ${assignType}.`);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAssignedMembers();
  }, [assignType, batchId, semesterId]);

  const handleAssignMember = async () => {
    if (
      (assignType === "staff" &&
        (!batchId ||
          !semesterId ||
          (batchId === "4" && semesterId === "2" && !streamId))) ||
      !selectedMember
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
        `/api/assignStaff`, // This would need to be adapted if different for department
        {
          user_id: selectedMember,
          batch_course_id: batchCourseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage(
        `${
          assignType.charAt(0).toUpperCase() + assignType.slice(1)
        } assigned successfully!`
      );

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay before refreshing
      await fetchAssignedMembers();

      // Reset success message after a delay
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000); // Reset after 2 seconds
    } catch (error) {
      console.error(`Error assigning ${assignType}:`, error);
      setErrorMessage(`Failed to assign ${assignType}.`);
    } finally {
      setLoadingAssign(false); // Reset loading state
    }
  };

  const handleDeleteMember = async (user_id) => {
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
        fetchAssignedMembers();
        closeModal();

        setTimeout(() => {
          setSuccessMessage("");
        }, 2000); // Reset after 2 seconds
      }
    } catch (error) {
      console.error(`Error deleting ${assignType}:`, error);
      setErrorMessage(`Failed to delete ${assignType}.`);
    } finally {
      setLoadingRemove(false); // Reset loading state
    }
  };

  const openModal = (user_id) => {
    setMemberToRemove(user_id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMemberToRemove(null);
  };

  return (
    <Layout>
      <div className={styles.assignStaffPage}>
        <h1>
          Assign {assignType === "staff" ? "Staff" : "Department"} to Course
        </h1>
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        {/* Admin can toggle between assigning staff or department */}
        {role === 1 && (
          <div className={styles.assignToggle}>
            <label>
              <input
                type="radio"
                name="assignType"
                value="staff"
                checked={assignType === "staff"}
                onChange={() => setAssignType("staff")}
              />
              Assign Staff
            </label>
            <label>
              <input
                type="radio"
                name="assignType"
                value="department"
                checked={assignType === "department"}
                onChange={() => setAssignType("department")}
              />
              Assign Department
            </label>
          </div>
        )}

        {/* Form for staff assignment if applicable */}
        {assignType === "staff" && (
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

            {/* Stream select only appears when batch and semester are selected */}
            {((batchId === "3" && semesterId === "2") || batchId ==="4") && (
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
            )}
          </div>
        )}

        {/* List of available members (both staff and department) */}
        <div className={styles.availableMembers}>
          <h3>Available {assignType === "staff" ? "Staff" : "Departments"}:</h3>
          {members.length === 0 ? (
            <p>No members available for this selection.</p>
          ) : (
            <ul>
              {members.map((member) => (
                <li key={member.user_id} className={styles.member}>
                  <label>
                    <input
                      type="radio"
                      name="selectedMember"
                      value={member.user_id}
                      checked={selectedMember === member.user_id}
                      onChange={() => setSelectedMember(member.user_id)}
                    />
                    {member.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Assign button */}
        <button
          className={styles.assignButton}
          onClick={handleAssignMember}
          disabled={loadingAssign || !selectedMember}
        >
          {loadingAssign ? <Spinner animation="border" size="sm" /> : "Assign"}
        </button>

        {/* Already assigned members */}
        <div className={styles.assignedMembers}>
          <h3>Assigned {assignType === "staff" ? "Staff" : "Departments"}:</h3>
          {assignedMembers.length === 0 ? (
            <p>No members assigned yet.</p>
          ) : (
            <ul>
              {assignedMembers.map((member) => (
                <li key={member.user_id} className={styles.member}>
                  {member.name}
                  <FaTrash
                    className={styles.deleteIcon}
                    onClick={() => openModal(member.user_id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <p>Are you sure you want to remove this member?</p>
              <div className={styles.modalActions}>
                <button
                  className={styles.confirmButton}
                  onClick={() => handleDeleteMember(memberToRemove)}
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignStaffPage;
