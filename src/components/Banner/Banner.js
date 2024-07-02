import React from 'react';
import styles from './Banner.module.css';
import Img from '../../assets/Artt.png';

const Banner = () => {
    return (
        <>
            <div className={styles.bannerContainer}>

                <div className={styles.circle}></div>
                <img src={Img} className={styles.img} alt="bannerImg" />
                <h1>Welcome aboard my friend</h1>
                <p>just a couple of clicks and we start</p>
            </div>
        </>
    );
};

export default Banner;