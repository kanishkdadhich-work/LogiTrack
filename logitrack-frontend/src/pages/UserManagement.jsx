import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    UserPlus, Shield, Truck, UserCircle,
    Trash2, Key, X, Search, CheckCircle2, AlertCircle
} from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        fullName: '',
        role: 'ROLE_DRIVER'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/users', newUser);
            setShowModal(false);
            setNewUser({ username: '', password: '', fullName: '', role: 'ROLE_DRIVER' });
            await fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Error adding user.");
        }
    };

    const getRoleBadge = (role) => {
        const baseClass = "flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ";
        switch (role) {
            case 'ROLE_ADMIN':
                return (
                    <span className={`${baseClass} bg-rose-50 text-rose-600 border-rose-200 shadow-sm shadow-rose-100`}>
                        <Shield size={14} strokeWidth={2.5} /> Administrator
                    </span>
                );
            case 'ROLE_MANAGER':
                return (
                    <span className={`${baseClass} bg-sky-50 text-sky-600 border-sky-200 shadow-sm shadow-sky-100`}>
                        <UserCircle size={14} strokeWidth={2.5} /> Manager
                    </span>
                );
            case 'ROLE_DRIVER':
                return (
                    <span className={`${baseClass} bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-100`}>
                        <Truck size={14} strokeWidth={2.5} /> Fleet Driver
                    </span>
                );
            default: return <span>{role}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto">

                {/* Header Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">LogiTrack <span className="text-indigo-600">Staff</span></h1>
                        <p className="text-slate-500 font-medium mt-1">Manage organizational hierarchy and access control</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
                    >
                        <UserPlus size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                        <span className="font-bold tracking-wide">Register New Staff</span>
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Employee Info</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">System Privileges</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="3" className="p-20 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></td></tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center text-indigo-600 font-black text-lg border border-indigo-100 shadow-sm">
                                                {user.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-base">{user.fullName}</div>
                                                <div className="text-sm text-slate-400 font-semibold tracking-tight">@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                            <button className="p-2.5 bg-white border border-slate-100 hover:border-indigo-200 text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm transition-all" title="Reset Passcode">
                                                <Key size={18} strokeWidth={2.5} />
                                            </button>
                                            <button className="p-2.5 bg-white border border-slate-100 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-xl shadow-sm transition-all" title="Remove Staff">
                                                <Trash2 size={18} strokeWidth={2.5} />
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

            {/* Premium Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.25)] w-full max-w-md overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-indigo-600 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black">Add Staff Member</h2>
                                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">Identity Setup</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={28} strokeWidth={3} />
                            </button>
                            {/* Decorative Background Icon */}
                            <UserPlus className="absolute -right-4 -bottom-4 text-indigo-500 opacity-20 rotate-12" size={120} />
                        </div>

                        <form onSubmit={handleAddUser} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                <div className="relative">
                                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 pl-12 focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold"
                                        placeholder="Enter full name..."
                                        value={newUser.fullName}
                                        onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unique ID</label>
                                    <input
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold"
                                        placeholder="Username"
                                        value={newUser.username}
                                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold appearance-none text-indigo-600"
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                        >
                                            <option value="ROLE_DRIVER">Driver</option>
                                            <option value="ROLE_MANAGER">Manager</option>
                                            <option value="ROLE_ADMIN">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Master Password</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 pl-12 focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold"
                                        placeholder="••••••••"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95 mt-4">
                                Initialize Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;