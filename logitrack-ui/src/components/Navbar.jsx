import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, LayoutDashboard } from 'lucide-react';

const Navbar = ({ role, onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav style={navStyle}>
            <div style={navContentStyle}>
                <Link to="/" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.4rem', color: '#2563eb' }}>LOGITRACK</div>
                </Link>

                <div style={linkGroupStyle}>
                    <Link to="/" className="nav-link" style={navLinkStyle}>
                        <Home size={18} style={{ marginRight: '6px' }} />
                        Home
                    </Link>

                    {role && (
                        <Link to="/dashboard" className="nav-link" style={navLinkStyle}>
                            <LayoutDashboard size={18} style={{ marginRight: '6px' }} />
                            Dashboard
                        </Link>
                    )}

                    <button
                        onClick={handleLogoutClick}
                        style={logoutButtonStyle}
                        title="Logout"
                    >
                        <LogOut size={18} style={{ marginRight: '6px' }} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

const navStyle = {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
};

const navContentStyle = {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px'
};

const linkGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
};

const navLinkStyle = {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.3s',
    cursor: 'pointer'
};

const logoutButtonStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s'
};

export default Navbar;