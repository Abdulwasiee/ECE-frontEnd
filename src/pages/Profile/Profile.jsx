import React, { useState, useContext } from "react";
import { AuthContext } from "../../components/Auth/Auth"; // Make sure to import context
import { axiosInstance } from "../../utility/Axios";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaTrash,
  FaExternalLinkAlt,
  FaKey,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Modal from "react-modal";
import styles from "./ProfilePage.module.css";
import Layout from "../../components/Layout/Layout";

// Ensure that you set the app element for accessibility
Modal.setAppElement("#root"); // Adjust as necessary

const ProfilePage = () => {
  const { userInfo, logout } = useContext(AuthContext); // Get userInfo from context

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // State to toggle password change form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false); // Toggle old password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility

  const token = localStorage.getItem("authToken");

  const handleDeleteAccount = async () => {
    try {
      const response = await axiosInstance.delete(
        `/api/student/${userInfo.user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setTimeout(() => {
          logout();
        }, 1000);
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(
        "/api/changePassword",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.result.success) {
        setPasswordSuccess(response.data.result.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(response.data.result.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("An error occurred while changing the password.");
    } finally {
      setIsSubmitting(false);
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
        {userInfo.role_id == 2 ? null : (
          <button
            className={styles.changePasswordButton}
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            <FaKey /> Change Password
          </button>
        )}

        {showPasswordForm && (
          <form className={styles.passwordForm} onSubmit={handlePasswordChange}>
            <div className={styles.passwordInputGroup}>
              <label htmlFor="oldPassword">Old Password</label>
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <span
                className={styles.togglePasswordIcon}
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className={styles.passwordInputGroup}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className={styles.togglePasswordIcon}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className={styles.passwordInputGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className={styles.togglePasswordIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Change Password"}
            </button>

            {passwordError && (
              <div className={styles.errorMessage}>{passwordError}</div>
            )}
            {passwordSuccess && (
              <div className={styles.successMessage}>{passwordSuccess}</div>
            )}
          </form>
        )}

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
        >
          <h2>Are you sure you want to delete your account?</h2>
          <div className={styles.modalButtons}>
            <button
              className={styles.confirmButton}
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default ProfilePage;
