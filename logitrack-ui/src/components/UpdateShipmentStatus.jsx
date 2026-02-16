import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { CheckCircle, AlertCircle } from 'lucide-react';

const UpdateShipmentStatus = ({ shipment, onSuccess }) => {
    const { isAdmin, isManager, isDriver } = useContext(AuthContext);
    const [status, setStatus] = useState(shipment?.status || 'CREATED');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const availableStatuses = [
        'CREATED',
        'PROCESSING',
        'SHIPPED',
        'IN_TRANSIT',
        'DELIVERED',
        'CANCELLED'
    ];

    // Drivers can only update to specific statuses
    const getAvailableStatuses = () => {
        if (isDriver && !isAdmin && !isManager) {
            // Drivers can only update these statuses
            return ['IN_TRANSIT', 'DELIVERED'];
        }
        return availableStatuses;
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:8080/api/shipments/track/${shipment.trackingNumber}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage('✅ Status updated successfully!');
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1000);
        } catch (err) {
            setError('❌ ' + (err.response?.data?.message || 'Failed to update status'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={infoCardStyle}>
                <h4 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Shipment Details</h4>
                <div style={detailsGridStyle}>
                    <div>
                        <p style={labelStyle}>Tracking Number</p>
                        <p style={valueStyle}>{shipment.trackingNumber}</p>
                    </div>
                    <div>
                        <p style={labelStyle}>Current Status</p>
                        <p style={valueStyle}>{shipment.status}</p>
                    </div>
                    <div>
                        <p style={labelStyle}>Driver</p>
                        <p style={valueStyle}>{shipment.driver?.name || 'Unassigned'}</p>
                    </div>
                    <div>
                        <p style={labelStyle}>Manager</p>
                        <p style={valueStyle}>{shipment.manager?.username || 'Admin'}</p>
                    </div>
                </div>
            </div>

            {message && (
                <div style={successAlertStyle}>
                    <CheckCircle size={20} style={{ marginRight: '12px' }} />
                    {message}
                </div>
            )}

            {error && (
                <div style={errorAlertStyle}>
                    <AlertCircle size={20} style={{ marginRight: '12px' }} />
                    {error}
                </div>
            )}

            <form onSubmit={handleUpdateStatus} style={formStyle}>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>New Status *</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={selectStyle}
                    >
                        {getAvailableStatuses().map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                    {isDriver && !isAdmin && !isManager && (
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '6px 0 0 0' }}>
                            ℹ️ As a driver, you can only update to: IN_TRANSIT or DELIVERED
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || status === shipment?.status}
                    style={{
                        ...submitBtnStyle,
                        ...(loading || status === shipment?.status ? { opacity: 0.6, cursor: 'not-allowed' } : {})
                    }}
                >
                    {loading ? 'Updating...' : '✓ Update Status'}
                </button>
            </form>
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
};

const infoCardStyle = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    padding: '16px'
};

const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
};

const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    margin: '0 0 4px 0',
    textTransform: 'uppercase'
};

const valueStyle = {
    fontSize: '14px',
    color: '#0f172a',
    margin: 0,
    fontWeight: '500'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
};

const selectStyle = {
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff'
};

const submitBtnStyle = {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s'
};

const successAlertStyle = {
    backgroundColor: '#d1fae5',
    border: '1px solid #6ee7b7',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px'
};

const errorAlertStyle = {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px'
};

export default UpdateShipmentStatus;
//     };
//
//     const fetchShipment = async (tNo = trackingNo) => {
//         if (!tNo) return;
//         setLoading(true);
//         try {
//             const res = await axios.get(`http://localhost:8080/api/shipments/${tNo}`);
//             setShipment(res.data);
//             saveToHistory(res.data);
//         } catch (err) {
//             alert("Shipment not found.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const updateStatus = async (newStatus) => {
//         try {
//             const res = await axios.put(
//                 `http://localhost:8080/api/shipments/track/${shipment.trackingNumber}`,
//                 { ...shipment, status: newStatus }
//             );
//             setShipment(res.data);
//             saveToHistory(res.data);
//         } catch (err) {
//             alert("Failed to update status.");
//         }
//     };
//
//     const currentStepIndex = shipment ? STATUS_STEPS.findIndex(s => s.key === shipment.status) : -1;
//
//     return (
//         <div style={containerStyle}>
//             {/* Header & Search */}
//             <div style={searchSection}>
//                 <h2 style={titleStyle}>Logistics Hub</h2>
//                 <div style={searchHeader}>
//                     <input
//                         placeholder="Search tracking number..."
//                         value={trackingNo}
//                         onChange={(e) => setTrackingNo(e.target.value)}
//                         style={inputStyle}
//                     />
//                     <button onClick={() => fetchShipment()} style={searchButtonStyle}>
//                         {loading ? '...' : 'Track'}
//                     </button>
//                 </div>
//
//                 {/* Local History Tags */}
//                 {history.length > 0 && (
//                     <div style={historyWrapper}>
//                         <span style={historyTitle}>Recent:</span>
//                         {history.map((item) => (
//                             <button
//                                 key={item.trackingNumber}
//                                 onClick={() => { setTrackingNo(item.trackingNumber); fetchShipment(item.trackingNumber); }}
//                                 style={historyTag}
//                             >
//                                 {item.trackingNumber}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>
//
//             <AnimatePresence mode="wait">
//                 {shipment && (
//                     <motion.div
//                         key={shipment.trackingNumber}
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         style={cardStyle}
//                     >
//                         <div style={headerRow}>
//                             <div>
//                                 <span style={idBadge}>ID: #{shipment.id}</span>
//                                 <h3 style={trackingTitle}>{shipment.trackingNumber}</h3>
//                             </div>
//                             <div style={statusDot(STATUS_STEPS[currentStepIndex]?.color)} />
//                         </div>
//
//                         {/* --- ANIMATED STAGE BOXES --- */}
//                         <div style={stageGrid}>
//                             {STATUS_STEPS.map((step, index) => {
//                                 const isCurrent = index === currentStepIndex;
//                                 const isDone = index < currentStepIndex;
//
//                                 return (
//                                     <motion.div
//                                         key={step.key}
//                                         animate={{
//                                             backgroundColor: isCurrent ? step.color : isDone ? "#f1f5f9" : "#fff",
//                                             borderColor: isCurrent ? step.color : "#e2e8f0",
//                                             y: isCurrent ? -5 : 0
//                                         }}
//                                         style={stageBox}
//                                     >
//                                         <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{step.symbol}</div>
//                                         <span style={{
//                                             fontSize: '0.7rem',
//                                             fontWeight: 'bold',
//                                             color: isCurrent ? "#fff" : "#64748b"
//                                         }}>
//                                             {step.label}
//                                         </span>
//                                         {isCurrent && (
//                                             <motion.div
//                                                 layoutId="activeGlow"
//                                                 style={activeGlow}
//                                                 initial={{ opacity: 0 }}
//                                                 animate={{ opacity: 0.2 }}
//                                             />
//                                         )}
//                                     </motion.div>
//                                 );
//                             })}
//                         </div>
//
//                         {/* Control Area */}
//                         <div style={controlArea}>
//                             <p style={labelSmall}>Update Journey State</p>
//                             <div style={selectWrapper}>
//                                 <select
//                                     value={shipment.status}
//                                     onChange={(e) => updateStatus(e.target.value)}
//                                     style={selectStyle}
//                                 >
//                                     {STATUS_STEPS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
//                                 </select>
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };
//
// // --- STYLES ---
// const containerStyle = { maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: '"Plus Jakarta Sans", sans-serif' };
// const searchSection = { marginBottom: '40px' };
// const titleStyle = { fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '20px' };
// const searchHeader = { display: 'flex', gap: '12px' };
// const inputStyle = { flex: 1, padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '1rem', background: '#fff', transition: '0.2s' };
// const searchButtonStyle = { padding: '0 32px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold' };
//
// const historyWrapper = { display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center', flexWrap: 'wrap' };
// const historyTitle = { fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' };
// const historyTag = { padding: '6px 12px', borderRadius: '20px', background: '#f1f5f9', border: 'none', fontSize: '0.75rem', color: '#475569', cursor: 'pointer', fontWeight: '600' };
//
// const cardStyle = { background: '#fff', padding: '40px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)', border: '1px solid #f1f5f9' };
// const headerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' };
// const idBadge = { padding: '4px 10px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', color: '#94a3b8' };
// const trackingTitle = { fontSize: '1.5rem', fontWeight: '800', margin: '8px 0', color: '#1e293b' };
// const statusDot = (color) => ({ width: '12px', height: '12px', borderRadius: '50%', background: color || '#e2e8f0', boxShadow: `0 0 15px ${color}` });
//
// const stageGrid = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '40px' };
// const stageBox = {
//     padding: '20px 10px',
//     borderRadius: '20px',
//     border: '2px solid transparent',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     position: 'relative',
//     overflow: 'hidden'
// };
//
// const activeGlow = { position: 'absolute', inset: 0, background: '#fff' };
//
// const controlArea = { background: '#f8fafc', padding: '24px', borderRadius: '24px' };
// const labelSmall = { fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' };
// const selectWrapper = { position: 'relative' };
// const selectStyle = { width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', cursor: 'pointer', fontWeight: '600', color: '#1e293b', appearance: 'none' };
//
// export default UpdateShipmentStatus;
