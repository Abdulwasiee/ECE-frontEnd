import React, { useEffect, useState, useContext } from "react";
import { axiosInstance } from "../../utility/Axios";
import UsersList from "../../components/UserList/UsersList";
import styles from "./StudentPage.module.css";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../components/Auth/Auth";

const StudentPage = () => {
  const { userInfo } = useContext(AuthContext);
  const { role_id } = userInfo;
  const [batchId, setBatchId] = useState(1); // Default to batch 1
  const [streamId, setStreamId] = useState(null); // State for stream ID
  const [studentsData, setStudentsData] = useState([]);
  const [error, setError] = useState(null);
  const isRepresentative = role_id === 5;
  const token = localStorage.getItem("authToken");

  const fetchStudents = async (selectedBatchId, selectedStreamId) => {
    try {
      const response = await axiosInstance.get(
        `/api/students/${selectedBatchId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { stream_id: selectedStreamId },
        }
      );
      setStudentsData(response.data.students);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Error fetching student data");
    }
  };

  useEffect(() => {
    fetchStudents(batchId, streamId);
  }, [batchId, streamId]);

  const handleBatchChange = (event) => {
    setBatchId(Number(event.target.value));
    setStreamId(null); // Reset stream ID on batch change
  };

  const handleStreamChange = (event) => {
    const value = event.target.value;
    setStreamId(value === "" ? null : Number(value)); // Set to null if no selection
  };

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <Layout>
      <div className={styles.studentPageContainer}>
        <h1 className={styles.heading}>Student List</h1>

        {/* Conditionally render batch selection based on role */}
        {!isRepresentative && (
          <div className={styles.batchSelection}>
            <label htmlFor="batchSelect" className={styles.label}>
              Select Batch Year:
            </label>
            <select
              id="batchSelect"
              value={batchId}
              onChange={handleBatchChange}
              className={`${styles.select} ${styles.customSelect}`} // Add custom class for styling
            >
              <option value="1">2nd Year</option>
              <option value="2">3rd Year</option>
              <option value="3">4th Year</option>
              <option value="4">5th Year</option>
            </select>
          </div>
        )}

        {/* Conditionally render stream selection for 4th and 5th year batches */}
        {(batchId === 3 || batchId === 4) && !isRepresentative && (
          <div className={styles.streamSelection}>
            <label htmlFor="streamSelect" className={styles.label}>
              Select Stream:
            </label>
            <select
              id="streamSelect"
              value={streamId || ""}
              onChange={handleStreamChange}
              className={`${styles.select} ${styles.customSelect}`} // Add custom class for styling
            >
              <option value="">Select Stream</option>
              <option value="1">Computer</option>
              <option value="2">Communication</option>
              <option value="3">Control</option>
              <option value="4">Power</option>
            </select>
          </div>
        )}

        <UsersList
          usersData={studentsData}
          isStudentData={true}
          role_id={role_id}
        />
      </div>
    </Layout>
  );
};

export default StudentPage;
