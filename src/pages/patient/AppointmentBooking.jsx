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
      <div className="min-h-screen flex items-center justify-center bg-[#3B9AB8]">
        <div className="text-center p-8 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 max-w-md w-full mx-4 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">Cần đăng nhập</h2>
          <p className="text-[#BEE6F5] mb-6">Bạn cần đăng nhập bằng tài khoản bệnh nhân để đặt lịch hẹn.</p>
          <div className="space-y-4">
            <Link
              to="/login"
              className="inline-block w-full px-6 py-3 bg-[#1976D2] hover:bg-[#125ea2] text-white font-semibold rounded-lg transition-colors duration-300 shadow-md"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="inline-block w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-[#1976D2] font-semibold rounded-lg transition-colors duration-300 border border-[#1976D2]/30"
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
      <div className="text-center py-20 min-h-screen flex items-center justify-center bg-[#3B9AB8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BEE6F5] mx-auto"></div>
        <p className="mt-4 text-[#BEE6F5] text-lg font-semibold drop-shadow">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="text-center py-20 min-h-screen flex items-center justify-center bg-[#3B9AB8]">
        <div className="bg-white/20 border border-[#FCA5A5]/40 rounded-2xl p-8 max-w-md mx-auto shadow-2xl backdrop-blur-md">
          <h3 className="text-lg font-semibold text-[#E53935] mb-2 drop-shadow">Không tìm thấy thông tin bệnh nhân</h3>
          <p className="text-[#BEE6F5] mb-4">Vui lòng kiểm tra lại thông tin tài khoản của bạn.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#1976D2] text-white px-4 py-2 rounded hover:bg-[#125ea2] transition-colors shadow-md"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#3B9AB8]">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto p-6 sm:p-10 bg-white/20 rounded-2xl shadow-2xl border border-white/30 backdrop-blur-md">
          {/* Chỉ truyền patientId, không render hoặc import PatientAppointments */}
          <PatientAppointmentForm patientId={patientId} />
        </div>
      </main>
      <Footer />
    </div>
  );  
}
