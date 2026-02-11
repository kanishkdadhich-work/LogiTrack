import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STATUS_STEPS = [
    { label: "Processed", key: "CREATED", color: "#6366f1" },
    { label: "Designing", key: "PROCESSING", color: "#a855f7" },
    { label: "Shipped", key: "SHIPPED", color: "#ec4899" },
    { label: "En Route", key: "IN_TRANSIT", color: "#f59e0b" },
    { label: "Arrived", key: "DELIVERED", color: "#10b981" }
];

const UpdateShipmentStatus = () => {
    const [trackingNo, setTrackingNo] = useState('');
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('shipment_history') || '[]');
        setHistory(saved);
    }, []);

    const saveToHistory = (s) => {
        const updated = [s, ...history.filter(i => i.trackingNumber !== s.trackingNumber)].slice(0, 5);
        setHistory(updated);
        localStorage.setItem('shipment_history', JSON.stringify(updated));
    };

    const fetchShipment = async (tNo = trackingNo) => {
        if (!tNo) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/shipments/${tNo}`);
            setShipment(res.data);
            saveToHistory(res.data);
        } catch (err) {
            alert('Shipment not found.');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        if (!shipment) return;
        try {
            const res = await axios.put(
                `http://localhost:8080/api/shipments/track/${shipment.trackingNumber}`,
                { ...shipment, status: newStatus }
            );
            setShipment(res.data);
            saveToHistory(res.data);
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Logistics Hub</h2>

            {/* Search Box */}
            <div style={searchBox}>
                <input
                    placeholder="Enter tracking number..."
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    style={inputStyle}
                />
                <button onClick={() => fetchShipment()} style={btnStyle}>
                    {loading ? '...' : 'Track'}
                </button>
            </div>

            {/* History Tags */}
            {history.length > 0 && (
                <div style={historyRow}>
                    {history.map(item => (
                        <button
                            key={item.trackingNumber}
                            onClick={() => { setTrackingNo(item.trackingNumber); fetchShipment(item.trackingNumber); }}
                            style={tagStyle}
                        >
                            {item.trackingNumber}
                        </button>
                    ))}
                </div>
            )}

            {/* Shipment Card */}
            {shipment && (
                <div style={cardStyle}>
                    <div style={headerStyle}>
                        <h3>ID: #{shipment.id}</h3>
                        <p style={{ fontWeight: 'bold' }}>{shipment.trackingNumber}</p>
                    </div>

                    <div style={controlArea}>
                        <label style={labelStyle}>Update State</label>
                        <select
                            value={shipment.status}
                            onChange={(e) => updateStatus(e.target.value)}
                            style={selectStyle}
                        >
                            {STATUS_STEPS.map(s => (
                                <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const containerStyle = { maxWidth: '600px', margin: '50px auto', padding: '0 20px', fontFamily: 'sans-serif' };
const titleStyle = { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' };
const searchBox = { display: 'flex', gap: '10px', marginBottom: '15px' };
const inputStyle = { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' };
const btnStyle = { padding: '12px 24px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const historyRow = { display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' };
const tagStyle = { padding: '5px 12px', background: '#f1f5f9', border: 'none', borderRadius: '15px', fontSize: '12px', cursor: 'pointer' };
const cardStyle = { padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const headerStyle = { borderBottom: '1px solid #eee', marginBottom: '20px', paddingBottom: '10px' };
const controlArea = { background: '#f8fafc', padding: '20px', borderRadius: '12px' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' };
const selectStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' };

export default UpdateShipmentStatus;