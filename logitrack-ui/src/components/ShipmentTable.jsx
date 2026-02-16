import React, { useContext, useState, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Trash2, Edit3, Search, RotateCw } from 'lucide-react';
import axios from 'axios';

const ShipmentTable = ({ shipments, onRefresh, onEdit, onStatusUpdate }) => {
    const { isAdmin, isManager, isDriver, user } = useContext(AuthContext);
    const [managerSearch, setManagerSearch] = useState('');
    const [driverSearch, setDriverSearch] = useState('');

    const handleDelete = async (trackingNumber) => {
        if (window.confirm(`Are you sure you want to delete shipment: ${trackingNumber}?`)) {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.delete(
                    `http://localhost:8080/api/shipments/tracking/${trackingNumber}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                alert(res.data);
                onRefresh();
            } catch (err) {
                console.error("Delete Error:", err);
                const msg = err.response?.status === 403
                    ? "Permission Denied: Only Admins can delete shipments."
                    : "Delete failed. Check if shipment exists.";
                alert(msg);
            }
        }
    };

    const filteredData = useMemo(() => {
        return shipments.filter(pkg => {
            const managerName = pkg.manager ? (pkg.manager.fullName || pkg.manager.username) : 'Admin Direct';
            const driverName = pkg.driver?.name || 'Unassigned';
            const matchManager = managerName.toLowerCase().includes(managerSearch.toLowerCase());
            const matchDriver = driverName.toLowerCase().includes(driverSearch.toLowerCase());

            // Drivers can only see their own shipments
            if (isDriver && !isManager && !isAdmin) {
                return matchManager && matchDriver && pkg.driver?.id === user?.id;
            }

            return matchManager && matchDriver;
        });
    }, [shipments, managerSearch, driverSearch, isDriver, isManager, isAdmin, user?.id]);

    return (
        <div style={{ marginTop: '20px' }}>
            {/* Filters */}
            <div style={filterContainer}>
                <div style={searchBox}><Search size={16} /><input placeholder="Manager..." style={searchInput} onChange={e => setManagerSearch(e.target.value)} /></div>
                <div style={searchBox}><Search size={16} /><input placeholder="Driver..." style={searchInput} onChange={e => setDriverSearch(e.target.value)} /></div>
            </div>

            <div style={tableWrapper}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc' }}>
                    <tr>
                        <th style={thStyle}>Tracking #</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Overlooked By</th>
                        <th style={thStyle}>Driver</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((pkg) => (
                        <tr key={pkg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={tdStyle}><strong>{pkg.trackingNumber}</strong></td>
                            <td style={tdStyle}>{pkg.status}</td>
                            <td style={tdStyle}>
                                {pkg.manager ? `👤 ${pkg.manager.username}` : '🛡️ Admin'}
                            </td>
                            <td style={tdStyle}>{pkg.driver?.name || 'Unassigned'}</td>
                            <td style={tdStyle}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {/* EDIT BUTTON - Admin and Manager only */}
                                    {(isAdmin || isManager) && (
                                        <button onClick={() => onEdit(pkg)} style={actionBtn} title="Edit">
                                            <Edit3 size={16} color="#2563eb" />
                                        </button>
                                    )}

                                    {/* STATUS UPDATE BUTTON - All roles */}
                                    <button
                                        onClick={() => onStatusUpdate(pkg)}
                                        style={{ ...actionBtn, backgroundColor: '#dbeafe' }}
                                        title="Update Status"
                                    >
                                        <RotateCw size={16} color="#2563eb" />
                                    </button>

                                    {/* DELETE BUTTON - Admin only */}
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(pkg.trackingNumber)}
                                            style={{ ...actionBtn, backgroundColor: '#fee2e2' }}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} color="#ef4444" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filteredData.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                        No shipments found
                    </div>
                )}
            </div>
        </div>
    );
};

const filterContainer = {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px'
};

const searchBox = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '8px 12px',
    flex: '1'
};

const searchInput = {
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '14px',
    flex: 1
};

const tableWrapper = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden'
};

const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569'
};

const tdStyle = {
    padding: '12px 16px',
    fontSize: '14px'
};

const actionBtn = {
    background: '#f0f4f8',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s'
};

export default ShipmentTable;
