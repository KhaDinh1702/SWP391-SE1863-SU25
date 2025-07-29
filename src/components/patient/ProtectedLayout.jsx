import React from 'react';
import PatientProfile from './PatientProfile';
import Navbar from '../NavBar';
import Footer from '../Footer';

export default function ProtectedLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800">
      <Navbar />
      <PatientProfile />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
} 