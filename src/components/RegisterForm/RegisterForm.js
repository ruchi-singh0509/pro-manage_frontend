import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import {
    faEnvelope,
    faLock,
    faUser,
    faEye,
    faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registerform = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        Name: '',
        email: '',
        Password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(false);
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(faEyeSlash);
    const notify = () => {
        toast('Register Successfully ✅', {
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
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
        if (name === 'confirmPassword') {
            if (userDetails.confirmPassword !== userDetails.Password) {
                setError('Passwords do not match');
                return;
            } else {
                setError(true);
            }
        } else {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            userDetails.Name.length === 0 ||
            userDetails.email.length === 0 ||
            userDetails.Password.length === 0 ||
            userDetails.confirmPassword.length === 0
        ) {
            setError(true);
        } else {
            try {
                if (userDetails.confirmPassword !== userDetails.Password) {
                    setError(true);
                    console.log(userDetails.confirmPassword);
                } else {
                    const config = {
                        method: 'POST',
                        headers: {
                            'Context-Type': 'application/json',
                        },
                    };

                    const data = await axios.post(
                        'https://pro-manage-backend-zeta.vercel.app/api/signup',
                        userDetails,
                        config
                    );
                    console.log(data);
                    localStorage.setItem('authtoken', JSON.stringify(data.data.jwttoken));
                    localStorage.setItem('Name', JSON.stringify(data.data.Name));
                    console.log('User created successfully');
                    navigate('/login');
                    notify();
                }
            } catch (error) {
                console.log('something went wrong!');
                console.log(error);
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
            <div className={styles.RegisterContainer}>
                <h1 className={styles.RegisterHeader}>Register</h1>
                <form className={styles.RegisterForm} onSubmit={handleSubmit}>
                    <div className={styles.userInput}>
                        <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                        <input
                            className={styles.nameInput}
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
                        <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                        <input
                            className={styles.nameInput}
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={userDetails.email}
                            onChange={handleChange}
                        />
                    </div>
                    {error && userDetails.email.length === 0 ? (
                        <label className={styles.errormessage}>Email is Required</label>
                    ) : (
                        ' '
                    )}
                    <div className={styles.userInput}>
                        <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                        <input
                            className={styles.nameInput}
                            type={type}
                            placeholder="Password"
                            name="Password"
                            value={userDetails.Password}
                            onChange={handleChange}
                        />
                        <FontAwesomeIcon
                            icon={icon}
                            className={styles.ToggleIcon}
                            onClick={handleToggle}
                        />
                    </div>
                    {error && userDetails.Password.length === 0 ? (
                        <label className={styles.errormessage}>Password is Required</label>
                    ) : (
                        ' '
                    )}
                    <div className={styles.userInput}>
                        <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                        <input
                            className={styles.nameInput}
                            type={type}
                            placeholder="ConfirmPassword"
                            name="confirmPassword"
                            value={userDetails.confirmPassword}
                            onChange={handleChange}
                        />
                        <FontAwesomeIcon
                            icon={icon}
                            className={styles.ToggleIcon}
                            onClick={handleToggle}
                        />
                    </div>

                    {error && userDetails.confirmPassword.length === 0 ? (
                        <label className={styles.errormessage}>
                            ConfirmPassword is Required
                        </label>
                    ) : userDetails.confirmPassword !== userDetails.Password ? (
                        <label className={styles.errormessage}>Password do not match</label>
                    ) : (
                        ''
                    )}
                    <button type="submit" className={styles.submitbtn}>
                        Register
                    </button>
                </form>
                <p className={styles.posttext}>Have an Account?</p>
                <a href="/login" className={styles.Loginbtn}>
                    Login
                </a>
            </div>
            <ToastContainer />
        </>
    );
};

export default Registerform;