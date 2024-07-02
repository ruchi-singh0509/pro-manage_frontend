import React, { useState } from 'react';
import styles from './SettingsComponent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLock,
    faUser,
    faEye,
    faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
    const [userDetails, setUserDetails] = useState({
        Name: '',
        oldPassword: '',
        newPassword: '',
    });
    const [error, setError] = useState(false);
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(faEyeSlash);

    const notify = () => {
        toast('Password Updated Successfully ✅', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            userDetails.Name.length === 0 ||
            userDetails.oldPassword.length === 0 ||
            userDetails.newPassword.length === 0
        ) {
            setError(true);
        } else {
            try {
                const config = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(userDetails),
                };
                const data = axios.put(
                    'https://pro-manage-backend-zeta.vercel.app/api/update-password',
                    userDetails,
                    config
                );
                console.log(data);

                if (data) {
                    console.log('Password Updated Successfully');
                    notify();
                } else {
                    setError(data.data.message);
                }
            } catch (err) {
                console.log('Something went wrong!');
                console.log(err);
            }
        }
    };
    const handleToggle = () => {
        if (type !== 'password') {
            setIcon(faEyeSlash);
            setType('password');
        } else {
            setIcon(faEye);
            setType('text');
        }
    };

    return (
        <>
            <div className={styles.SettingContainer}>
                <h3>Settings</h3>
                <form className={styles.SettingsForm} onSubmit={handleSubmit}>
                    <div className={styles.userInput}>
                        <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                        <input
                            type="text"
                            placeholder="Name"
                            name="Name"
                            value={userDetails.Name}
                            onChange={handleChange}
                        />
                    </div>
                    {error && userDetails.Name.length === 0 ? (
                        <label className={styles.errormessage}>Name is Required</label>
                    ) : (
                        ' '
                    )}
                    <div className={styles.userInput}>
                        <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />

                        <input
                            type={type}
                            placeholder="OldPassword"
                            name="oldPassword"
                            value={userDetails.oldPassword}
                            onChange={handleChange}
                        />
                        <FontAwesomeIcon
                            icon={icon}
                            className={styles.ToggleIcon}
                            onClick={handleToggle}
                        />
                    </div>
                    {error && userDetails.oldPassword.length === 0 ? (
                        <label className={styles.errormessage}>
                            oldPassword is Required
                        </label>
                    ) : (
                        ' '
                    )}
                    <div className={styles.userInput}>
                        <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />

                        <input
                            type={type}
                            placeholder="NewPassword"
                            name="newPassword"
                            value={userDetails.newPassword}
                            onChange={handleChange}
                        />
                        <FontAwesomeIcon
                            icon={icon}
                            className={styles.ToggleIcon}
                            onClick={handleToggle}
                        />
                    </div>
                    {error && userDetails.newPassword.length === 0 ? (
                        <label className={styles.errormessage}>
                            NewPassword is Required
                        </label>
                    ) : (
                        ' '
                    )}
                    <button type="submit" className={styles.SettingsButton}>
                        Update
                    </button>
                    <ToastContainer />
                </form>
            </div>
        </>
    );
};

export default Settings;