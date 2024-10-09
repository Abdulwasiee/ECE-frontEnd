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
  const [showAlreadyAssignedModal, setShowAlreadyAssignedModal] =
    useState(false); // New state for already assigned modal
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

    // Check if the selected member is already assigned
    const isAlreadyAssigned = assignedMembers.some(
      (member) => member.user_id == selectedMember
    );

    if (isAlreadyAssigned) {
      setShowAlreadyAssignedModal(true); // Show modal if already assigned
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setLoadingAssign(true); // Set loading state

    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.post(
        `/api/assignStaff`,
        {
          user_id: selectedMember,
          batch_course_id: batchCourseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
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
      console.log(response);
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

  const closeAlreadyAssignedModal = () => {
    setShowAlreadyAssignedModal(false); // Close the already assigned modal
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
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
              </select>
            </div>

            {batchId === "4" && semesterId === "2" && (
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

        {/* Select member to assign */}
        <div className={styles.selectMember}>
          <label htmlFor="member" className={styles.label}>
            Select Member:
          </label>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className={styles.select}
          >
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAssignMember} disabled={loadingAssign}>
          {loadingAssign ? <Spinner animation="border" size="sm" /> : "Assign"}
        </button>

        {/* Assigned members list */}
        <h2>Assigned Members</h2>
        {assignedMembers.length === 0 ? (
          <p>No members assigned.</p>
        ) : (
          <ul>
            {assignedMembers.map((member) => (
              <li key={member.user_id}>
                {member.name}{" "}
                <button onClick={() => openModal(member.user_id)}>
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Modal for confirming removal */}
        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Confirm Removal</h2>
              <p>Are you sure you want to remove this member?</p>
              <button onClick={() => handleDeleteMember(memberToRemove)}>
                Yes
              </button>
              <button onClick={closeModal}>No</button>
            </div>
          </div>
        )}

        {/* Modal for already assigned member notification */}
        {showAlreadyAssignedModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Member Already Assigned</h2>
              <p>This member is already assigned to the course.</p>
              <button onClick={closeAlreadyAssignedModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignStaffPage;
