import React, { useContext, useState } from "react";
import { FaEdit, FaTrashAlt, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/Axios";
import * as timeago from "timeago.js";
import styles from "./MaterialList.module.css";
import { AuthContext } from "../Auth/Auth";

const MaterialList = ({ materials }) => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const roleId = userInfo.role_id;

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
        closeModal();
        window.location.reload();
      } else {
        alert("Error deleting material");
      }
    } catch (error) {
      alert("Network error or failed request");
    }
  };

  const handleEdit = (materialId) => {
    navigate(`/editMaterial/${materialId}`);
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {materials.length > 0 ? (
          materials.map((material) => (
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

                {(roleId === 1 || roleId === 3 || roleId === 5) && (
                  <div className={styles.actionIcons}>
                    <FaEdit
                      className={styles.editIcon}
                      onClick={() => handleEdit(material.material_id)}
                    />
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
              <button onClick={handleDelete} className={styles.confirmButton}>
                Confirm
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
