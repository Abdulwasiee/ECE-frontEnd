import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlus, FaTimes } from "react-icons/fa";
import { axiosInstance } from "../../utility/Axios";
import MaterialList from "../../components/MaterialList/MaterialList";
import styles from "./MaterialPage.module.css";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../components/Auth/Auth";

const MaterialPage = () => {
  const { encryptedId } = useParams();

  const [materials, setMaterials] = useState([]);
  const [showPostButton, setShowPostButton] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useContext(AuthContext);
  const roleId = userInfo?.role_id;
  const navigate = useNavigate();

  const togglePostButton = () => {
    setShowPostButton(!showPostButton);
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      const token = localStorage.getItem("authToken");
      try {
        console.log(encryptedId);
        const response = await axiosInstance.get(
          `/api/materials/${encryptedId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.data.result.length === 0) {
            setError(response.data.data.result.message);
            setMaterials([]);
          } else {
            setMaterials(response.data.data.result);
            setError(null);
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
  }, [encryptedId]);

  const handlePostMaterial = () => {
    navigate(`/postMaterial/${encryptedId}`);
  };

  return (
    <Layout>
      {(roleId === 1 || roleId === 3 || roleId === 5 || roleId === 4) && (
        <div className={styles.postButtonContainer}>
          <div className={styles.iconContainer} onClick={togglePostButton}>
            {showPostButton ? (
              <FaTimes className={styles.icon} />
            ) : (
              <FaPlus className={styles.icon} />
            )}
          </div>

          <div
            className={`${styles.postButtonWrapper} ${
              showPostButton ? styles.show : styles.hide
            }`}
          >
            <button className={styles.postButton} onClick={handlePostMaterial}>
              Post Material
            </button>
          </div>
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
