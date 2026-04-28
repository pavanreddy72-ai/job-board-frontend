import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/Navbar';
import Register from './component/Register';
import Login from './component/Login';
import JobList from './component/JobList';
import JobDetail from './component/JobDetail';
import EmployerDashboard from './component/EmployerDashboard';
import SeekerDashboard from './component/SeekerDashboard';

const PrivateRoute = ({ children, role }) => {
    const token = localStorage.getItem('access');
    const userRole = localStorage.getItem('role');
    if (!token) return <Navigate to="/login" />;
    if (role && userRole !== role) return <Navigate to="/jobs" />;
    return children;
};

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/jobs" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/jobs" element={<JobList />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/employer/dashboard" element={<PrivateRoute role="employer"><EmployerDashboard /></PrivateRoute>} />
                <Route path="/seeker/dashboard" element={<PrivateRoute role="seeker"><SeekerDashboard /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;