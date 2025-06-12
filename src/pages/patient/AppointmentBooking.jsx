import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import PatientAppointmentForm from "../../components/patient/PatientAppointmentForm";
import { userService } from "../../services/userService";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function AppointmentBooking() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchPatientId = async () => {
      if (currentUser && currentUser.role === "Patient") {
        try {
          // Lấy thông tin user từ API
          const userData = await userService.getUserById(currentUser.userId);
          console.log("User data:", userData); // Debug log

          // Kiểm tra và lấy patientId
          if (userData) {
            // Nếu userData có patientId trực tiếp
            if (userData.patientId) {
              setPatientId(userData.patientId);
            }
            // Nếu userData có patient object
            else if (userData.patient && userData.patient.id) {
              setPatientId(userData.patient.id);
            }
            // Nếu userData có id và role là Patient
            else if (userData.id && userData.role === "Patient") {
              setPatientId(userData.id);
            }
          }
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      }
      setLoading(false);
    };

    fetchPatientId();
  }, [currentUser]);

  if (!currentUser || currentUser.role !== "Patient") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-white mb-4">Cần đăng nhập</h2>
          <p className="text-gray-300 mb-6">Bạn cần đăng nhập bằng tài khoản bệnh nhân để đặt lịch hẹn.</p>
          <div className="space-y-4">
            <Link
              to="/login"
              className="inline-block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="inline-block w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Đăng ký tài khoản
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Không tìm thấy thông tin bệnh nhân</h3>
          <p className="text-gray-600 mb-4">Vui lòng kiểm tra lại thông tin tài khoản của bạn.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar />
      <main className="flex-grow">
        <PatientAppointmentForm patientId={patientId} />
      </main>
      <Footer />
    </div>
  );
}
