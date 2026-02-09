const PackageTable = ({ packages }) => {
    return (
        <div style={tableWrapperStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f8fafc' }}>
                <tr>
                    <th style={thStyle}>Tracking #</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Action</th>
                </tr>
                </thead>
                <tbody>
                {packages.map((pkg) => (
                    <tr key={pkg.id} className="table-row">
                        <td style={tdStyle}>{pkg.trackingNumber}</td>
                        <td style={tdStyle}>
                            <span style={getStatusBadge(pkg.status)}>{pkg.status}</span>
                        </td>
                        <td style={tdStyle}>
                            <button className="btn-action">View Details</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const tableWrapperStyle = {
    overflowX: 'auto',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
};

const thStyle = { padding: '15px 20px', fontSize: '0.85rem', color: '#475569', borderBottom: '2px solid #f1f5f9' };
const tdStyle = { padding: '15px 20px', color: '#1e293b' };

const getStatusBadge = (status) => ({
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    background: status === 'IN_TRANSIT' ? '#dcfce7' : status === 'DELIVERED' ? '#e0f2fe' : '#fef9c3',
    color: status === 'IN_TRANSIT' ? '#166534' : status === 'DELIVERED' ? '#0369a1' : '#854d0e'
});

export default PackageTable;