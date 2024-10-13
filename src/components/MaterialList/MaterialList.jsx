import React, { useContext, useState, useEffect } from "react";
import { FaTrashAlt, FaBook } from "react-icons/fa";
import { axiosInstance } from "../../utility/Axios";
import * as timeago from "timeago.js";
import styles from "./MaterialList.module.css";
import { AuthContext } from "../Auth/Auth";
import { Spinner } from "react-bootstrap"; // Import Spinner from react-bootstrap

const MaterialList = ({ materials }) => {
  const { userInfo } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [materialList, setMaterialList] = useState(materials);
  const [loading, setLoading] = useState(false); // State for loading spinner
  const roleId = userInfo.role_id;

  // Ensure materialList is updated if materials prop changes
  useEffect(() => {
    setMaterialList(materials);
  }, [materials]);

  const openModal = (material) => {
    setIsModalOpen(true);
    setMaterialToDelete(material);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMaterialToDelete(null);
  };

  const handleDelete = async () => {
    const { material_id, title } = materialToDelete;
    const token = localStorage.getItem("authToken");
    setLoading(true); // Start loading

    try {
      const response = await axiosInstance.delete(`/api/deleteFile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          materialId: material_id,
          fileKey: title,
        },
      });

      if (response.status === 200) {
        // Update local materialList after deletion
        setMaterialList((prevMaterials) =>
          prevMaterials.filter(
            (material) => material.material_id !== material_id
          )
        );
        closeModal();
      } else {
        alert("Error deleting material");
      }
    } catch (error) {
      alert("Network error or failed request");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {materialList && materialList.length > 0 ? (
          materialList.map((material) => (
            <li key={material.material_id} className={styles.listItem}>
              <div className={styles.materialItem}>
                <FaBook className={styles.bookIcon} />
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {material.title}
                </a>
                <div className={styles.description}>
                  <p>Uploaded by: {material.uploaded_by}</p>
                  <p>Created: {timeago.format(material.created_at)}</p>
                  <p>Last Updated: {timeago.format(material.updated_at)}</p>
                </div>

                {(roleId === 1 ||
                  roleId === 3 ||
                  roleId === 4 ||
                  roleId === 5) && (
                  <div className={styles.actionIcons}>
                    <FaTrashAlt
                      className={styles.deleteIcon}
                      onClick={() => openModal(material)}
                    />
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No materials available for this course.</p>
        )}
      </ul>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>Are you sure you want to delete this material?</p>
            <div className={styles.modalActions}>
              <button
                onClick={handleDelete}
                className={styles.confirmButton}
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Deleting...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
              <button onClick={closeModal} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialList;
