import React from 'react';
import styles from './DeleteModal.module.css';
import axios from 'axios';

const DeleteModal = ({ closeModal, taskId }) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
    };
    const handleDelete = async () => {
        try {
            await axios
                .delete(
                    `https://pro-manage-backend-zeta.vercel.app/api/delete-task/${taskId}`,
                    config
                )
                .then((response) => {
                    console.log('task deleted successfully');
                    console.log(response.data);
                });
            closeModal(false);
            window.location.reload();
        } catch (error) {
            console.error('An error occurred while deleting the task:', error);
        }
    };
    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <div className={styles.title}>
                    <h1>Are you sure you want to Delete?</h1>
                </div>
                <div className={styles.footer}>
                    <button className={styles.logoutButton} onClick={handleDelete}>
                        Yes, Delete
                    </button>

                    <button
                        onClick={() => {
                            closeModal(false);
                        }}
                        id={styles.cancelBtn}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;