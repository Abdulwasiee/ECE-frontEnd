import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/Auth";
import { axiosInstance } from "../../utility/Axios";
import registerStyles from "./Register.module.css";
import Layout from "./../Layout/Layout";

const Register = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    id_number: "",
    batch_id: "",
    semester: "", // For conditional semester selection
    stream_id: "", // For stream selection
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "batch_id" && { semester: "", stream_id: "" }), // Reset semester and stream when batch changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      id_number: formData.id_number,
      batch_id: formData.batch_id,
    };

    if (formData.semester) {
      dataToSend.semester = formData.semester;
    }
    if (formData.stream_id) {
      dataToSend.stream_id = formData.stream_id;
    }

    try {
      const response = await axiosInstance.post(
        "/api/student/register",
        dataToSend
      );
      localStorage.removeItem("authToken");
      await login(response.data.token);
      setMessage(response.data.message);
      setError("");
      setFormData({
        first_name: "",
        last_name: "",
        id_number: "",
        batch_id: "",
        semester: "",
        stream_id: "",
      }); // Reset form
      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (error) {
      setError(
        error.response?.data?.message || "An unexpected error occurred."
      );
      setMessage("");
    }
  };

  return (
    <Layout>
      <div className={registerStyles.registerContainer}>
        <h2 className={registerStyles.registerTitle}>Register</h2>
        <form onSubmit={handleSubmit} className={registerStyles.registerForm}>
          <div className={registerStyles.formInput}>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="First name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={registerStyles.formInput}>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Last name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={registerStyles.formInput}>
            <input
              type="text"
              id="id_number"
              name="id_number"
              placeholder="ID Number"
              value={formData.id_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className={registerStyles.formInput}>
            <select
              id="batch_id"
              name="batch_id"
              value={formData.batch_id}
              onChange={handleChange}
              required
            >
              <option value="">Select batch</option>
              <option value="1">2nd Year</option>
              <option value="2">3rd Year</option>
              <option value="3">4th Year</option>
              <option value="4">5th Year</option>
            </select>
          </div>
          {formData.batch_id === "3" && (
            <>
              <div className={registerStyles.formInput}>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select semester</option>
                  <option value="1">First Semester</option>
                  <option value="2">Second Semester</option>
                </select>
              </div>
              {formData.semester === "2" && (
                <div className={registerStyles.formInput}>
                  <select
                    id="stream_id"
                    name="stream_id"
                    value={formData.stream_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select stream</option>
                    <option value="1">Computer</option>
                    <option value="2">Communication</option>
                    <option value="3">Control</option>
                    <option value="4">Power</option>
                  </select>
                </div>
              )}
            </>
          )}
          {formData.batch_id === "4" && (
            <div className={registerStyles.formInput}>
              <select
                id="stream_id"
                name="stream_id"
                value={formData.stream_id}
                onChange={handleChange}
                required
              >
                <option value="">Select stream</option>
                <option value="1">Computer</option>
                <option value="2">Communication</option>
                <option value="3">Power</option>
                <option value="4">Control</option>
              </select>
            </div>
          )}
          <button type="submit" className={registerStyles.registerButton}>
            Register
          </button>
          {error && <p className={registerStyles.errorMessage}>{error}</p>}
          {message && (
            <p className={registerStyles.successMessage}>{message}</p>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default Register;
