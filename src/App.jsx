import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import DoctorDashboard from './pages/DoctorDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import PatientAppointments from './pages/patient/PatientAppointments';
import Medical from './pages/Medicine';
import Pricing from './pages/Pricing';
import Services from './pages/Services';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermOfServices";
import AppointmentBooking from './pages/patient/AppointmentBooking';
import FAQ from './pages/FAQ';
import AppointmentGuide from './pages/AppointmentGuide';
import Contact24h from './pages/Contact24h';
import ProtectedLayout from './components/patient/ProtectedLayout';
import StaffDashboard from './pages/StaffDashboard';
// Import các component quản lý từ thư mục con


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/medical" element={<Medical />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/services" element={<Services />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/privacy" element={<PrivacyPolicy/>} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/appointment-booking" element={<AppointmentBooking />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/appointment-guide" element={<AppointmentGuide />} />
        <Route path="/contact-24h" element={<Contact24h />} />


        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Manager routes */}
        <Route
          path="/manager/*"
          element={
            <ProtectedRoute requiredRoles={["Manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctor routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute requiredRoles={["Doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Patient routes */}
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRoles={["Patient"]}>
              <ProtectedLayout>
                <PatientProfile />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute requiredRoles={["Patient"]}>
              <ProtectedLayout>
                <PatientAppointments />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Staff routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute requiredRoles={["Staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* Add other role-based routes here */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;