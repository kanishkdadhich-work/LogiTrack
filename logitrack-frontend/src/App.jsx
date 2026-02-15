import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import UserManagement from './pages/UserManagement.jsx';
import ShipmentHub from './pages/ShipmentHub.jsx';
import Profile from './pages/Profile.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

function App() {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Only */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            } />

            {/* Shared Access */}
            <Route path="/shipments" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_DRIVER']}>
                <ShipmentHub />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_DRIVER']}>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;