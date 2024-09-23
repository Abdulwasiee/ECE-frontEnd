import React, { useState } from "react";
import { axiosInstance } from "../../utility/Axios";
import contactStyles from "./PostContact.module.css";
import Layout from "../../components/Layout/Layout";

const PostContactInfo = () => {
  const [officeRoom, setOfficeRoom] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [availability, setAvailability] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    try {
      const response = await axiosInstance.post(
        "/api/addContact",
        {
          office_room: officeRoom,
          phone_number: phoneNumber,
          availability: availability,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.result.status) {
        setSuccess(response.data.result.message);
        setOfficeRoom("");
        setPhoneNumber("");
        setAvailability("");
        setEmail("");
        setError("");
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        setError(response.data.result.message);
        setSuccess("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error adding contact information."
      );
      setSuccess("");
    }
  };

  return (
    <Layout>
      <div className={contactStyles.container}>
        <h1 className={contactStyles.heading}>Post Contact Information</h1>
        {error && <p className={contactStyles.error}>{error}</p>}
        {success && <p className={contactStyles.success}>{success}</p>}
        <form onSubmit={handleSubmit} className={contactStyles.form}>
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
          <div className={contactStyles.formGroup}>
            <label className={contactStyles.label} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={contactStyles.input}
              value={email}
              placeholder="Enter email address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={contactStyles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default PostContactInfo;
