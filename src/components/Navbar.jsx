import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={navStyle}>
            <div className="container" style={navContentStyle}>
                <div style={{ fontWeight: '800', fontSize: '1.4rem', color: '#2563eb' }}>LOGITRACK</div>
                <div style={linkGroupStyle}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/admin" className="nav-link">Dashboard</Link>
                </div>
            </div>
        </nav>
    );
};

const navStyle = { background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 };
const navContentStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 20px' };
const linkGroupStyle = { display: 'flex', gap: '30px' };

export default Navbar;