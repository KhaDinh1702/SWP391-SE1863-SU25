import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost"; 
import "./index.css";
import AdminDashboard from "./pages/AdminDashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} /> 
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);