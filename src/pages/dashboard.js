import React from 'react';
import Dashboard from '../components/DashBoard/DashBoard';
import SideNav from '../components/SideNav/SideNav';

const dashboard = () => {
    return (
        <div style={{ display: 'flex' }}>
            <SideNav />
            <Dashboard />
        </div>
    );
};

export default dashboard;