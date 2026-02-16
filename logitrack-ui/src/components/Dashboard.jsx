import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Package, Users, User as UserIcon, LogOut } from 'lucide-react';
import ShipmentsPage from './pages/ShipmentsPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import ProfileSettingsPage from './pages/ProfileSettingsPage.jsx';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout, isAdmin } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('shipments');
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const tabs = [
        {
            id: 'shipments',
            label: 'Shipments',
            icon: Package,
            allowedRoles: ['ADMIN', 'MANAGER', 'DRIVER']
        },
        {
            id: 'users',
            label: 'User Management',
            icon: Users,
            allowedRoles: ['ADMIN']
        },
        {
            id: 'profile',
            label: 'Profile Settings',
            icon: UserIcon,
            allowedRoles: ['ADMIN', 'MANAGER', 'DRIVER']
        }
    ];

    // Filter tabs based on role
    const visibleTabs = tabs.filter(tab => tab.allowedRoles.includes(user?.role));

    return (
        <div style={dashboardContainer}>
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: 0 }}>LogiTrack Dashboard</h1>
                    <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>
                        Welcome, <strong>{user?.username}</strong> ({user?.role})
                    </p>
                </div>
                <button onClick={handleLogout} style={logoutBtnStyle}>
                    <LogOut size={18} style={{ marginRight: '8px' }} />
                    Logout
                </button>
            </div>

            {/* Tab Navigation */}
            <div style={tabNavStyle}>
                {visibleTabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                ...tabButtonStyle,
                                ...(activeTab === tab.id ? tabButtonActiveStyle : {})
                            }}
                        >
                            <Icon size={20} style={{ marginRight: '8px' }} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div style={contentStyle}>
                {activeTab === 'shipments' && <ShipmentsPage />}
                {activeTab === 'users' && isAdmin && <UserManagementPage />}
                {activeTab === 'profile' && <ProfileSettingsPage />}
            </div>
        </div>
    );
};

const dashboardContainer = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '0'
};

const headerStyle = {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const logoutBtnStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s'
};

const tabNavStyle = {
    backgroundColor: '#ffffff',
    borderBottom: '2px solid #e2e8f0',
    display: 'flex',
    gap: '0',
    padding: '0 24px',
    overflowX: 'auto'
};

const tabButtonStyle = {
    padding: '16px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#64748b',
    borderBottom: '3px solid transparent',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap'
};

const tabButtonActiveStyle = {
    color: '#2563eb',
    borderBottomColor: '#2563eb'
};

const contentStyle = {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
};

export default Dashboard;
