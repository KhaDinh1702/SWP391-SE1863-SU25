import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#10269c] dark:to-[#0a1b6d] border-t border-gray-200 dark:border-blue-900">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Medical Center */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wider">
              Trung tâm y tế
            </h2>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wider">
              Trợ giúp
            </h2>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Hướng dẫn đặt lịch
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wider">
              Pháp lý
            </h2>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Điều khoản dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wider">
              Liên hệ
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <FaMapMarkerAlt className="w-5 h-5 mr-3 text-blue-600" />
                <span>104 Trần Bình Trọng, Quận 5, TP.HCM</span>
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <FaPhone className="w-5 h-5 mr-3 text-blue-600" />
                <span>Hotline: 0943 108 138</span>
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <FaEnvelope className="w-5 h-5 mr-3 text-blue-600" />
                <span>Email: info@trungtamyte.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            <FaFacebook className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            <FaTwitter className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            <FaInstagram className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-blue-900 pt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Trung Tâm Y Tế. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}