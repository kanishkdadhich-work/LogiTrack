import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/home.jsx';
import LoginPage from './components/LoginPage.jsx';
import AdminDashboard from './assets/pages/AdminDashboard.jsx';
import ShipmentForm from './components/ShipmentForm.jsx';
import ShipmentTracker from './components/ShipmentTracker.jsx';
import UpdateShipmentStatus from './components/UpdateShipmentStatus.jsx';
import './App.css';

// Placeholder components for your new flow goals
const UserManagement = () => <div className="container"><h1>User Management (Admin Only)</h1><p>Manage users and passwords here.</p></div>;
const ProfileSettings = () => <div className="container"><h1>Profile Settings</h1><p>Update your personal information and password.</p></div>;

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
    const { user, logout, token, isAdmin, isManager, isDriver } = useContext(AuthContext);

    return (
        <>
            {/* Navbar shows role-specific links based on AuthContext */}
            {token && <Navbar role={user?.role?.toLowerCase()} onLogout={logout} />}

            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={token ? <Navigate to="/" /> : <LoginPage />} />
                <Route path="/" element={<Home />} />
                <Route path="/track" element={<ShipmentTracker />} />

                {/* --- PAGE 1: User Management (Strictly Admin) --- */}
                <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <UserManagement />
                    </ProtectedRoute>
                } />

                {/* --- PAGE 2: Logistics Portal (Admin & Manager) --- */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/admin/add-shipment" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                        <ShipmentForm />
                    </ProtectedRoute>
                } />

                {/* Status Updates: Admin, Manager, and Driver can access */}
                <Route path="/admin/status" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'DRIVER']}>
                        <UpdateShipmentStatus />
                    </ProtectedRoute>
                } />

                {/* --- PAGE 3: Profile Settings (Any Logged-in User) --- */}
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfileSettings />
                    </ProtectedRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
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