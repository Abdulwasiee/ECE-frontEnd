import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useNavigate for redirection
import { axiosInstance } from "../../utility/Axios";
import MaterialList from "../../components/MaterialList/MaterialList";
import styles from "./MaterialPage.module.css";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../components/Auth/Auth";

const MaterialPage = () => {
  const { courseId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState(null);

  const { userInfo } = useContext(AuthContext);
  const roleId = userInfo?.role_id;
  const navigate = useNavigate(); // For redirecting to post-material page

  useEffect(() => {
    const fetchMaterials = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axiosInstance.get(`/api/materials/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response.status === 200) {
          if (response.data.data.result.length === 0) {
            setError(response.data.data.result.message);
            setMaterials([]); // Ensure the materials state is cleared
          } else {
            setMaterials(response.data.data.result);
            setError(null); // Clear any previous error messages
          }
        } else {
          setError(response.data.data.result.message);
        }
      } catch (error) {
        setError("Error fetching materials");
        console.error(
          "Error fetching materials:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchMaterials();
  }, [courseId]);

  // Handle button click to redirect to post material page
  const handlePostMaterial = () => {
    navigate(`/postMaterial/${courseId}`);
  };

  return (
    <Layout>
      {/* Conditionally render "Post Material" button for Admin, Staff, and Representative */}
      {(roleId === 1 || roleId === 3 || roleId === 5) && (
        <div className={styles.postButtonContainer}>
          <button className={styles.postButton} onClick={handlePostMaterial}>
            Post Material
          </button>
        </div>
      )}
      <div className={styles.container}>
        <h1 className={styles.title}>Course Materials</h1>
        <MaterialList materials={materials} roleId={roleId} />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </Layout>
  );
};

export default MaterialPage;
