import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShipmentForm = () => {
    // 1. Define all necessary state hooks
    const [formData, setFormData] = useState({
        trackingNumber: '',
        deliveryAddress: '',
        status: 'PENDING',
        driver: { id: '' },
        length: '',
        width: '',
        height: '',
        distanceInMeters: '',
        costPerMeter: ''
    });

    const [drivers, setDrivers] = useState([]); // Hook for driver list
    const [lastSaved, setLastSaved] = useState(null); // Hook for success display
    const [loading, setLoading] = useState(false); // Hook for submit status

    // 2. Fetch drivers from backend on component mount
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/drivers');
                setDrivers(response.data);
            } catch (err) {
                console.error("Failed to load drivers:", err);
            }
        };
        fetchDrivers();
    }, []);

    // 3. Handle input changes for text and nested driver object
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'driverId') {
            setFormData({ ...formData, driver: { id: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // 4. Submit form and handle numeric conversions
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                trackingNumber: formData.trackingNumber,
                deliveryAddress: formData.deliveryAddress,
                status: formData.status,
                driver: { id: parseInt(formData.driver.id) },
                length: parseFloat(formData.length),
                width: parseFloat(formData.width),
                height: parseFloat(formData.height),
                distanceInMeters: parseFloat(formData.distanceInMeters),
                costPerMeter: parseFloat(formData.costPerMeter)
            };

            // Check if shipment exists to decide between POST (Create) or PUT (Update)
            let response;
            try {
                // Attempt to find if tracking number exists
                const checkExist = await axios.get(`http://localhost:8080/api/shipments/track/${formData.trackingNumber}`);

                if (checkExist.data) {
                    // If found, UPDATE existing record
                    response = await axios.put(`http://localhost:8080/api/shipments/${checkExist.data.id}`, payload);
                    alert("Existing Shipment Updated!");
                }
            } catch (err) {
                // If 404 error, it means it doesn't exist, so CREATE new
                response = await axios.post('http://localhost:8080/api/shipments', payload);
                alert("New Shipment Created!");
            }

            setLastSaved(response.data);
        } catch (error) {
            console.error("Submission error:", error.response?.data);
            alert("Error: " + (error.response?.data?.message || "Operation failed."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h3 style={{ color: '#2563eb', marginBottom: '20px' }}>Register Shipment & Calculate Volume Cost</h3>
            <form onSubmit={handleSubmit} style={formStyle}>

                <label style={labelStyle}>Tracking Number</label>
                <input name="trackingNumber" value={formData.trackingNumber} onChange={handleChange} style={inputStyle} required />

                <label style={labelStyle}>Delivery Address</label>
                <input name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} style={inputStyle} required />

                {/* Dimensions Row */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Length (m)</label>
                        <input type="number" step="0.1" name="length" value={formData.length} onChange={handleChange} style={inputStyle} required />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Width (m)</label>
                        <input type="number" step="0.1" name="width" value={formData.width} onChange={handleChange} style={inputStyle} required />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Height (m)</label>
                        <input type="number" step="0.1" name="height" value={formData.height} onChange={handleChange} style={inputStyle} required />
                    </div>
                </div>

                {/* Logistics Row */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Distance (Meters)</label>
                        <input type="number" name="distanceInMeters" value={formData.distanceInMeters} onChange={handleChange} style={inputStyle} required />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Rate per m³</label>
                        <input type="number" step="0.01" name="costPerMeter" value={formData.costPerMeter} onChange={handleChange} style={inputStyle} required />
                    </div>
                </div>

                <label style={labelStyle}>Select Driver</label>
                <select name="driverId" value={formData.driver.id} onChange={handleChange} style={inputStyle} required>
                    <option value="">-- {drivers.length > 0 ? "Choose a Driver" : "Loading Drivers..."} --</option>
                    {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} (ID: {d.id})</option>
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
                    <p><strong>Volume:</strong> {(lastSaved.length * lastSaved.width * lastSaved.height).toFixed(2)} m³</p>
                    <p style={{ color: '#2563eb', fontWeight: 'bold' }}>Total Cost: ${lastSaved.totalCost?.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

// --- Styles ---
const containerStyle = { maxWidth: '500px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const labelStyle = { fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '5px', display: 'block' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' };
const buttonStyle = { padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const resultStyle = { marginTop: '30px', padding: '15px', background: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #2563eb' };

export default ShipmentForm;