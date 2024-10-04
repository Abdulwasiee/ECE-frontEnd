import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./UsersList.module.css";
import { axiosInstance } from "../../utility/Axios";
import { AuthContext } from "../Auth/Auth";
import { Spinner } from "react-bootstrap"; // Importing Bootstrap Spinner for loading indication

const UsersList = ({ usersData, isStudentData }) => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const { role_id } = userInfo;
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false); // Loading state for delete
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
    setLoadingDelete(true); // Set loading state
    try {
      if (isStudentData) {
        await axiosInstance.delete(`/api/student/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axiosInstance.delete(`/api/deleteUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setDeleteConfirmation(null);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoadingDelete(false); // Reset loading state
    }
  };

  const confirmDelete = (userId) => {
    setDeleteConfirmation(userId);
    setIsConfirmed(false);
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
                <th className={styles.tableHeader}>Semester</th>
                <th className={styles.tableHeader}>Stream</th>
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
                  <td className={styles.tableCell}>{item.semester_name}</td>
                  <td className={styles.tableCell}>
                    {item.stream_name ? item.stream_name : "-"}
                  </td>
                  <td className={styles.tableCell}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                </>
              )}

              {(role_id === 1 || role_id === 4 || role_id === 5) && (
                <td className={styles.actionButtons}>
                  {!isStudentData && (
                    <FaTrashAlt
                      className={styles.deleteIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(item.user_id);
                      }}
                    />
                  )}
                  {isStudentData && (
                    <FaTrashAlt
                      className={styles.deleteIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(item.student_id); // Use student_id for student data
                      }}
                    />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {deleteConfirmation && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h1>Warning</h1>
            {isStudentData ? (
              <>
                <p>Are you sure you want to delete this student?</p>
              </>
            ) : (
              <>
                <p>
                  Deleting the user is not recommended as it will remove the
                  user from all batches if assigned to other courses.
                </p>
                <p>
                  Instead, navigate to courses and remove the user for specific
                  courses.
                </p>
                <p>Are you sure you want to delete this user?</p>
              </>
            )}

            <label>
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
              I understand the consequences and want to delete this user.
            </label>

            <button
              onClick={() => handleDeleteUser(deleteConfirmation)}
              className={styles.confirmButton}
              disabled={!isConfirmed}
            >
              {loadingDelete ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Yes, Delete"
              )}
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
