import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import Layout from "../../components/Layout/Layout";
import UsersList from "../../components/UserList/UsersList";
import { AuthContext } from "../../components/Auth/Auth";
import styles from "./UsersPage.module.css";

const UsersPage = () => {
  const { userInfo } = useContext(AuthContext);
  const { role_id } = userInfo;
  const [error, setError] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("3"); // Default to Staff
  const [batchId, setBatchId] = useState("1"); // Default to 2nd Year
  const [semesterId, setSemesterId] = useState("1"); // Default to Semester 1
  const [streamId, setStreamId] = useState(""); // No default stream
  const [displayData, setDisplayData] = useState([]); // Data to be displayed
  const navigate = useNavigate();

  const fetchUsers = async (
    roleParam,
    semesterParam = null,
    batchParam = null,
    streamParam = null
  ) => {
    const token = localStorage.getItem("authToken");
    try {
      let usersData = [];

      // Fetch either from getStaff or getUsers based on selected role
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

      // Assign the fetched data to usersData
      usersData =
        roleParam === "3" ? response.data.result.users : response.data.users;

      // Set the fetched data for display
      setDisplayData(usersData);
    } catch (error) {
      setError("Error fetching users data");
    }
  };

  useEffect(() => {
    fetchUsers(selectedRoleId, null, batchId, null);
  }, [selectedRoleId, batchId]); // Fetch users when role or batch changes

  const handleRoleSelection = (event) => {
    const roleParam = event.target.value;
    setSelectedRoleId(roleParam);
    setBatchId(""); // Clear batch ID
    setSemesterId(""); // Clear semester ID
    setStreamId(""); // Clear stream ID
    fetchUsers(roleParam); // Fetch users for the selected role
  };

  const handleBatchChange = (event) => {
    const batchParam = event.target.value;
    setBatchId(batchParam);
    if (selectedRoleId === "4") {
      setSemesterId(""); // Clear semester if department is selected
      setStreamId(""); // Clear stream if department is selected
    }
    fetchUsers(selectedRoleId, null, batchParam); // Fetch users for the selected batch
  };

  const handleStreamChange = (event) => {
    const streamParam = event.target.value;
    setStreamId(streamParam);
    fetchUsers(selectedRoleId, semesterId, batchId, streamParam); // Fetch users with the selected stream
  };

  const handleSemesterChange = (event) => {
    const semesterParam = event.target.value;
    setSemesterId(semesterParam);
    fetchUsers(selectedRoleId, semesterParam, batchId, streamId); // Fetch users with the selected semester
  };

  const handleAddUser = () => {
    navigate("/createUser");
  };

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <Layout>
      {/* Add User Button for admins, representatives, and department */}
      {(role_id === 1 || role_id === 5 || role_id === 4) && (
        <button onClick={handleAddUser} className={styles.addUserButton}>
          Add User
        </button>
      )}

      <div className={styles.usersPageContainer}>
        <h1 className={styles.heading}>
          {role_id === 1 ? "Users List" : "Staff List"}
        </h1>

        {/* Role selection for admin and department */}
        {(role_id === 1 || role_id === 4) && (
          <div className={styles.roleSelection}>
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

        {/* Batch selection for staff and representatives */}
        {(role_id === 1 || role_id === 4) &&
          (selectedRoleId === "3" || selectedRoleId === "5") && (
            <div className={styles.batchSelection}>
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

        {/* Semester selection for staff only */}
        {(selectedRoleId === "3" ||
          (selectedRoleId === "5" && batchId === "3")) && (
          <div className={styles.semesterSelection}>
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

        {/* Stream selection for specific conditions */}
        {((selectedRoleId === "3" || selectedRoleId === "5") &&
          batchId === "3" &&
          semesterId === "2") ||
        batchId === "4" ? (
          <div className={styles.streamSelection}>
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

        {/* Display list of users or staff based on the selection */}
        <UsersList
          usersData={displayData} // Pass only the relevant data here
          role_id={role_id}
        />
      </div>
    </Layout>
  );
};

export default UsersPage;
