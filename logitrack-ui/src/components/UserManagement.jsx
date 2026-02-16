import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Users, Mail, Shield, Smartphone, Edit2, Power, XCircle } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null); // Tracks if we are updating
    const [formData, setFormData] = useState({
        username: '', password: '', role: 'MANAGER', email: '', fullName: '', phoneNumber: '', active: true
    });

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // --- Actions ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // UPDATE
                await axios.put(`http://localhost:8080/api/admin/users/${editingId}`, formData);
                alert("✅ User updated successfully!");
            } else {
                // CREATE
                await axios.post('http://localhost:8080/api/admin/users', formData);
                alert("✅ User created successfully!");
            }
            resetForm();
            fetchUsers();
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.message || "Operation failed"));
        }
    };

    const toggleStatus = async (user) => {
        try {
            // Toggles the active boolean
            await axios.patch(`http://localhost:8080/api/admin/users/${user.id}/status`, {
                active: !user.active
            });
            fetchUsers();
        } catch (err) {
            alert("Failed to change status");
        }
    };

    const handleEditClick = (u) => {
        setEditingId(u.id);
        setFormData({
            username: u.username,
            password: '', // Keep blank for security during edit
            role: u.role,
            email: u.email,
            fullName: u.fullName || '',
            phoneNumber: u.phoneNumber || '',
            active: u.active
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ username: '', password: '', role: 'MANAGER', email: '', fullName: '', phoneNumber: '', active: true });
    };

    return (
        <div className="container py-10 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 sticky top-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <UserPlus className="text-blue-600" />
                                <h2 className="text-xl font-bold">{editingId ? 'Edit User' : 'Add New User'}</h2>
                            </div>
                            {editingId && (
                                <button onClick={resetForm} className="text-slate-400 hover:text-red-500">
                                    <XCircle size={20} />
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                            {!editingId && (
                                <input
                                    type="password"
                                    className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            )}
                            <input
                                type="text"
                                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            />
                            <input
                                type="email"
                                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                            <select
                                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="MANAGER">MANAGER</option>
                                <option value="DRIVER">DRIVER</option>
                            </select>
                            <button className={`w-full py-3 text-white rounded-xl font-bold transition-all ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {editingId ? 'Update Information' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="text-blue-600" />
                            <h2 className="text-xl font-bold">System Users</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-y-2">
                                <thead>
                                <tr className="text-slate-400 text-xs uppercase">
                                    <th className="px-4 py-2">Identity</th>
                                    <th className="px-4 py-2">Role & Status</th>
                                    <th className="px-4 py-2 text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className={`group ${u.active ? 'bg-white' : 'bg-slate-50 opacity-60'} border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all`}>
                                        <td className="px-4 py-4 rounded-l-2xl">
                                            <div className="font-bold text-slate-900">{u.username}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10}/> {u.email}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                    <span className="w-fit px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase">
                                                        {u.role}
                                                    </span>
                                                <span className={`text-[10px] font-bold ${u.active ? 'text-green-500' : 'text-red-400'}`}>
                                                        {u.active ? '● Active' : '○ Disabled'}
                                                    </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right rounded-r-2xl">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEditClick(u)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(u)}
                                                    className={`p-2 rounded-lg transition-colors ${u.active ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-red-500 hover:text-green-600 hover:bg-green-50'}`}
                                                    title={u.active ? 'Disable User' : 'Enable User'}
                                                >
                                                    <Power size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;