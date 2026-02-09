// src/pages/AdminDashboard.jsx
import PackageTable from "/home/kanishk/IdeaProjects/LogiTrackDay2/logitrack-ui/src/components/PackageTable.jsx";


const AdminDashboard = () => {
    // Defining data locally so the table has something to show
    const dummyData = [
        { id: 1, trackingNumber: 'TRK-10234', status: 'IN_TRANSIT' },
        { id: 2, trackingNumber: 'TRK-55210', status: 'PENDING' },
        { id: 3, trackingNumber: 'TRK-99001', status: 'DELIVERED' },
        { id: 4, trackingNumber: 'TRK-12345', status: 'IN_TRANSIT' }
    ];

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Shipment Overview</h1>
                <p style={{ color: '#64748b' }}>Monitor active logistics and track delivery progress.</p>
            </header>

            <section style={statsGridStyle}>
                <div className="card">
                    <span style={statLabel}>Total</span>
                    <div style={statValue}>124</div>
                </div>
                <div className="card">
                    <span style={statLabel}>Active</span>
                    <div style={statValue}>12</div>
                </div>
                <div className="card">
                    <span style={statLabel}>Delivered</span>
                    <div style={statValue}>112</div>
                </div>
            </section>

            <PackageTable packages={dummyData} />
        </div>
    );
};

const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
};

const statLabel = { fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase' };
const statValue = { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginTop: '5px' };

export default AdminDashboard;