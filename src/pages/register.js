import React from 'react';
import Banner from '../components/Banner/Banner';
import Registerform from '../components/RegisterForm/RegisterForm';

const register = () => {
    return (
        <>
            <div style={{ display: 'flex' }}>
                <Banner />
                <Registerform />
            </div>
        </>
    );
};

export default register;