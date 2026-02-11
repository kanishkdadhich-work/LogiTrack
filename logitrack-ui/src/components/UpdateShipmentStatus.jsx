// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
//
// const STATUS_STEPS = [
//     { label: "Processed", key: "CREATED", symbol: "📋", color: "#6366f1" },
//     { label: "Designing", key: "PROCESSING", symbol: "🎨", color: "#a855f7" },
//     { label: "Shipped", key: "SHIPPED", symbol: "📦", color: "#ec4899" },
//     { label: "En Route", key: "IN_TRANSIT", symbol: "🚚", color: "#f59e0b" },
//     { label: "Arrived", key: "DELIVERED", symbol: "🏠", color: "#10b981" }
// ];
//
// const UpdateShipmentStatus = () => {
//     const [trackingNo, setTrackingNo] = useState('');
//     const [shipment, setShipment] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [history, setHistory] = useState([]);
//
//     // Load history on mount
//     useEffect(() => {
//         const savedHistory = JSON.parse(localStorage.getItem('shipment_history') || '[]');
//         setHistory(savedHistory);
//     }, []);
//
//     const saveToHistory = (newShipment) => {
//         const updatedHistory = [
//             newShipment,
//             ...history.filter(item => item.trackingNumber !== newShipment.trackingNumber)
//         ].slice(0, 5); // Keep last 5
//         setHistory(updatedHistory);
//         localStorage.setItem('shipment_history', JSON.stringify(updatedHistory));
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    History,
    Fingerprint,
    ChevronDown,
    PackageSearch,
    Loader2,
    Activity,
    ClipboardCheck,
    Package,
    Truck,
    MapPin,
    Home
} from 'lucide-react';

// Unified constants for the UI and Backend
const STATUS_STEPS = [
    { label: "Processed", key: "CREATED", icon: ClipboardCheck, colorClass: "text-indigo-600", bgClass: "bg-indigo-600" },
    { label: "Designing", key: "PROCESSING", icon: Package, colorClass: "text-purple-600", bgClass: "bg-purple-600" },
    { label: "Shipped", key: "SHIPPED", icon: Truck, colorClass: "text-pink-600", bgClass: "bg-pink-600" },
    { label: "En Route", key: "IN_TRANSIT", icon: MapPin, colorClass: "text-amber-600", bgClass: "bg-amber-600" },
    { label: "Arrived", key: "DELIVERED", icon: Home, colorClass: "text-emerald-600", bgClass: "bg-emerald-600" }
];

const UpdateShipmentStatus = () => {
    const [trackingNo, setTrackingNo] = useState('');
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('shipment_history') || '[]');
        setHistory(savedHistory);
    }, []);

    const saveToHistory = (newShipment) => {
        const updatedHistory = [
            newShipment,
            ...history.filter(item => item.trackingNumber !== newShipment.trackingNumber)
        ].slice(0, 5);
        setHistory(updatedHistory);
        localStorage.setItem('shipment_history', JSON.stringify(updatedHistory));
    };

    const fetchShipment = async (tNo = trackingNo) => {
        if (!tNo) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/shipments/${tNo}`);
            setShipment(res.data);
            saveToHistory(res.data);
        } catch (err) {
            alert("Shipment not found.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            const res = await axios.put(
                `http://localhost:8080/api/shipments/track/${shipment.trackingNumber}`,
                { ...shipment, status: newStatus }
            );
            setShipment(res.data);
            saveToHistory(res.data);
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    const currentStepIndex = shipment ? STATUS_STEPS.findIndex(s => s.key === shipment.status) : -1;

    return (
        <div className="min-h-screen bg-slate-50/50 py-16 px-6">
            <div className="max-w-3xl mx-auto">

                {/* Header Branding */}
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Logistics Hub</h1>
                            <p className="text-slate-500 text-sm font-medium">Global Operations Management</p>
                        </div>
                    </div>
                </header>

                {/* Search Section */}
                <div className="relative group mb-4">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        className="w-full h-16 pl-14 pr-32 bg-white border-2 border-slate-100 rounded-[2rem] text-slate-900 font-semibold shadow-sm focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                        placeholder="Enter tracking number..."
                        value={trackingNo}
                        onChange={(e) => setTrackingNo(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchShipment()}
                    />
                    <button
                        onClick={() => fetchShipment()}
                        disabled={loading || !trackingNo}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-11 px-8 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all disabled:opacity-30"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Track'}
                    </button>
                </div>

                {/* History Tags */}
                {history.length > 0 && (
                    <div className="flex items-center gap-3 flex-wrap mb-12">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <History className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Recent</span>
                        </div>
                        {history.map((item) => (
                            <button
                                key={item.trackingNumber}
                                onClick={() => { setTrackingNo(item.trackingNumber); fetchShipment(item.trackingNumber); }}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-100 text-slate-600 text-xs font-bold hover:border-indigo-200 hover:text-indigo-600 shadow-sm transition-all"
                            >
                                {item.trackingNumber}
                            </button>
                        ))}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {shipment ? (
                        <motion.div
                            key={shipment.trackingNumber}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden"
                        >
                            <div className="p-8 sm:p-10">
                                <div className="flex items-start justify-between mb-10">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-2">
                                            <Fingerprint className="w-3 h-3" />
                                            Registry ID: #{shipment.id}
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">{shipment.trackingNumber}</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${STATUS_STEPS[currentStepIndex]?.bgClass}`} />
                                        <span className={`text-xs font-black uppercase tracking-widest ${STATUS_STEPS[currentStepIndex]?.colorClass}`}>
                                            {STATUS_STEPS[currentStepIndex]?.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Animated Grid Stages */}
                                <div className="grid grid-cols-5 gap-3 mb-10">
                                    {STATUS_STEPS.map((step, index) => {
                                        const isCurrent = index === currentStepIndex;
                                        const isDone = index < currentStepIndex;
                                        const StepIcon = step.icon;

                                        return (
                                            <motion.div
                                                key={step.key}
                                                animate={{
                                                    backgroundColor: isCurrent ? '#f8fafc' : 'transparent',
                                                    borderColor: isCurrent ? '#6366f1' : '#f1f5f9',
                                                    y: isCurrent ? -5 : 0
                                                }}
                                                className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-colors`}
                                            >
                                                <StepIcon className={`w-6 h-6 mb-3 ${isCurrent || isDone ? step.colorClass : 'text-slate-200'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-tighter text-center leading-tight ${isCurrent ? 'text-slate-900' : 'text-slate-300'}`}>
                                                    {step.label}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Control Panel */}
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Update Journey State</p>
                                    <div className="relative">
                                        <select
                                            value={shipment.status}
                                            onChange={(e) => updateStatus(e.target.value)}
                                            className="w-full h-14 px-6 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm appearance-none cursor-pointer focus:border-indigo-500 outline-none transition-all"
                                        >
                                            {STATUS_STEPS.map(s => (
                                                <option key={s.key} value={s.key}>{s.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <PackageSearch className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-slate-900 font-bold text-lg">No Active Inquiry</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
                                Enter a shipment tracking code above to monitor the real-time logistics pipeline.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UpdateShipmentStatus;
