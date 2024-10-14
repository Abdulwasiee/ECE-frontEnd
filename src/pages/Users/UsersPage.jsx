import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import Layout from "../../components/Layout/Layout";
import UsersList from "../../components/UserList/UsersList";
import { AuthContext } from "../../components/Auth/Auth";
import { FaPlus, FaTimes } from "react-icons/fa"; // Import icons for + and X
import styles from "./UsersPage.module.css";

const UsersPage = () => {
  const { userInfo } = useContext(AuthContext);
  const { role_id } = userInfo;
  const [error, setError] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("3");
  const [batchId, setBatchId] = useState("1");
  const [semesterId, setSemesterId] = useState("");
  const [streamId, setStreamId] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [showAddButton, setShowAddButton] = useState(false); // Toggle state for Add button
  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = async (
    roleParam,
    semesterParam = null,
    batchParam = null,
    streamParam = null
  ) => {
    const token = localStorage.getItem("authToken");
    try {
      let usersData = [];
      const endpoint =
        roleParam === "3" ? `/api/getStaffs` : `/api/getUsers/${roleParam}`;
      const response = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          semester_id: semesterParam || null,
          batch_id: batchParam || null,
          stream_id: streamParam || null,
        },
      });
      usersData =
        roleParam === "3" ? response.data.result.users : response.data.users;
      setDisplayData(usersData);
    } catch (error) {
      setError("Error fetching users data");
    }
  };

  useEffect(() => {
    fetchUsers(selectedRoleId, null, batchId, null);
  }, [selectedRoleId, batchId]);

  const handleRoleSelection = (event) => {
    const roleParam = event.target.value;
    setSelectedRoleId(roleParam);
    setBatchId("");
    setSemesterId("");
    setStreamId("");
    fetchUsers(roleParam);
  };

  const handleBatchChange = (event) => {
    const batchParam = event.target.value;
    setBatchId(batchParam);
    fetchUsers(selectedRoleId, null, batchParam);
  };

  const handleStreamChange = (event) => {
    const streamParam = event.target.value;
    setStreamId(streamParam);
    fetchUsers(selectedRoleId, semesterId, batchId, streamParam);
  };

  const handleSemesterChange = (event) => {
    const semesterParam = event.target.value;
    setSemesterId(semesterParam);
    fetchUsers(selectedRoleId, semesterParam, batchId, streamId);
  };

  const handleAddUser = () => {
    navigate("/createUser");
  };

  // Toggle the display of Add User button
  const toggleAddButton = () => {
    setShowAddButton(!showAddButton);
  };

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <Layout>
      {/* Add User button for admins or department with dynamic icons */}
      {(role_id === 1 || role_id === 4) && (
        <div className={styles.addButtonWrapper}>
          <div className={styles.iconContainer} onClick={toggleAddButton}>
            {showAddButton ? <FaTimes /> : <FaPlus />}
          </div>
          <div
            className={`${styles.addButtonContainer} ${
              showAddButton ? styles.show : styles.hide
            }`}
          >
            <button onClick={handleAddUser} className={styles.addUserButton}>
              Add User
            </button>
          </div>
        </div>
      )}

      <div className={styles.usersPageContainer}>
        <h1 className={styles.heading}>
          {role_id === 1 ? "Users List" : "Staff List"}
        </h1>
        <div className={styles.selectionContainer}>
          {(role_id === 1 || role_id === 4) && (
            <div className={styles.selectionInput}>
              <label htmlFor="roleSelect" className={styles.label}>
                Select User Role:
              </label>
              <select
                id="roleSelect"
                value={selectedRoleId}
                onChange={handleRoleSelection}
                className={styles.select}
              >
                <option value="5">Representative</option>
                <option value="3">Staff</option>
                {role_id === 1 ? <option value="4">Department</option> : null}
              </select>
            </div>
          )}

          {(role_id === 1 || role_id === 4) &&
            (selectedRoleId === "3" || selectedRoleId === "5") && (
              <div className={styles.selectionInput}>
                <label htmlFor="batchSelect" className={styles.label}>
                  Select Batch:
                </label>
                <select
                  id="batchSelect"
                  value={batchId}
                  onChange={handleBatchChange}
                  className={styles.select}
                >
                  <option value="">Select Batch</option>
                  <option value="1">2nd Year</option>
                  <option value="2">3rd Year</option>
                  <option value="3">4th Year</option>
                  <option value="4">5th Year</option>
                </select>
              </div>
            )}

          {(selectedRoleId === "3" ||
            (selectedRoleId === "5" && batchId === "3")) && (
            <div className={styles.selectionInput}>
              <label htmlFor="semesterSelect" className={styles.label}>
                Select Semester:
              </label>
              <select
                id="semesterSelect"
                value={semesterId}
                onChange={handleSemesterChange}
                className={styles.select}
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
          )}

          {((selectedRoleId === "3" || selectedRoleId === "5") &&
            batchId === "3" &&
            semesterId === "2") ||
          batchId === "4" ? (
            <div className={styles.selectionInput}>
              <label htmlFor="streamSelect" className={styles.label}>
                Select Stream:
              </label>
              <select
                id="streamSelect"
                value={streamId}
                onChange={handleStreamChange}
                className={styles.select}
              >
                <option value="">Select Stream</option>
                <option value="1">Computer Engineering</option>
                <option value="2">Communication</option>
                <option value="3">Control</option>
                <option value="4">Power Engineering</option>
              </select>
            </div>
          ) : null}
        </div>

        <UsersList usersData={displayData} role_id={role_id} />
      </div>
    </Layout>
  );
};

export default UsersPage;
