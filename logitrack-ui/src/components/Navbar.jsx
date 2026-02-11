import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={navStyle}>
            <div className="container" style={navContentStyle}>
                <Link to="/" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.4rem', color: '#2563eb' }}>LOGITRACK</div>
                </Link>
                <div style={linkGroupStyle}>

                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/admin" className="nav-link">Dashboard</Link>
                    <Link to="/track" className="nav-link">Track Shipment</Link>
                    <Link to="/admin/new-shipment" style={formButtonStyle}>
                        + New Shipment
                    </Link>
                    <Link to="/admin/status" className="nav-link">Update Status</Link>
                    {/* 👈 Added the Form link below/next to Dashboard */}
                    <Link to="/admin/add-shipment" style={formButtonStyle}>
                        Assign Driver brrrrr
                    </Link>
                </div>
            </div>
        </nav>
    );
};

// --- Styles ---
const navStyle = { background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 };
const navContentStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 20px' };
const linkGroupStyle = { display: 'flex', gap: '30px', alignItems: 'center' };

// Custom style for the new button to make it look prominent
const formButtonStyle = {
    background: '#2563eb',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'background 0.2s'
};

export default Navbar;