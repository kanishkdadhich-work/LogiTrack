import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import { User, Mail, Smartphone, Lock, Check, AlertCircle } from 'lucide-react';

const ProfileSettingsPage = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const updateData = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber
            };

            await axios.put(
                `http://localhost:8080/api/users/profile`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage('✅ Profile updated successfully!');
        } catch (err) {
            setError('❌ ' + (err.response?.data?.message || 'Failed to update profile'));
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('❌ New passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('❌ Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:8080/api/users/change-password`,
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage('✅ Password changed successfully!');
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (err) {
            setError('❌ ' + (err.response?.data?.message || 'Failed to change password'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={headerStyle}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0 }}>Profile Settings</h2>
                    <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage your account information</p>
                </div>
            </div>

            <div style={containerStyle}>
                {/* User Info Card */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <User size={24} color="#2563eb" style={{ marginRight: '12px' }} />
                        <div>
                            <h3 style={{ margin: 0, color: '#0f172a' }}>User Information</h3>
                            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
                                Username: <strong>{user?.username}</strong> | Role: <strong>{user?.role}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alert Messages */}
                {message && (
                    <div style={successAlertStyle}>
                        <Check size={20} style={{ marginRight: '12px' }} />
                        {message}
                    </div>
                )}
                {error && (
                    <div style={errorAlertStyle}>
                        <AlertCircle size={20} style={{ marginRight: '12px' }} />
                        {error}
                    </div>
                )}

                {/* Update Profile Form */}
                <div style={formCardStyle}>
                    <h3 style={{ color: '#0f172a', marginTop: 0 }}>Update Personal Information</h3>
                    <form onSubmit={handleUpdateProfile}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                style={inputStyle}
                            />
                        </div>

                        <div style={formGridStyle}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>
                                    <Mail size={16} style={{ marginRight: '8px', display: 'inline' }} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    style={inputStyle}
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>
                                    <Smartphone size={16} style={{ marginRight: '8px', display: 'inline' }} />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <button type="submit" style={primaryBtnStyle} disabled={loading}>
                            {loading ? 'Updating...' : '💾 Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Change Password Form */}
                <div style={formCardStyle}>
                    <h3 style={{ color: '#0f172a', marginTop: 0 }}>
                        <Lock size={20} style={{ marginRight: '12px', display: 'inline' }} />
                        Change Password
                    </h3>
                    <form onSubmit={handleChangePassword}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Current Password *</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                placeholder="Enter your current password"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>New Password *</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                placeholder="Enter new password (min 6 characters)"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Confirm New Password *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm new password"
                                required
                                style={inputStyle}
                            />
                            {formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                                <span style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>✓ Passwords match</span>
                            )}
                            {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>✗ Passwords do not match</span>
                            )}
                        </div>

                        <button type="submit" style={primaryBtnStyle} disabled={loading}>
                            {loading ? 'Changing...' : '🔐 Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Styles
const headerStyle = {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e2e8f0'
};

const containerStyle = {
    display: 'grid',
    gap: '24px',
    maxWidth: '900px'
};

const cardStyle = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center'
};

const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
};

const formCardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px'
};

const formGroupStyle = {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column'
};

const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
};

const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center'
};

const inputStyle = {
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
};

const primaryBtnStyle = {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '12px',
    transition: 'background-color 0.3s'
};

const successAlertStyle = {
    backgroundColor: '#d1fae5',
    border: '1px solid #6ee7b7',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px'
};

const errorAlertStyle = {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px'
};

export default ProfileSettingsPage;
