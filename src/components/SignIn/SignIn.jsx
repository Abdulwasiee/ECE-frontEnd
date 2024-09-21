import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/Auth";
import { axiosInstance } from "../../utility/Axios";
import signinStyles from "./SignIn.module.css";
import Layout from "../Layout/Layout";

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    id_number: "",
    first_name: "",
  });
  const [isStudent, setIsStudent] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = isStudent
      ? { id_number: formData.id_number, first_name: formData.first_name }
      : { email: formData.email, password: formData.password };

    const endpoint = isStudent ? "/api/student/login" : "/api/user/login";

    try {
      const response = await axiosInstance.post(endpoint, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        if (response.data.response.token) {
          await login(response.data.response.token);
          setMessage(response.data.response.message);
          setError("");
          setFormData({
            email: "",
            password: "",
            id_number: "",
            first_name: "",
          });
          navigate("/");
        } else {
          setError("Token not received.");
        }
      } else {
        setError(response.data.response.message);
        setMessage("");
      }
    } catch (error) {
      setError("Error during login. Please try again.");
      setMessage("");
    }
  };

  return (
    <Layout>
      <div className={signinStyles.signinContainer}>
        <h2 className={signinStyles.signinHeader}>
          {isStudent ? "Student Login" : "Admin Login"}
        </h2>
        <form onSubmit={handleSubmit} className={signinStyles.signinForm}>
          {isStudent ? (
            <>
              <div className={signinStyles.formInput}>
                <input
                  type="text"
                  id="id_number"
                  name="id_number"
                  placeholder="Enter your ID number"
                  value={formData.id_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={signinStyles.formInput}>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className={signinStyles.formInput}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div
                className={`${signinStyles.formInput} ${signinStyles.passwordInput}`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className={signinStyles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </>
          )}
          <button type="submit" className={signinStyles.signinButton}>
            Sign In
          </button>
          {error && <p className={signinStyles.errorMessage}>{error}</p>}
          {message && <p className={signinStyles.successMessage}>{message}</p>}
        </form>
        <div className={signinStyles.toggleForm}>
          <p>
            {isStudent ? "Do you have a role?" : "Are you a student?"}
            <button onClick={() => setIsStudent(!isStudent)}>
              {isStudent ? "Switch to Admin Login" : "Switch to Student Login"}
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
