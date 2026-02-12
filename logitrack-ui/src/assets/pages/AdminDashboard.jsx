import PackageTable from '../../components/PackageTable.jsx';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        // Fetches the joined view of shipments and drivers
        fetch('http://localhost:8080/api/tables/with-drivers')
            .then(response => response.json())
            .then(data => {
                setPackages(data);
            })
            .catch(error => console.error("Error:", error));
    }, []);

    // Statistics Logic
    const totalCount = packages.length;
    const deliveredCount = packages.filter(pkg => pkg.status === 'DELIVERED').length;

    // A package is unassigned if the driver object is missing or has no ID
    const unassignedCount = packages.filter(pkg => !pkg.driver || !pkg.driver.id).length;

    // Active counts represent everything that isn't delivered
    const activeCount = totalCount - deliveredCount;

    return (
        <div className="container" style={{ padding: '20px 0' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Shipment Overview</h1>
                <p style={{ color: '#64748b' }}>Monitor active logistics and track delivery progress.</p>
            </header>

            <section style={statsGridStyle}>
                {/* Total Shipments Card */}
                <div style={cardStyle}>
                    <span style={statLabel}>Total</span>
                    <div style={statValue}>{totalCount}</div>
                </div>

                {/* New: Unassigned Shipments Card */}
                <div style={cardStyle}>
                    <span style={statLabel}>Unassigned</span>
                    <div style={{...statValue, color: '#ef4444'}}>{unassignedCount}</div>
                </div>

                {/* Active Shipments Card */}
                <div style={cardStyle}>
                    <span style={statLabel}>Active</span>
                    <div style={{...statValue, color: '#f59e0b'}}>{activeCount}</div>
                </div>

                {/* Delivered Shipments Card */}
                <div style={cardStyle}>
                    <span style={statLabel}>Delivered</span>
                    <div style={{...statValue, color: '#10b981'}}>{deliveredCount}</div>
                </div>
            </section>

            <PackageTable packages={packages} />
        </div>
    );
};

// Layout Styles
const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
};

const cardStyle = {
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const statLabel = {
    fontSize: '0.875rem',
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '600'
};

const statValue = {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1e293b',
    marginTop: '8px'
};

export default AdminDashboard;