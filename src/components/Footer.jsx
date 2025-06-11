import React from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import boYTeLogo from '../assets/bo-y-te.jpg';
import boCongThuongLogo from '../assets/bo-cong-thuong.png';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#10269c] dark:to-[#0a1b6d] border-t border-gray-200 dark:border-blue-900">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Clinic Locations */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wider">
              HỆ THỐNG DỊCH VỤ Y TẾ 3AE
            </h2>
            <div className="space-y-6">
              {/* Quan 5 Location */}
              <div className="space-y-2">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="w-5 h-5 mr-3 text-blue-600 mt-1" />
                  <div>
                    <p className="font-bold text-white">Số 104 Trần Bình Trọng, P.1, Quận 5</p>
                    <p className="font-bold text-white">⏱ 8:00 – 20:00 (Thứ 2 – CN)</p>
                    <a
                      href="https://www.google.com/maps/place/Phòng+khám+đa+khoa+GALANT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline font-bold"
                    >
                      🗺️Click tại đây
                    </a>
                    <div className="flex items-center mt-1">
                      <FaPhone className="w-4 h-4 mr-2 text-blue-600" />
                      <p className="font-bold text-white">0943 108 138 – 028 7303 1869</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tan Binh Location */}
              <div className="space-y-2">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="w-5 h-5 mr-3 text-blue-600 mt-1" />
                  <div>
                    <p className="font-bold text-white">96 Ngô Thị Thu Minh, P.2, Q.Tân Bình</p>
                    <p className="font-bold text-white">⏱ 11:00 – 20:00 (Thứ 2 – Thứ 7)</p>
                    <a
                      href="https://www.google.com/maps/place/Phòng+khám+GALANT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline font-bold"
                    >
                      🗺️Click tại đây
                    </a>
                    <div className="flex items-center mt-1">
                      <FaPhone className="w-4 h-4 mr-2 text-blue-600" />
                      <p className="font-bold text-white">0901 386 618 – 028 7304 1869</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ha Noi Location */}
              <div className="space-y-2">
                <h3 className="font-bold text-white">GALANT HÀ NỘI</h3>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="w-5 h-5 mr-3 text-blue-600 mt-1" />
                  <div>
                    <p className="font-bold text-white">15 ngõ 143 Trung Kính, Cầu Giấy, Hà Nội</p>
                    <p className="font-bold text-white">⏱ 09:00 – 20:00 (Thứ 2 – Chủ nhật)</p>
                    <a
                      href="https://www.google.com/maps/place/Phòng+Khám+GALANT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline font-bold"
                    >
                      🗺️Click tại đây
                    </a>
                    <div className="flex items-center mt-1">
                      <FaPhone className="w-4 h-4 mr-2 text-blue-600" />
                      <p className="font-bold text-white">0964 269 100 – 028 7300 5222</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Center */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Trung tâm y tế
            </h2>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white hover:text-blue-400 flex items-center group font-bold">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white hover:text-blue-400 flex items-center group font-bold">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Trợ giúp
            </h2>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-white hover:text-blue-400 flex items-center group font-bold">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/appointment-guide" className="text-white hover:text-blue-400 flex items-center group font-bold">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Hướng dẫn đặt lịch
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Pháp lý
            </h2>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-white hover:text-blue-400 flex items-center group font-bold">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white hover:text-blue-400 flex items-center group font-bold">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Điều khoản dịch vụ
                </Link>
              </li>
            </ul>
            <div className="mt-4 space-y-3">
              <img src={boYTeLogo} alt="Bộ Y Tế" className="h-12 object-contain" />
              <img src={boCongThuongLogo} alt="Bộ Công Thương" className="h-12 object-contain" />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Liên hệ
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center text-white font-bold">
                <FaMapMarkerAlt className="w-5 h-5 mr-3 text-blue-600" />
                <span>104 Trần Bình Trọng, Quận 5, TP.HCM</span>
              </li>
              <li className="flex items-center text-white font-bold">
                <FaPhone className="w-5 h-5 mr-3 text-blue-600" />
                <span>Hotline: 0943 108 138</span>
              </li>
              <li className="flex items-center text-white font-bold">
                <FaEnvelope className="w-5 h-5 mr-3 text-blue-600" />
                <span>Email: info@trungtamytetonghop.vn</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" className="text-white hover:text-blue-400">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" className="text-white hover:text-blue-400">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" className="text-white hover:text-blue-400">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" className="text-white hover:text-blue-400">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center text-white font-bold border-t pt-6 border-blue-800">
          &copy; {new Date().getFullYear()} Trung tâm y tế GALANT. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
