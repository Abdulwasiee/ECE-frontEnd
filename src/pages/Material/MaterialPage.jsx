import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
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

  useEffect(() => {
    const fetchMaterials = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axiosInstance.get(`/api/materials/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
console.log(response)
        if (response.status==200) {
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

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Course Materials</h1>
        <MaterialList materials={materials} roleId={roleId} />{" "}
        {/* Pass roleId */}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </Layout>
  );
};

export default MaterialPage;
