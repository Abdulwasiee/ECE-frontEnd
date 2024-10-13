import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./AssignStaff.module.css";
import Layout from "../../components/Layout/Layout";
import { FaTrash } from "react-icons/fa";
import { Spinner } from "react-bootstrap";
import { AuthContext } from "../../components/Auth/Auth";

const AssignStaffPage = () => {
  const { userInfo } = useContext(AuthContext);
  const role = userInfo.role_id;
  const { batchCourseId, courseId, selectedCourse } = useParams();
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [assignType, setAssignType] = useState("staff");
  const [showAlreadyAssignedModal, setShowAlreadyAssignedModal] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const role_id = assignType === "staff" ? 3 : 4;
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.get(`/api/getUsers/${role_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage(`Failed to fetch ${assignType}.`);
    }
  };

  const fetchAssignedMembers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.get(`/api/assignedStaff`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { courseId },
      });

      if (response.data.response.success) {
        setAssignedMembers(response.data.response.staff);
      } else {
        setErrorMessage(`Failed to fetch assigned ${assignType}.`);
      }
    } catch (error) {
      console.error("Error fetching assigned staff:", error);
      setErrorMessage(`Failed to fetch assigned ${assignType}.`);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAssignedMembers();
  }, [assignType]);

  const handleAssignMember = async () => {
    if (selectedMembers.length === 0) {
      setErrorMessage("Please select at least one member to assign.");
      return;
    }

    const alreadyAssigned = selectedMembers.some((memberId) =>
      assignedMembers.some((member) => member.user_id == memberId)
    );

    if (alreadyAssigned) {
      setShowAlreadyAssignedModal(true);
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setLoadingAssign(true);

    try {
      const token = localStorage.getItem("authToken");

      await Promise.all(
        selectedMembers.map(async (memberId) => {
          await axiosInstance.post(
            `/api/assignStaff`,
            {
              user_id: memberId,
              batch_course_id: batchCourseId,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        })
      );

      setSuccessMessage(
        `${
          assignType.charAt(0).toUpperCase() + assignType.slice(1)
        } assigned successfully!`
      );

      await fetchAssignedMembers();
      setSelectedMembers([]); // Clear selections after assignment

      // Clear success message after some time
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error(
        `Error assigning ${assignType}:`,
        error.response?.data || error.message
      );
      setErrorMessage(
        `Failed to assign ${assignType}. ${error.response?.data?.message || ""}`
      );
    } finally {
      setLoadingAssign(false);
    }
  };

  const handleDeleteMember = async (user_id) => {
    setLoadingRemove(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.delete(`/api/removeStaffCourse`, {
        params: { user_id, course_id: courseId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.result.success) {
        setSuccessMessage(response.data.result.message);
        await fetchAssignedMembers();
        closeModal();
        // Clear success message after some time
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error(`Error deleting ${assignType}:`, error);
      setErrorMessage(`Failed to delete ${assignType}.`);
    } finally {
      setLoadingRemove(false);
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
    setShowAlreadyAssignedModal(false);
  };

  // Filter members based on search term
  const filteredMembers = members.filter((member) => {
    const fullName = member.name.toLowerCase();
    const batchYear = member.batch_year.toString();
    const streamID = member.stream_id.toString();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      batchYear.includes(searchTerm) ||
      streamID.includes(searchTerm)
    );
  });

  const handleSelectMember = (user_id) => {
    setSelectedMembers((prev) =>
      prev.includes(user_id)
        ? prev.filter((id) => id !== user_id)
        : [...prev, user_id]
    );
  };

  const handleAssignTypeChange = (type) => {
    setAssignType(type);
    setSelectedMembers([]);
    setErrorMessage("");
    setSuccessMessage("");
    setSearchTerm("");
  };

  return (
    <Layout>
      <div className={styles.assignmentInfo}>
        <h2>Assigned Members</h2>
        <p>
          Use the search feature below to find and assign a user to{" "}
          <span className={styles.courseName}>{selectedCourse}</span> course. If
          the user isn't already assigned, they will receive an email with the
          details of their new assignment.
        </p>
      </div>

      <div className={styles.assignStaffPage}>
        <h2>
          Assign {assignType === "staff" ? "Staff" : "Department"} to{" "}
          {selectedCourse} course
        </h2>
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        {role === 1 && (
          <div className={styles.assignToggle}>
            <label>
              <input
                type="radio"
                name="assignType"
                value="staff"
                checked={assignType === "staff"}
                onChange={() => handleAssignTypeChange("staff")}
              />
              Assign Staff
            </label>
            <label>
              <input
                type="radio"
                name="assignType"
                value="department"
                checked={assignType === "department"}
                onChange={() => handleAssignTypeChange("department")}
              />
              Assign Department
            </label>
          </div>
        )}

        <div className={styles.selectMember}>
          <input
            type="text"
            placeholder={
              assignType === "staff" ? "search Staff" : "search Department"
            }
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className={styles.memberList}>
            {filteredMembers.map((member) => (
              <li key={member.user_id} className={styles.memberItem}>
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.user_id)}
                  onChange={() => handleSelectMember(member.user_id)}
                  className={styles.checkboxItem}
                />
                {member.name}{" "}
                <span className={styles.memberDetails}>
                  ID: {member.id_number}, Role: {member.role_name}, Stream:{" "}
                  {member.stream_name}, Batch: {member.batch_year}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleAssignMember}
          disabled={loadingAssign}
          className={styles.assignButton}
        >
          {loadingAssign ? <Spinner animation="border" size="sm" /> : "Assign"}
        </button>

        <h2>Assigned Members</h2>
        <ul className={styles.assignedList}>
          {assignedMembers.map((member) => (
            <li key={member.user_id} className={styles.assignedMember}>
              {member.name}{" "}
              <span>
                {" "}
                {member.batch_year} ,{" "}
                {member.stream_name ? member.stream_name : null}{" "}
                {member.semester_name}
              </span>
              <button
                onClick={() => openModal(member.user_id)}
                className={styles.deleteButton}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>

        {/* Confirmation Modal */}
        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to remove this member?</p>
              <button onClick={() => handleDeleteMember(memberToRemove)}>
                Yes
              </button>
              <button onClick={closeModal}>No</button>
            </div>
          </div>
        )}

        {/* Already Assigned Modal */}
        {showAlreadyAssignedModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Already Assigned</h3>
              <p>One or more selected members are already assigned.</p>
              <button onClick={closeAlreadyAssignedModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignStaffPage;
