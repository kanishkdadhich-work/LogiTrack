// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '/home/kanishk/IdeaProjects/LogiTrackDay2/logitrack-ui/src/components/Navbar.jsx'; // Use your new Navbar!
import Home from '/home/kanishk/IdeaProjects/LogiTrackDay2/logitrack-ui/src/components/home.jsx';           // Points to src/pages/home.jsx
import AdminDashboard from '/home/kanishk/IdeaProjects/LogiTrackDay2/logitrack-ui/src/assets/pages/AdminDashboard.jsx'; // Points to src/pages/AdminDashboard.jsx
import '/home/kanishk/IdeaProjects/LogiTrackDay2/logitrack-ui/src/App.css';


function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;