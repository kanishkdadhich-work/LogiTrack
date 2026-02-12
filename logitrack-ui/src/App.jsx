import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './components/home.jsx';
import LoginPage from './components/LoginPage.jsx';
import AdminDashboard from './assets/pages/AdminDashboard.jsx';
import ShipmentForm from './components/ShipmentForm.jsx'; // Ensure the path and casing are correct
import ShipmentTracker from './components/ShipmentTracker.jsx';
import UpdateShipmentStatus from './components/UpdateShipmentStatus.jsx';
import AddShipmentSimple from './components/AddShipmentSimple.jsx';
import './App.css';

function App() {
    /**
     * FIX: We explicitly define that userRole can be a string or null.
     * This prevents the "unknown" type error when passing it to components.
     */
    const [userRole, setUserRole] = useState(null);

    const handleLogout = () => {
        setUserRole(null);
    };

    return (
        <Router>
            {/* The Navbar only renders if userRole is not null */}
            {userRole && <Navbar role={userRole} onLogout={handleLogout} />}

            <Routes>
                {/* Public Login Route */}
                <Route
                    path="/login"
                    element={<LoginPage onLogin={(role) => setUserRole(role)} />}
                />

                {/* Landing Page Logic */}
                <Route
                    path="/"
                    element={userRole ? <Navigate to="/admin" /> : <Home />}
                />

                {/* Customer Portal */}
                <Route path="/track" element={<ShipmentTracker />} />

                {/* Protected Manager Routes */}
                <Route
                    path="/admin"
                    element={userRole === 'manager' ? <AdminDashboard /> : <Navigate to="/login" />}
                />
                <Route
                    path="/admin/add-shipment"
                    element={userRole === 'manager' ? <ShipmentForm /> : <Navigate to="/login" />}
                />
                <Route
                    path="/admin/new-shipment"
                    element={userRole === 'manager' ? <AddShipmentSimple /> : <Navigate to="/login" />}
                />

                {/* Protected Carrier/Manager Routes */}
                <Route
                    path="/admin/status"
                    element={
                        (userRole === 'carrier' || userRole === 'manager')
                            ? <UpdateShipmentStatus />
                            : <Navigate to="/login" />
                    }
                />

                {/* Catch-all Redirect */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;