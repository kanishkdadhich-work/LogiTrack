import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Edit2, Power, XCircle, Check, X as XIcon, Mail, Shield, Smartphone } from 'lucide-react';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'MANAGER',
        email: '',
        fullName: '',
        phoneNumber: '',
        active: true
    });
    const [showForm, setShowForm] = useState(false);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            alert("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            if (editingId) {
                await axios.put(
                    `http://localhost:8080/api/admin/users/${editingId}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("✅ User updated successfully!");
            } else {
                await axios.post('http://localhost:8080/api/admin/users', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("✅ User created successfully!");
            }
            resetForm();
            fetchUsers();
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.message || "Operation failed"));
        }
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        setFormData({
            username: user.username,
            password: '',
            role: user.role,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            active: user.active
        });
        setShowForm(true);
    };

    const toggleStatus = async (user) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:8080/api/admin/users/${user.id}/status`,
                { active: !user.active },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (err) {
            alert("❌ Error updating user status");
        }
    };

    const handleDelete = async (id, username) => {
        if (window.confirm(`Are you sure you want to delete user '${username}'?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchUsers();
            } catch (err) {
                alert("❌ Error deleting user");
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            username: '',
            password: '',
            role: 'MANAGER',
            email: '',
            fullName: '',
            phoneNumber: '',
            active: true
        });
        setShowForm(false);
    };

    return (
        <div>
            <div style={headerStyle}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0 }}>User Management</h2>
                    <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Create, edit, and manage system users</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={showForm ? closeBtnStyle : addBtnStyle}
                >
                    {showForm ? <><XIcon size={18} style={{ marginRight: '8px' }} /> Close</> : <><UserPlus size={18} style={{ marginRight: '8px' }} /> New User</>}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div style={formContainerStyle}>
                    <h3 style={{ color: '#0f172a' }}>{editingId ? 'Edit User' : 'Create New User'}</h3>
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={formRowStyle}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Username *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Enter username"
                                    required
                                    style={inputStyle}
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Enter full name"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={formRowStyle}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter email"
                                    style={inputStyle}
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="Enter phone number"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={formRowStyle}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    style={selectStyle}
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="DRIVER">Driver</option>
                                </select>
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Password {editingId ? '(leave blank to keep current)' : '*'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter password"
                                    required={!editingId}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={formButtonGroupStyle}>
                            <button type="submit" style={submitBtnStyle}>
                                <Check size={18} style={{ marginRight: '8px' }} />
                                {editingId ? 'Update User' : 'Create User'}
                            </button>
                            <button type="button" onClick={resetForm} style={cancelBtnStyle}>
                                <XIcon size={18} style={{ marginRight: '8px' }} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                    <thead style={theadStyle}>
                        <tr>
                            <th style={thStyle}>Username</th>
                            <th style={thStyle}>Full Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Role</th>
                            <th style={thStyle}>Phone</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={trStyle}>
                                <td style={tdStyle}><strong>{user.username}</strong></td>
                                <td style={tdStyle}>{user.fullName || '-'}</td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Mail size={16} color="#666" />
                                        {user.email || '-'}
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <span style={{ ...roleBadgeStyle(user.role) }}>
                                        <Shield size={14} style={{ marginRight: '4px' }} />
                                        {user.role}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Smartphone size={16} color="#666" />
                                        {user.phoneNumber || '-'}
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <span style={user.active ? statusActiveBadge : statusInactiveBadge}>
                                        {user.active ? '✓ Active' : '✗ Inactive'}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={actionButtonsStyle}>
                                        <button
                                            onClick={() => handleEdit(user)}
                                            title="Edit"
                                            style={actionBtn}
                                        >
                                            <Edit2 size={16} color="#2563eb" />
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(user)}
                                            title={user.active ? 'Deactivate' : 'Activate'}
                                            style={actionBtn}
                                        >
                                            <Power size={16} color={user.active ? '#f59e0b' : '#10b981'} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id, user.username)}
                                            title="Delete"
                                            style={deleteActionBtn}
                                        >
                                            <XCircle size={16} color="#ef4444" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Styles
const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e2e8f0'
};

const addBtnStyle = {
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center'
};

const closeBtnStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center'
};

const formContainerStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
};

const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
};

const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column'
};

const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: '6px'
};

const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit'
};

const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit'
};

const formButtonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '12px'
};

const submitBtnStyle = {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center'
};

const cancelBtnStyle = {
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center'
};

const tableWrapperStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const theadStyle = {
    backgroundColor: '#f8fafc'
};

const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    borderBottom: '1px solid #e2e8f0'
};

const trStyle = {
    borderBottom: '1px solid #f1f5f9'
};

const tdStyle = {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#1e293b'
};

const roleBadgeStyle = (role) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: role === 'ADMIN' ? '#fecaca' : role === 'MANAGER' ? '#bfdbfe' : '#c6f6d5',
    color: role === 'ADMIN' ? '#991b1b' : role === 'MANAGER' ? '#1e40af' : '#065f46'
});

const statusActiveBadge = {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#d1fae5',
    color: '#065f46'
};

const statusInactiveBadge = {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#fee2e2',
    color: '#991b1b'
};

const actionButtonsStyle = {
    display: 'flex',
    gap: '8px'
};

const actionBtn = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
};

const deleteActionBtn = {
    ...actionBtn,
    backgroundColor: '#fee2e2'
};

export default UserManagementPage;
