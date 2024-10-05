import React, { useContext, useState, useEffect } from "react";
import { axiosInstance } from "../../utility/Axios";
import contactStyles from "./PostContact.module.css";
import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/Auth/Auth";
import Encryptor from "./../../components/Protection/Encryptor";

const PostContactInfo = () => {
  const { userInfo } = useContext(AuthContext);
  const user_id = Encryptor.encrypt(userInfo.user_id);
  const [officeRoom, setOfficeRoom] = useState(""); // Default value for office room
  const [phoneNumber, setPhoneNumber] = useState("");
  const [availability, setAvailability] = useState(""); // Default value for availability
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Effect to set default values for role_id 5
  useEffect(() => {
    if (userInfo.role_id === 5) {
      setOfficeRoom(null); // Set office room to null
      setAvailability(null); // Set availability to null
    }
  }, [userInfo.role_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        "/api/addContact",
        {
          office_room: userInfo.role_id === 5 ? null : officeRoom, 
          phone_number: phoneNumber,
          availability: userInfo.role_id === 5 ? null : availability, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.result.success) {
        setSuccess(response.data.result.message);
        setOfficeRoom("");
        setPhoneNumber("");
        setAvailability("");
        setError("");

        setTimeout(() => {
          navigate(`/contact/${user_id}`);
          setSuccess("");
        }, 2000);
      } else {
        setError(response.data.result.message);
        setSuccess("");
      }
    } catch (err) {
      setError(
        err.response?.data?.result.message ||
          "Error adding contact information."
      );
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className={contactStyles.container}>
        <h1 className={contactStyles.heading}>Post Contact Information</h1>
        {error && <p className={contactStyles.error}>{error}</p>}
        {success && <p className={contactStyles.success}>{success}</p>}
        <form onSubmit={handleSubmit} className={contactStyles.form}>
          {userInfo.role_id !== 5 && ( // Render office room and availability inputs for roles other than 5
            <>
              <div className={contactStyles.formGroup}>
                <label className={contactStyles.label} htmlFor="officeRoom">
                  Office Room
                </label>
                <input
                  type="text"
                  id="officeRoom"
                  className={contactStyles.input}
                  value={officeRoom}
                  placeholder="Enter office room number"
                  onChange={(e) => setOfficeRoom(e.target.value)}
                  required
                />
              </div>
              <div className={contactStyles.formGroup}>
                <label className={contactStyles.label} htmlFor="availability">
                  Availability
                </label>
                <input
                  type="text"
                  id="availability"
                  className={contactStyles.input}
                  value={availability}
                  placeholder="e.g., Available from 9 AM to 5 PM"
                  onChange={(e) => setAvailability(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className={contactStyles.formGroup}>
            <label className={contactStyles.label} htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className={contactStyles.input}
              value={phoneNumber}
              placeholder="Enter phone number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={contactStyles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={contactStyles.spinner}></span> // Spinner element
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default PostContactInfo;
