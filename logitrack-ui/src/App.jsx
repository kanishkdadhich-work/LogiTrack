import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './components/home.jsx';
import AdminDashboard from './assets/pages/AdminDashboard.jsx';
import ShipmentForm from './components/ShipmentForm.jsx';
import './App.css';
import ShipmentTracker from './components/ShipmentTracker.jsx';
import AddShipmentSimple from './components/AddShipmentSimple.jsx';
import UpdateShipmentStatus from './components/UpdateShipmentStatus.jsx';


function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/status" element={<UpdateShipmentStatus />} />
                <Route path="/admin/new-shipment" element={<AddShipmentSimple />} />
                <Route path="/track" element={<ShipmentTracker />} />
                <Route path="/admin/status" element={<UpdateShipmentStatus />} />
                <Route path="/admin/add-shipment" element={<ShipmentForm />} />
            </Routes>
        </Router>
    );
}

export default App;