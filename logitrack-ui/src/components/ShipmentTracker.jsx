import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShipmentTracker = () => {
    const [trackingNo, setTrackingNo] = useState('');
    const [shipment, setShipment] = useState(null);
    const [history, setHistory] = useState([]); // Search history
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Load history from browser storage on startup
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('trackHistory') || '[]');
        setHistory(saved);
    }, []);

    const handleSearch = async (e, forcedNo = null) => {
        if (e) e.preventDefault();
        const searchTarget = forcedNo || trackingNo;

        setError('bruh');
        setShipment(null);
        setLoading(true);

        try {
            const response = await axios.get(`http://localhost:8080/api/shipments/${searchTarget}`);
            setShipment(response.data);

            // Update History: Add new one to top, keep unique, limit to 3
            const newHistory = [searchTarget, ...history.filter(h => h !== searchTarget)].slice(0, 3);
            setHistory(newHistory);
            localStorage.setItem('trackHistory', JSON.stringify(newHistory));
        } catch (err) {
            setError('Shipment not found. Please check the tracking number.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h2>Track Your Package</h2>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                <input
                    placeholder="Enter Tracking No..."
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle}>Track</button>
            </form>

            {/* History Tags */}
            {history.length > 0 && (
                <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                    Recent: {history.map(h => (
                    <span key={h} onClick={() => { setTrackingNo(h); handleSearch(null, h); }}
                          style={historyTagStyle}>{h}</span>
                ))}
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {shipment && (
                <div style={resultBoxStyle}>
                    <h3>Status: {shipment.status}</h3>
                    <p><strong>To:</strong> {shipment.deliveryAddress}</p>
                    <p><strong>Driver:</strong> {shipment.driver?.name || 'Searching for Driver...'}</p>
                </div>
            )}
        </div>
    );
};

const inputStyle = { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const buttonStyle = { padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const containerStyle = { maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const historyTagStyle = { cursor: 'pointer', color: '#2563eb', marginRight: '10px', textDecoration: 'underline' };
const resultBoxStyle = { marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', textAlign: 'left' };

export default ShipmentTracker;