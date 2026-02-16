import { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Optimized: Set up Axios Interceptors for centralized error handling
    useEffect(() => {
        const authInterceptor = axios.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Auto-logout if token expires (401 Unauthorized)
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(authInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [token]);

    // Preserved: Load user from localStorage on refresh
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedRole = localStorage.getItem('userRole');
        const savedUsername = localStorage.getItem('username');

        if (savedToken && savedRole) {
            // Normalize role to uppercase
            const normalizedRole = savedRole.toUpperCase();
            setToken(savedToken);
            setUser({ username: savedUsername, role: normalizedRole });
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
            console.log('User restored from localStorage:', { username: savedUsername, role: normalizedRole });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            const { token, role } = response.data;
            
            // Ensure role is uppercase
            const normalizedRole = role ? role.toUpperCase() : 'MANAGER';
            
            console.log('Login Response:', { token, role, normalizedRole });

            // Save consistent structured data
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', normalizedRole);
            localStorage.setItem('username', username);

            setToken(token);
            setUser({ username, role: normalizedRole });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return normalizedRole;
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error; // Let LoginPage handle the error message
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    // Memoize value to prevent unnecessary re-renders of the entire app
    const contextValue = useMemo(() => ({
        user,
        token,
        login,
        logout,
        loading,
        isAdmin: user?.role === 'ADMIN',
        isManager: user?.role === 'MANAGER',
        isDriver: user?.role === 'DRIVER'
    }), [user, token, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

