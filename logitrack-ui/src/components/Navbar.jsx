import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ role, onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav style={navStyle}>
            <div className="container" style={navContentStyle}>
                <Link to="/" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.4rem', color: '#2563eb' }}>LOGITRACK</div>
                </Link>

                <div style={linkGroupStyle}>
                    {/* Common link for all logged-in users */}
                    <Link to="/" className="nav-link">Home</Link>

                    {/* Manager Specific Links */}
                    {role === 'manager' && (
                        <>
                            <Link to="/admin" className="nav-link">Dashboard</Link>
                            <Link to="/admin/add-shipment" style={formButtonStyle}>
                                + Assign Driver
                            </Link>
                        </>
                    )}

                    {/* Carrier & Manager Links */}
                    {(role === 'carrier' || role === 'manager') && (
                        <Link to="/admin/status" className="nav-link">Update Status</Link>
                    )}

                    {/* Customer & Manager Links */}
                    {(role === 'customer' || role === 'manager') && (
                        <Link to="/track" className="nav-link">Track Shipment</Link>
                    )}

                    {/* Logout Action */}
                    <button onClick={handleLogoutClick} style={logoutButtonStyle}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

// --- Styles (Building on existing styles) ---
const navStyle = { background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 };
const navContentStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 20px' };
const linkGroupStyle = { display: 'flex', gap: '30px', alignItems: 'center' };
const formButtonStyle = { background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' };
const logoutButtonStyle = { background: 'transparent', border: '1px solid #cbd5e1', color: '#64748b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };

export default Navbar;