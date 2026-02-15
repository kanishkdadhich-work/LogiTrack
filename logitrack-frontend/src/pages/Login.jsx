import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { LogIn } from 'lucide-react'; // Cool icon from the library you installed

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const getHomePath = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return '/admin';
            case 'ROLE_MANAGER': return '/shipments';
            case 'ROLE_DRIVER': return '/shipments';
            default: return '/login';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/signin', credentials);

            // Browser automatically saves the HttpOnly cookie now!
            const { username, roles } = res.data;
            const role = roles[0];

            localStorage.setItem('role', role);
            localStorage.setItem('username', username);
            setUser({ username, role });

            navigate(getHomePath(role));
        } catch (err) {
            setError('Login Failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-slate-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="flex items-center gap-2 mb-6 text-blue-600">
                    <LogIn size={28} />
                    <h1 className="text-2xl font-bold text-slate-800">LogiTrack Portal</h1>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700">Username</label>
                    <input
                        type="text" name="username" required
                        className="mt-1 block w-full border border-slate-300 rounded-md p-2"
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <input
                        type="password" name="password" required
                        className="mt-1 block w-full border border-slate-300 rounded-md p-2"
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;