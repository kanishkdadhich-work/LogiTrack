import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/home.jsx';
import LoginPage from './components/LoginPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import ShipmentTracker from './components/ShipmentTracker.jsx';
import './App.css';

// Optimized ProtectedRoute using AuthContext helpers
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token, loading } = useContext(AuthContext);

    if (loading) return null; // Prevent redirecting while checking storage
    if (!token) return <Navigate to="/login" />;

    // Check if user's role is in the allowed list
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

function AppContent() {
    const { user, logout, token } = useContext(AuthContext);

    return (
        <>
            {/* Navbar shows role-specific links based on AuthContext */}
            {token && <Navbar role={user?.role?.toLowerCase()} onLogout={logout} />}

            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
                <Route path="/" element={<Home />} />
                <Route path="/track" element={<ShipmentTracker />} />

                {/* Dashboard - All roles can access, but with different features */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;