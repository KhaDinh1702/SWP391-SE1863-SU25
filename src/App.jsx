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

// Import các component quản lý từ thư mục con



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
        </Route>

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
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;