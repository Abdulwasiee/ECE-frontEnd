import React, { useState, useContext } from "react";
import { AuthContext } from "../../components/Auth/Auth"; // Make sure to import context
import { axiosInstance } from "../../utility/Axios";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaTrash,
  FaExternalLinkAlt,
} from "react-icons/fa";
import Modal from "react-modal";
import styles from "./ProfilePage.module.css";
import Layout from "../../components/Layout/Layout";
const token = localStorage.getItem("authToken");
// Ensure that you set the app element for accessibility
Modal.setAppElement("#root"); // Adjust as necessary

const ProfilePage = () => {
  const { userInfo, logout } = useContext(AuthContext); // Get userInfo from context

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const response = await axiosInstance.delete(
        `/api/student/${userInfo.user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      if (response.data.success) {
        alert("Account deleted successfully!");
        logout();
      } else {
        alert("Error deleting account: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account.");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  const getBatchYear = (batchId) => {
    const id = Number(batchId);

    switch (id) {
      case 1:
        return "2nd";
      case 2:
        return "3rd";
      case 3:
        return "4th";
      case 4:
        return "5th";
      default:
        return "Unknown Year";
    }
  };

  // Function to map stream ID to stream name
  const getStreamName = (streamId) => {
    switch (streamId) {
      case 1:
        return "Computer Engineering";
      case 2:
        return "Communication";
      case 3:
        return "Control Systems";
      case 4:
        return "Power Engineering";
      default:
        return "Unknown Stream";
    }
  };

  // Function to map role ID to role name
  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return "Admin";
      case 2:
        return "Student";
      case 3:
        return "Staff";
      case 4:
        return "Department";
      case 5:
        return "Representative";
      default:
        return "Unknown Role";
    }
  };

  return (
    <Layout>
      <div className={styles.profilePage}>
        <h1 className={styles.profileTitle}>Profile Information</h1>
        <div className={styles.profileInfo}>
          {userInfo.first_name && (
            <div className={styles.profileDetail}>
              <FaUser /> <span>First Name: {userInfo.first_name}</span>
            </div>
          )}
          {userInfo.last_name && (
            <div className={styles.profileDetail}>
              <FaUser /> <span>Last Name: {userInfo.last_name}</span>
            </div>
          )}
          {userInfo.batch_ids.length > 0 && (
            <div className={styles.profileDetail}>
              <FaIdCard />
              <span>
                Batch: {userInfo.batch_ids.map(getBatchYear).join(" and ")}{" "}
                year.
              </span>
            </div>
          )}
          {userInfo.stream_id && (
            <div className={styles.profileDetail}>
              <FaIdCard />
              <span>Stream: {getStreamName(userInfo.stream_id)}</span>
            </div>
          )}
          {userInfo.role_id && (
            <div className={styles.profileDetail}>
              <FaIdCard />
              <span>{getRoleName(userInfo.role_id)}</span>
            </div>
          )}
          {userInfo.email && (
            <div className={styles.profileDetail}>
              <FaEnvelope /> <span>Email: {userInfo.email}</span>
            </div>
          )}
        </div>

        {/* Only show the delete button if the user is a Student (role_id = 2) */}
        {userInfo.role_id === 2 && (
          <button
            className={styles.deleteAccountButton}
            onClick={() => setIsModalOpen(true)}
          >
            <FaTrash /> Delete Account
          </button>
        )}

        <div className={styles.universityPortal}>
          <h2>Quick Links</h2>
          <a
            href="https://sis.hu.edu.et/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.portalLink}
          >
            Go to Hawassa University Portal <FaExternalLinkAlt />
          </a>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className={styles.modalContent}
          overlayClassName={styles.modalOverlay}
          contentLabel="Confirm Delete Account"
        >
          <h2>Are you sure you want to delete your account?</h2>
          <button onClick={handleDeleteAccount} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Yes, delete my account"}
          </button>
          <button
            className={styles.cancel}
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </Modal>
      </div>
    </Layout>
  );
};

export default ProfilePage;
