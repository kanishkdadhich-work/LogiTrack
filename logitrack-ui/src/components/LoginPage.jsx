import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const role = await login(credentials.username, credentials.password);

            // Logic-based internal navigation
            if (role === 'MANAGER') navigate('/admin');
            else if (role === 'CARRIER') navigate('/admin/status');
            else navigate('/track');
        } catch (error) {
            alert("Invalid Login: " + (error.response?.data?.message || "Please check your username and password."));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <form onSubmit={handleLogin} className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <Lock className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">LogiTrack</h1>
                    <p className="text-slate-500 mt-2 font-medium">Internal Secure Portal</p>
                </div>

                <div className="space-y-4 mb-8">
                    <input
                        className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none transition-all"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none transition-all"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        required
                    />
                </div>

                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg group">
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </div>
    );
};

export default LoginPage;