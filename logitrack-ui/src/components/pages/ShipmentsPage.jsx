import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import ShipmentTable from '../ShipmentTable.jsx';
import ShipmentForm from '../ShipmentForm.jsx';
import UpdateShipmentStatus from '../UpdateShipmentStatus.jsx';
import { Plus, X } from 'lucide-react';

const ShipmentsPage = () => {
    const { isAdmin, isManager, isDriver, user } = useContext(AuthContext);
    const [shipments, setShipments] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);
    const [showStatusUpdate, setShowStatusUpdate] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [error, setError] = useState(null);

    const fetchShipments = () => {
        const token = localStorage.getItem('token');
        setError(null);
        
        // If user is a driver, fetch only their assigned shipments
        const endpoint = isDriver 
            ? 'http://localhost:8080/api/shipments/my-shipments'
            : 'http://localhost:8080/api/shipments';
        
        console.log('Fetching from:', endpoint, 'User role:', user?.role);

        axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                console.log('Shipments fetched:', response.data);
                setShipments(response.data)
            })
            .catch(error => {
                console.error("Error fetching shipments:", error.response?.status, error.response?.data);
                setError(error.response?.data?.message || error.message);
            });
    };

    useEffect(() => {
        fetchShipments();
    }, [isDriver]);

    const handleEditClick = (shipment) => {
        setEditingShipment(shipment);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStatusUpdateClick = (shipment) => {
        setSelectedShipment(shipment);
        setShowStatusUpdate(true);
    };

    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingShipment(null);
    };

    const handleCloseStatusUpdate = () => {
        setShowStatusUpdate(false);
        setSelectedShipment(null);
    };

    return (
        <div>
            <div style={headerStyle}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0 }}>Shipments Management</h2>
                    <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>
                        {isDriver ? 'Your assigned deliveries' : 'All shipments in the system'}
                    </p>
                </div>

                {/* Show "Add Shipment" button only for Admin and Manager */}
                {(isAdmin || isManager) && (
                    <button
                        onClick={showAddForm ? handleCloseForm : () => setShowAddForm(true)}
                        style={showAddForm ? closeBtnStyle : addBtnStyle}
                    >
                        {showAddForm ? (
                            <><X size={18} style={{ marginRight: '8px' }} /> Close Form</>
                        ) : (
                            <><Plus size={18} style={{ marginRight: '8px' }} /> New Shipment</>
                        )}
                    </button>
                )}
            </div>

            {/* Add/Edit Shipment Form - Only for Admin and Manager */}
            {showAddForm && (isAdmin || isManager) && (
                <div style={formContainerStyle}>
                    <h3 style={{ color: '#0f172a' }}>
                        {editingShipment ? 'Edit Shipment' : 'Add New Shipment'}
                    </h3>
                    <ShipmentForm 
                        selectedShipment={editingShipment} 
                        onSaveSuccess={() => {
                            handleCloseForm();
                            fetchShipments();
                        }} 
                    />
                </div>
            )}

            {/* Status Update Form - Shown when user clicks status update */}
            {showStatusUpdate && selectedShipment && (
                <div style={formContainerStyle}>
                    <h3 style={{ color: '#0f172a' }}>Update Shipment Status</h3>
                    <UpdateShipmentStatus 
                        shipment={selectedShipment} 
                        onSuccess={() => {
                            handleCloseStatusUpdate();
                            fetchShipments();
                        }} 
                    />
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div style={{
                    padding: '12px',
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    color: '#991b1b',
                    fontSize: '14px',
                    marginBottom: '16px'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Shipments Table */}
            {shipments.length === 0 && !error && (
                <div style={{
                    padding: '24px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    color: '#166534',
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    <p>
                        {isDriver 
                            ? 'No shipments assigned to you yet. Check back soon!' 
                            : 'No shipments in the system. Create one to get started!'}
                    </p>
                </div>
            )}

            {shipments.length > 0 && (
            <ShipmentTable 
                shipments={shipments}
                onRefresh={fetchShipments}
                onEdit={handleEditClick}
                onStatusUpdate={handleStatusUpdateClick}
            />
            )}
        </div>
    );
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e2e8f0'
};

const addBtnStyle = {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s'
};

const closeBtnStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s'
};

const formContainerStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

export default ShipmentsPage;
