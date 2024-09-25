import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import styles from "./UsersList.module.css";
import { axiosInstance } from "../../utility/Axios";
import { AuthContext } from "../Auth/Auth";

const UsersList = ({ usersData, isStudentData }) => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const { role_id } = userInfo;
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const token = localStorage.getItem("authToken");

  if (!usersData || usersData.length === 0) {
    return (
      <p className={styles.noUsers}>
        No {isStudentData ? "students" : "users"} available.
      </p>
    );
  }

  const handleRowClick = (id) => {
    if (!isStudentData) {
      navigate(`/contact/${id}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/api/deleteUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirmation(null);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const confirmDelete = (userId) => {
    setDeleteConfirmation(userId);
  };

  return (
    <div className={styles.usersListContainer}>
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Name</th>
            {isStudentData && <th className={styles.tableHeader}>ID Number</th>}
            {!isStudentData && (
              <>
                <th className={styles.tableHeader}>Course</th>
                <th className={styles.tableHeader}>Batch Year</th>
                <th className={styles.tableHeader}>Semester</th>{" "}
                {/* New column for semester */}
                <th className={styles.tableHeader}>Stream</th>{" "}
                {/* New column for stream */}
                <th className={styles.tableHeader}>Created Date</th>
              </>
            )}
            {(role_id === 1 || role_id === 4 || role_id === 5) && (
              <th className={styles.tableHeader}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {usersData.map((item) => (
            <tr
              key={item.user_id || item.student_id}
              className={styles.tableRow}
              onClick={() => handleRowClick(item.user_id || item.student_id)}
            >
              <td className={styles.tableCell}>
                {item.first_name || item.name} {item.last_name || ""}
              </td>
              {isStudentData && (
                <td className={styles.tableCell}>{item.id_number}</td>
              )}
              {!isStudentData && (
                <>
                  <td className={styles.tableCell}>{item.course_name}</td>
                  <td className={styles.tableCell}>{item.batch_year}</td>
                  <td className={styles.tableCell}>
                    {item.semester_name}
                  </td>{" "}
                  {/* Display semester */}
                  <td className={styles.tableCell}>
                    {item.stream_name ? item.stream_name : "-"}
                  </td>{" "}
                  {/* Display stream if available */}
                  <td className={styles.tableCell}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                </>
              )}

              {(role_id === 1 || role_id === 4 || role_id === 5) && (
                <td className={styles.actionButtons}>
                  <FaEdit
                    className={styles.editIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editUser/${item.user_id}`);
                    }}
                  />
                  <FaTrashAlt
                    className={styles.deleteIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(item.user_id);
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {deleteConfirmation && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Are you sure you want to delete this user?</p>
            <button
              onClick={() => handleDeleteUser(deleteConfirmation)}
              className={styles.confirmButton}
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setDeleteConfirmation(null)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
