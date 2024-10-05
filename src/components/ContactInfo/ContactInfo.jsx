import React, { useContext, useState } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaPhone,
  FaCalendar,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import styles from "./ContactInfo.module.css";
import { AuthContext } from "../Auth/Auth";

const ContactInfo = ({ contactData }) => {
  const { userInfo } = useContext(AuthContext);
  const { user_id: currentUserId, role_id: roleId } = userInfo;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axiosInstance.delete(
        `/api/deleteContact/${userToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        window.location.reload();
      } else {
        alert("Error deleting contact");
      }
    } catch (error) {
      console.error("Error deleting contact", error);
      alert("Network error or failed request");
    }

    setIsDialogOpen(false);
  };

  const handleEdit = (userId) => {
    navigate(`/editContact/${userId}`);
  };

  const openDialog = (userId) => {
    setUserToDelete(userId);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  if (!contactData || contactData.length === 0) {
    return <p>No contact information available.</p>;
  }

  const { user_id, name, office_room, phone_number, availability, email } =
    contactData[0];

  return (
    <div className={styles.contactInfoContainer}>
      <h2 className={styles.heading}>Contact Information</h2>
      <div className={styles.contactCard}>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Office Room:</strong> {office_room}
        </p>
        <p>
          <strong>
            <FaPhone className={styles.icon} /> Phone Number:
          </strong>{" "}
          {phone_number}
        </p>
        <p>
          <strong>
            <FaCalendar className={styles.icon} /> Availability:
          </strong>{" "}
          {availability}
        </p>
        {email && (
          <p>
            <strong>
              <FaEnvelope className={styles.icon} /> Email:
            </strong>{" "}
            {email}
          </p>
        )}
      </div>
      {(roleId === 3 || roleId === 4||roleId===5) && currentUserId === user_id && (
        <div className={styles.actionIcons}>
          <FaEdit
            className={styles.editIcon}
            onClick={() => handleEdit(user_id)}
          />
          <FaTrashAlt
            className={styles.deleteIcon}
            onClick={() => openDialog(user_id)}
          />
        </div>
      )}

      {isDialogOpen && (
        <div className={styles.overlay}>
          <div className={styles.dialog}>
            <h3>Are you sure you want to delete your contact information?</h3>
            <div className={styles.actions}>
              <button className={styles.confirm} onClick={handleDelete}>
                Yes
              </button>
              <button className={styles.cancel} onClick={closeDialog}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
