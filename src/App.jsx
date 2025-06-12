import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import PatientProfile from './pages/PatientProfile';
import PatientAppointments from './pages/PatientAppointments';
import Medical from './pages/Medicine';
import Pricing from './pages/Pricing';
import Services from './pages/Services';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermOfServices";
import AppointmentBooking from "./pages/AppointmentBooking";
import FAQ from './pages/FAQ';
import AppointmentGuide from './pages/AppointmentGuide';
import Contact24h from './pages/Contact24h';
import ProtectedLayout from './components/ProtectedLayout';
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
          path="/admin/*"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <AdminDashboard />
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
          path="/patient/dashboard"
          element={
            <ProtectedRoute requiredRoles={["Patient"]}>
              <ProtectedLayout>
                <PatientDashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;