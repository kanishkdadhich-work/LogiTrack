import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Truck, User, Lock, ArrowRight } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState('customer');
    const navigate = useNavigate();

    const roles = [
        { id: 'customer', title: 'Customer', icon: User, desc: 'Track your personal packages' },
        { id: 'carrier', title: 'Carrier', icon: Truck, desc: 'Update shipment progress' },
        { id: 'manager', title: 'Fleet Manager', icon: Shield, desc: 'Full system administration' }
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        // Update global App state
        onLogin(selectedRole);

        // Redirect based on the logic in App.jsx
        if (selectedRole === 'manager') navigate('/admin');
        else if (selectedRole === 'carrier') navigate('/admin/status');
        else navigate('/track');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <Lock className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">LogiTrack</h1>
                    <p className="text-slate-500 mt-2 font-medium">Select your portal to continue</p>
                </div>

                <div className="space-y-3 mb-8">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                                selectedRole === role.id
                                    ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50'
                                    : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'
                            }`}
                        >
                            <div className={`p-3 rounded-xl ${selectedRole === role.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                <role.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <p className={`font-bold ${selectedRole === role.id ? 'text-blue-900' : 'text-slate-700'}`}>{role.title}</p>
                                <p className="text-xs text-slate-500">{role.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg group"
                >
                    Enter Portal
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default LoginPage;