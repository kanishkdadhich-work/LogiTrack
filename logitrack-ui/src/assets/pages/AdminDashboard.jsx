import PackageTable from '../../components/PackageTable.jsx';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/tables/with-drivers')
            .then(response => response.json())
            .then(data => {
                setPackages(data);
            })
            .catch(error => console.error("Error:", error));
    }, []);

    const totalCount = packages.length;
    const deliveredCount = packages.filter(pkg => pkg.status === 'DELIVERED').length;
    const activeCount = totalCount - deliveredCount;

    return (
        <div className="container" style={{ padding: '20px 0' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Shipment Overview</h1>
                <p style={{ color: '#64748b' }}>Monitor active logistics and track delivery progress.</p>
            </header>

            <section style={statsGridStyle}>
                <div style={cardStyle}>
                    <span style={statLabel}>Total</span>
                    <div style={statValue}>{totalCount}</div>
                </div>
                <div style={cardStyle}>
                    <span style={statLabel}>Active</span>
                    <div style={{...statValue, color: '#f59e0b'}}>{activeCount}</div>
                </div>
                <div style={cardStyle}>
                    <span style={statLabel}>Delivered</span>
                    <div style={{...statValue, color: '#10b981'}}>{deliveredCount}</div>
                </div>
            </section>

            <PackageTable packages={packages} />
        </div>
    );
};

const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' };
const cardStyle = { padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' };
const statLabel = { fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' };
const statValue = { fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginTop: '8px' };

export default AdminDashboard;