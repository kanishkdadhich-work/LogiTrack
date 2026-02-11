import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShipmentForm = () => {
    const [formData, setFormData] = useState({
        trackingNumber: '',
        deliveryAddress: '',
        status: 'PENDING',
        driver: { id: '' }
    });

    const [drivers, setDrivers] = useState([]);
    const [lastSaved, setLastSaved] = useState(null);
    const [loading, setLoading] = useState(false);

    // 1. Fetch drivers using the correct /api/drivers path
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                // Fixed path to include /api
                const response = await axios.get('http://localhost:8080/api/drivers');
                console.log("Drivers loaded:", response.data);
                setDrivers(response.data);
            } catch (err) {
                console.error("Failed to load drivers. Is CORS enabled?", err);
            }
        };
        fetchDrivers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'driverId') {
            setFormData({ ...formData, driver: { id: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Updated payload to match your entity's API expectations
            const payload = {
                trackingNumber: formData.trackingNumber,
                deliveryAddress: formData.deliveryAddress,
                status: formData.status,
                driver: { id: parseInt(formData.driver.id) }
            };

            // Using /api/shipments if your backend uses the same prefix
            const response = await axios.post('http://localhost:8080/api/shipments', payload);

            setLastSaved(response.data);
            alert("Shipment Created Successfully!");
            setFormData({ trackingNumber: '', deliveryAddress: '', status: 'PENDING', driver: { id: '' } });
        } catch (error) {
            console.error("Submission error:", error.response?.data);
            alert("Error: " + (error.response?.data?.message || "Could not save shipment. Check Driver ID."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h3 style={{ color: '#2563eb', marginBottom: '20px' }}>Assign Driver to Shipment</h3>

            <form onSubmit={handleSubmit} style={formStyle}>
                <label style={labelStyle}>Tracking Number</label>
                <input name="trackingNumber" value={formData.trackingNumber} onChange={handleChange} style={inputStyle} required />

                <label style={labelStyle}>Delivery Address</label>
                <input name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} style={inputStyle} required />

                <label style={labelStyle}>Select Driver</label>
                <select
                    name="driverId"
                    value={formData.driver.id}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                >
                    <option value="">-- {drivers.length > 0 ? "Choose a Driver" : "Loading Drivers..."} --</option>
                    {drivers.map(d => (
                        <option key={d.id} value={d.id}>
                            {d.name} (ID: {d.id})
                        </option>
                    ))}
                </select>

                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? "Saving..." : "Register Shipment"}
                </button>
            </form>

            {lastSaved && (
                <div style={resultStyle}>
                    <h4>✅ Confirmed</h4>
                    <p><strong>Tracking:</strong> {lastSaved.trackingNumber}</p>
                    <p><strong>Driver:</strong> {lastSaved.driver?.name || "ID " + lastSaved.driver?.id}</p>
                </div>
            )}
        </div>
    );
};

// --- Styles remain the same as previous ---
const containerStyle = { maxWidth: '500px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const labelStyle = { fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '-10px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' };
const buttonStyle = { padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const resultStyle = { marginTop: '30px', padding: '15px', background: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #2563eb' };

export default ShipmentForm;