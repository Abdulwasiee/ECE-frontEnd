import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrashAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa"; // Importing icons
import styles from "./UsersList.module.css";
import { axiosInstance } from "../../utility/Axios";
import { AuthContext } from "../Auth/Auth";
import { Spinner } from "react-bootstrap";
import Encryptor from "../Protection/Encryptor";

const UsersList = ({ usersData, isStudentData }) => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const { role_id, user_id } = userInfo;
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
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
      const encryptedId = Encryptor.encrypt(id);
      navigate(`/contact/${encryptedId}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoadingDelete(true);
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
      setLoadingDelete(false);
    }
  };

  const confirmDelete = (userId) => {
    setDeleteConfirmation(userId);
    setIsConfirmed(false);
  };

  return (
    <div className={styles.usersListContainer}>
      <div className={styles.cardsContainer}>
        {usersData.map((item) => (
          <div
            key={item.user_id || item.student_id}
            className={`${styles.userCard} ${
              item.isTeacher ? styles.teacherCard : styles.studentCard
            }`}
            onClick={() => handleRowClick(item.user_id)}
          >
            <div className={styles.userInfo}>
              <h2>
                {item.user_id === user_id
                  ? "You"
                  : `${item.first_name || item.name} ${item.last_name || ""}`}
                {item.isTeacher && (
                  <FaChalkboardTeacher className={styles.teacherIcon} />
                )}
                {!item.isTeacher && (
                  <FaUserGraduate className={styles.studentIcon} />
                )}{" "}
                {/* Student icon */}
              </h2>
              {isStudentData && <p>ID Number: {item.id_number}</p>}
              {!isStudentData && (
                <>
                  <p>Course: {item.course_name}</p>
                  <p>Batch Year: {item.batch_year}</p>
                  <p>Semester: {item.semester_name}</p>
                  <p>Stream: {item.stream_name || "-"}</p>
                  <p>
                    Created Date:{" "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
            {(role_id === 1 || role_id === 4) && (
              <div className={styles.actionButtons}>
                {item.user_id === user_id ? (
                  "-"
                ) : (
                  <FaTrashAlt
                    className={styles.deleteIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(
                        item.user_id ? item.user_id : item.student_id
                      );
                    }}
                  />
                )}
              </div>
            )}
            {!isStudentData && (
              <div className={styles.hoverInfo}>
                Click to see contact information
              </div>
            )}
          </div>
        ))}
      </div>

      {deleteConfirmation && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h1>Warning</h1>
            {isStudentData ? (
              <p>Are you sure you want to delete this student?</p>
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
