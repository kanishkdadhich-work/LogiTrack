import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShipmentForm = ({ selectedShipment, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        trackingNumber: '',
        deliveryAddress: '',
        status: 'CREATED',
        driverId: '',
        managerId: '', // Added for assigning Managers
        length: '',
        width: '',
        height: '',
        distanceInMeters: '',
        costPerMeter: '',
    });

    const [drivers, setDrivers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [error, setError] = useState('');
    const [trackingAvailable, setTrackingAvailable] = useState(null);

    useEffect(() => {
        // Fetch Drivers and Managers when form loads
        const fetchData = async () => {
            try {
                const [driverRes, userRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/drivers'),
                    axios.get('http://localhost:8080/api/admin/users') // Fetch all users
                ]);
                setDrivers(driverRes.data);
                // Filter users to only show those with the 'MANAGER' role
                setManagers(userRes.data.filter(u => u.role === 'MANAGER' || u.role === 'ADMIN'));
            } catch (err) {
                console.error("Error loading selection data", err);
            }
        };
        fetchData();

        // If we are editing, populate the form
        if (selectedShipment) {
            setFormData({
                trackingNumber: selectedShipment.trackingNumber,
                deliveryAddress: selectedShipment.deliveryAddress,
                status: selectedShipment.status,
                driverId: selectedShipment.driver?.id || '',
                managerId: selectedShipment.manager?.id || '',
                length: selectedShipment.length || '',
                width: selectedShipment.width || '',
                height: selectedShipment.height || '',
                distanceInMeters: selectedShipment.distanceInMeters || '',
                costPerMeter: selectedShipment.costPerMeter || '',
            });
        }
    }, [selectedShipment]);

    // Check if tracking number is already in use (debounced)
    useEffect(() => {
        if (!formData.trackingNumber || selectedShipment) {
            setTrackingAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/shipments/tracking/${formData.trackingNumber}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                setTrackingAvailable(false); // Tracking number exists, not available
            } catch (err) {
                if (err.response?.status === 404) {
                    setTrackingAvailable(true); // Tracking number doesn't exist, available
                } else {
                    setTrackingAvailable(null); // Error checking, allow submission to try
                }
            }
        }, 500); // Debounce 500ms

        return () => clearTimeout(timer);
    }, [formData.trackingNumber, selectedShipment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate tracking number format
        const trackingRegex = /^TRK-\d{5}$/;
        if (!trackingRegex.test(formData.trackingNumber)) {
            setError('Invalid tracking number format. Must be TRK-XXXXX (e.g., TRK-12345)');
            return;
        }

        // Check if tracking number is available (only for new shipments)
        if (!selectedShipment && trackingAvailable === false) {
            setError('Tracking number already exists. Please use a unique tracking number.');
            return;
        }

        const token = localStorage.getItem('token');

        // Prepare the payload for Spring Boot (Driver and Manager as objects)
        const payload = {
            trackingNumber: formData.trackingNumber,
            deliveryAddress: formData.deliveryAddress,
            status: formData.status,
            driver: formData.driverId ? { id: parseInt(formData.driverId) } : null,
            manager: formData.managerId ? { id: parseInt(formData.managerId) } : null,
            length: formData.length ? parseFloat(formData.length) : null,
            width: formData.width ? parseFloat(formData.width) : null,
            height: formData.height ? parseFloat(formData.height) : null,
            distanceInMeters: formData.distanceInMeters ? parseFloat(formData.distanceInMeters) : null,
            costPerMeter: formData.costPerMeter ? parseFloat(formData.costPerMeter) : null,
        };

        try {
            const url = selectedShipment
                ? `http://localhost:8080/api/shipments/${selectedShipment.id}`
                : `http://localhost:8080/api/shipments`;

            const method = selectedShipment ? 'put' : 'post';

            await axios[method](url, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Success! 🎉");
            onSaveSuccess();
        } catch (err) {
            if (err.response?.status === 409) {
                setError('Tracking number already exists. Please use a unique tracking number.');
            } else {
                const errorMsg = err.response?.data?.message || err.message || "Save failed. Please check console.";
                setError(errorMsg);
            }
            console.error("Save error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formContainer}>
            <h3>{selectedShipment ? 'Edit Shipment' : 'Add New Shipment'}</h3>

            {error && (
                <div style={{
                    padding: '12px',
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    color: '#991b1b',
                    fontSize: '14px'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div style={{ position: 'relative' }}>
                <input
                    placeholder="Tracking Number (e.g., TRK-12345)"
                    value={formData.trackingNumber}
                    onChange={e => setFormData({...formData, trackingNumber: e.target.value})}
                    style={{
                        ...inputStyle,
                        borderColor: !selectedShipment && trackingAvailable === false ? '#dc2626' : 
                                   !selectedShipment && trackingAvailable === true ? '#16a34a' : '#ccc'
                    }}
                    disabled={!!selectedShipment} // Usually tracking numbers shouldn't change
                />
                {!selectedShipment && formData.trackingNumber && (
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        {trackingAvailable === null && <span style={{ color: '#6b7280' }}>Checking availability...</span>}
                        {trackingAvailable === true && <span style={{ color: '#16a34a' }}>✓ Available</span>}
                        {trackingAvailable === false && <span style={{ color: '#dc2626' }}>✗ Already in use</span>}
                    </div>
                )}
            </div>

            <input
                placeholder="Delivery Address"
                value={formData.deliveryAddress}
                onChange={e => setFormData({...formData, deliveryAddress: e.target.value})}
                style={inputStyle}
            />

            {/* DIMENSIONS SECTION */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px', marginTop: '10px' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '10px' }}>Package Dimensions</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                        type="number"
                        placeholder="Length (m)"
                        value={formData.length}
                        onChange={e => setFormData({...formData, length: e.target.value})}
                        style={inputStyle}
                        step="0.1"
                    />
                    <input
                        type="number"
                        placeholder="Width (m)"
                        value={formData.width}
                        onChange={e => setFormData({...formData, width: e.target.value})}
                        style={inputStyle}
                        step="0.1"
                    />
                </div>

                <input
                    type="number"
                    placeholder="Height (m)"
                    value={formData.height}
                    onChange={e => setFormData({...formData, height: e.target.value})}
                    style={{...inputStyle, marginTop: '10px'}}
                    step="0.1"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                    <input
                        type="number"
                        placeholder="Distance (m)"
                        value={formData.distanceInMeters}
                        onChange={e => setFormData({...formData, distanceInMeters: e.target.value})}
                        style={inputStyle}
                        step="0.1"
                    />
                    <input
                        type="number"
                        placeholder="Cost per m"
                        value={formData.costPerMeter}
                        onChange={e => setFormData({...formData, costPerMeter: e.target.value})}
                        style={inputStyle}
                        step="0.01"
                    />
                </div>
            </div>

            {/* MANAGER SELECTION DROPDOWN */}
            <div style={selectGroup}>
                <label style={labelStyle}>Assigned Manager (Overlooked By):</label>
                <select
                    value={formData.managerId}
                    onChange={e => setFormData({...formData, managerId: e.target.value})}
                    style={inputStyle}
                >
                    <option value="">-- No Manager (Admin Direct) --</option>
                    {managers.map(m => (
                        <option key={m.id} value={m.id}>{m.username} ({m.role})</option>
                    ))}
                </select>
            </div>

            {/* DRIVER SELECTION DROPDOWN */}
            <div style={selectGroup}>
                <label style={labelStyle}>Assigned Driver:</label>
                <select
                    value={formData.driverId}
                    onChange={e => setFormData({...formData, driverId: e.target.value})}
                    style={inputStyle}
                >
                    <option value="">-- Unassigned --</option>
                    {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            </div>

            {/* STATUS SELECTION DROPDOWN */}
            <div style={selectGroup}>
                <label style={labelStyle}>Status:</label>
                <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    style={inputStyle}
                >
                    <option value="CREATED">Created</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="FAILED">Failed</option>
                </select>
            </div>

            <button 
                type="submit" 
                style={{
                    ...submitBtn,
                    opacity: (!selectedShipment && trackingAvailable === false) ? 0.5 : 1,
                    cursor: (!selectedShipment && trackingAvailable === false) ? 'not-allowed' : 'pointer'
                }}
                disabled={!selectedShipment && trackingAvailable === false}
            >
                Save Shipment
            </button>
        </form>
    );
};

// Simple Styles
const formContainer = { background: '#fff', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #ddd' };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #ccc' };
const selectGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#64748b' };
const submitBtn = { padding: '12px', background: '#2563eb', color: '#white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default ShipmentForm;