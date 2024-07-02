import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faLock,
    faEye,
    faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        email: '',
        Password: '',
    });
    const [error, setError] = useState(false);
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(faEyeSlash);

    const notify = () => {
        toast.success('Login Successfully ✅', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };

    const errorMessage = () => {
        toast.error('Invalid Credentials', {
            position: 'top-right',
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
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userDetails.email.length === 0 || userDetails.Password.length === 0) {
            setError(true);
        } else {
            try {
                const config = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(userDetails),
                };
                const data = await axios.post(
                    'https://pro-manage-backend-zeta.vercel.app//api/login',
                    userDetails,
                    config
                );
                console.log(data);
                if (data.data.jwttoken) {
                    localStorage.setItem('authToken', data.data.jwttoken);
                    localStorage.setItem('Name', data.data.Name);
                    localStorage.setItem('id', data.data.id);
                    notify();
                    navigate('/dashboard');
                } else {
                    setError(data.data.message);
                    errorMessage();
                }
            } catch (error) {
                console.log('something went wrong!');
                console.log(error);
                errorMessage();
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
            <div className={styles.loginContainer}>
                <h1 className={styles.Loginheaders}>Login</h1>
                <form className={styles.loginForm} onSubmit={handleSubmit}>
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
                            type={type}
                            placeholder="Password"
                            name="Password"
                            value={userDetails.Password}
                            onChange={handleChange}
                        />{' '}
                    </div>
                    <FontAwesomeIcon
                        icon={icon}
                        className={styles.ToggleIcon}
                        onClick={handleToggle}
                    />
                    {error && userDetails.Password.length === 0 ? (
                        <label className={styles.errormessage}>Password is Required</label>
                    ) : (
                        ' '
                    )}
                    <button type="submit" className={styles.submitbtn}>
                        Log In
                    </button>
                </form>
                <p className={styles.posttext}>Have no account yet?</p>
                <a href="/register" className={styles.Registerbtn}>
                    Register
                </a>
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;