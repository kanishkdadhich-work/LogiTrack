import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={homeContainerStyle}>
            <div style={heroSectionStyle}>
                <h1 style={{ fontSize: '3rem', color: '#1e293b' }}>LogiTrack</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                    Streamline your logistics. Manage shipments, assign drivers, and track deliveries in real-time.
                </p>
                <div style={{ marginTop: '30px' }}>
                    <button className="btn-primary" onClick={() => navigate('/admin')}>
                        Open Admin Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

const homeContainerStyle = {
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
};

const heroSectionStyle = {
    textAlign: 'center',
    animation: 'fadeIn 0.8s ease-in'
};

export default Home;