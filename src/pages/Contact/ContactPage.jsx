import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import ContactInfo from "../../components/ContactInfo/ContactInfo";
import Layout from "../../components/Layout/Layout";
import styles from "./ContactPage.module.css";
import { AuthContext } from "../../components/Auth/Auth";

const ContactPage = () => {
  const { userId } = useParams();
  const { userInfo } = useContext(AuthContext);
  const { user_id, role_id } = userInfo;
  const [contactData, setContactData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContactInfo = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axiosInstance.get(`/api/getContact/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response?.data?.result?.contactRows;
        if (data?.length === 0) {
          setContactData([]);
        } else {
          setContactData(data);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching contact information"
        );
      }
    };

    fetchContactInfo();
  }, [userId]);

  const handleAddContact = () => {
    navigate("/addContact");
  };

  return (
    <Layout>
      <div className={styles.contactPageContainer}>
        {error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : contactData === null ? (
          <p className={styles.loadingMessage}>Loading...</p>
        ) : contactData.length === 0 &&
          (role_id === 3 ||
            role_id == 5 ||
            (role_id === 4 && userId === user_id.toString())) ? (
          <div className={styles.addContactSection}>
            <p>No contact information found.</p>
            <button
              className={styles.addContactButton}
              onClick={handleAddContact}
            >
              Add Contact Information
            </button>
          </div>
        ) : (
          <div className={styles.contactCard}>
            <div className={styles.contactDetails}>
              <ContactInfo
                contactData={contactData}
                roleId={role_id}
                userId={user_id}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ContactPage;
