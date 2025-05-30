// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import Unauthorized from './components/Unauthorized';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute requiredRoles={['Doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/patient/dashboard" element={
          <ProtectedRoute requiredRoles={['Patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;