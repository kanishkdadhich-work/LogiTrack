import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PackageTable from '../../components/PackageTable.jsx';
import ShipmentForm from '../../components/ShipmentForm.jsx';
import { Plus, X } from 'lucide-react';

const AdminDashboard = () => {
    const [packages, setPackages] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    // State to track which shipment is being edited
    const [editingShipment, setEditingShipment] = useState(null);

    const fetchData = () => {
        // Updated to use your primary shipments endpoint
        axios.get('http://localhost:8080/api/shipments')
            .then(response => setPackages(response.data))
            .catch(error => console.error("Error fetching shipments:", error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper to handle the "Edit" click from the table
    const handleEditClick = (pkg) => {
        setEditingShipment(pkg);
        setShowAddForm(true); // Open the form view
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
    };

    // Helper to close form and reset edit state
    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingShipment(null);
    };

    return (
        <div className="container" style={{ padding: '20px 0' }}>
            <header style={headerStyle}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Shipment Management</h1>
                    <p style={{ color: '#64748b' }}>Operations Control Center</p>
                </div>
                <button
                    onClick={showAddForm ? handleCloseForm : () => setShowAddForm(true)}
                    style={showAddForm ? cancelBtnStyle : addBtnStyle}
                >
                    {showAddForm ? <><X size={18}/> Close</> : <><Plus size={18}/> New Shipment</>}
                </button>
            </header>

            {showAddForm && (
                <div style={{ marginBottom: '2rem' }}>
                    {/* Pass editingShipment to the form. If null, form acts as "Create New" */}
                    <ShipmentForm
                        selectedShipment={editingShipment}
                        onSaveSuccess={() => {
                            handleCloseForm();
                            fetchData();
                        }}
                    />
                </div>
            )}

            {/* Pass handleEditClick to the table's onEdit prop */}
            <PackageTable
                packages={packages}
                onRefresh={fetchData}
                onEdit={handleEditClick}
            />
        </div>
    );
};

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' };
const addBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
};
const cancelBtnStyle = { ...addBtnStyle, backgroundColor: '#64748b' };

export default AdminDashboard;