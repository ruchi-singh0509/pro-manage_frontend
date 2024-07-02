import React from 'react';
import styles from './LogoutModal.module.css';
import { useNavigate } from 'react-router-dom';

function Modal({ closeModal }) {
    const nav = useNavigate();

    const logout = (e) => {
        localStorage.removeItem('authtoken');
        localStorage.removeItem('Name');
        nav('/login');
    };
    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <div className={styles.title}>
                    <h1>Are You Sure You Want to Logout</h1>
                </div>
                <div className={styles.footer}>
                    <button onClick={logout} className={styles.logoutButton}>
                        Yes, Logout
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
}

export default Modal;