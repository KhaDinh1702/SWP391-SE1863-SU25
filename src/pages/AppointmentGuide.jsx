import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUserPlus, FaCheckCircle, FaClock, FaInfoCircle } from 'react-icons/fa';
import FullNavbar from '../components/NavBar';
import Footer from '../components/Footer';

const AppointmentGuide = () => {
  const steps = [
    {
      icon: <FaUserPlus className="w-8 h-8 text-blue-400" />,
      title: "Đăng ký tài khoản",
      description: "Tạo tài khoản trên hệ thống để có thể đặt lịch hẹn. Bạn cần cung cấp thông tin cá nhân cơ bản và xác thực email."
    },
    {
      icon: <FaCalendarAlt className="w-8 h-8 text-blue-400" />,
      title: "Chọn dịch vụ và thời gian",
      description: "Lựa chọn dịch vụ khám bệnh phù hợp và thời gian hẹn thuận tiện cho bạn. Hệ thống sẽ hiển thị các khung giờ còn trống."
    },
    {
      icon: <FaCheckCircle className="w-8 h-8 text-blue-400" />,
      title: "Xác nhận lịch hẹn",
      description: "Kiểm tra lại thông tin và xác nhận lịch hẹn. Bạn sẽ nhận được email xác nhận với mã hẹn."
    }
  ];

  const importantNotes = [
    "Đặt lịch trước ít nhất 24 giờ để được phục vụ tốt nhất",
    "Mang theo CMND/CCCD khi đến khám",
    "Đến trước giờ hẹn 15 phút để làm thủ tục",
    "Có thể hủy hoặc đổi lịch hẹn trước 12 giờ"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3B9AB8]/10 to-white font-sans">
      {/* NavBar */}
      <FullNavbar />
      
      {/* Main Content */}
      <div className="px-4 py-8 max-w-6xl mx-auto text-gray-800 md:px-8 md:py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#3B9AB8] mb-4">Hướng Dẫn Đặt Lịch</h1>
          <p className="text-xl md:text-2xl font-medium text-[#3B9AB8]">Quy trình đặt lịch hẹn khám bệnh đơn giản và nhanh chóng</p>
        </div>

      {/* Steps */}
      <div className="space-y-8 mb-12">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-8 flex items-start space-x-4 hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex-shrink-0">
              {step.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#3B9AB8] mb-2">
                {index + 1}. {step.title}
              </h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Important Notes */}
      <div className="bg-[#3B9AB8]/10 rounded-2xl p-8 border border-[#3B9AB8]/20 mb-12">
        <div className="flex items-center mb-4">
          <FaInfoCircle className="w-6 h-6 text-[#3B9AB8] mr-2" />
          <h2 className="text-xl font-bold text-[#3B9AB8]">Lưu ý quan trọng</h2>
        </div>
        <ul className="space-y-3">
          {importantNotes.map((note, index) => (
            <li key={index} className="flex items-start">
              <FaClock className="w-5 h-5 text-[#3B9AB8] mr-3 mt-1" />
              <span className="text-gray-700">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="mt-12 text-center">
        <Link
          to="/appointment-booking"
          className="inline-flex items-center px-8 py-3 bg-[#3B9AB8] hover:bg-[#2D7A94] text-white font-bold rounded-lg transition-colors duration-300 text-lg"
        >
          <FaCalendarAlt className="w-5 h-5 mr-2" />
          Đặt lịch ngay
        </Link>
      </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppointmentGuide; 