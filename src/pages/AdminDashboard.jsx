import React from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { isAuthenticated, getUserRole } from '../utils/auth';

const AdminDashboard = () => {
  const auth = isAuthenticated();
  const role = getUserRole();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Người dùng</h2>
            <p className="text-gray-600">Quản lý danh sách người dùng, phân quyền.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Xem</button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Bài viết</h2>
            <p className="text-gray-600">Kiểm duyệt hoặc chỉnh sửa bài viết blog.</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Quản lý</button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Thống kê</h2>
            <p className="text-gray-600">Xem tổng quan về hoạt động người dùng và hệ thống.</p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Xem thống kê</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
