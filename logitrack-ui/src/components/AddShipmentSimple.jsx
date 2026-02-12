import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Search, History, CheckCircle, Clock } from 'lucide-react'; // Added for visual flair

const STATUS_STEPS = [
    { label: "Processed", key: "CREATED", color: "bg-indigo-500" },
    { label: "Designing", key: "PROCESSING", color: "bg-purple-500" },
    { label: "Shipped", key: "SHIPPED", color: "bg-pink-500" },
    { label: "En Route", key: "IN_TRANSIT", color: "bg-orange-500" },
    { label: "Arrived", key: "DELIVERED", color: "bg-emerald-500" }
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
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Logistics Hub</h2>
                    <p className="mt-2 text-slate-600">Real-time shipment management and tracking</p>
                </div>

                {/* Search Box */}
                <div className="relative mb-8 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter tracking number (e.g. TRK-12345)..."
                        className="block w-full pl-11 pr-32 py-4 border-none bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
                        value={trackingNo}
                        onChange={(e) => setTrackingNo(e.target.value)}
                    />
                    <button
                        onClick={() => fetchShipment()}
                        disabled={loading}
                        className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:bg-slate-300"
                    >
                        {loading ? 'Searching...' : 'Track'}
                    </button>
                </div>

                {/* History Tags */}
                {history.length > 0 && (
                    <div className="flex items-center gap-3 mb-10 flex-wrap">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <History size={14} /> Recent
                        </span>
                        {history.map(item => (
                            <button
                                key={item.trackingNumber}
                                onClick={() => { setTrackingNo(item.trackingNumber); fetchShipment(item.trackingNumber); }}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm"
                            >
                                {item.trackingNumber}
                            </button>
                        ))}
                    </div>
                )}

                {/* Shipment Card */}
                {shipment && (
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-start">
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 mb-2">
                                    REGISTRY ID #{shipment.id}
                                </span>
                                <h3 className="text-2xl font-black text-slate-900">{shipment.trackingNumber}</h3>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                <Package size={28} />
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50/50">
                            <div className="flex flex-col gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                                        Update Journey State
                                    </label>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {STATUS_STEPS.map((step) => (
                                            <button
                                                key={step.key}
                                                onClick={() => updateStatus(step.key)}
                                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                                    shipment.status === step.key
                                                        ? `border-blue-500 bg-white ring-4 ring-blue-50`
                                                        : 'border-white bg-white hover:border-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${step.color}`} />
                                                    <span className={`text-sm font-bold ${shipment.status === step.key ? 'text-blue-600' : 'text-slate-600'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                                {shipment.status === step.key ? <CheckCircle size={18} className="text-blue-500" /> : <Clock size={18} className="text-slate-300" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateShipmentStatus;