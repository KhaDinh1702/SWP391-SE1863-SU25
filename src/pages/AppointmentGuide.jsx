import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUserPlus, FaCheckCircle, FaClock, FaInfoCircle } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="flex justify-start mb-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại trang chủ
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-white mb-4">Hướng Dẫn Đặt Lịch</h1>
          <p className="text-xl text-gray-300">Quy trình đặt lịch hẹn khám bệnh đơn giản và nhanh chóng</p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-blue-600/20 rounded-xl p-6 border border-blue-500/20"
        >
          <div className="flex items-center mb-4">
            <FaInfoCircle className="w-6 h-6 text-blue-400 mr-2" />
            <h2 className="text-xl font-bold text-white">Lưu ý quan trọng</h2>
          </div>
          <ul className="space-y-3">
            {importantNotes.map((note, index) => (
              <li key={index} className="flex items-start">
                <FaClock className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                <span className="text-gray-300">{note}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            to="/appointment-booking"
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-300 text-lg"
          >
            <FaCalendarAlt className="w-5 h-5 mr-2" />
            Đặt lịch ngay
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentGuide; 