import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
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
                      href="https://www.google.com/maps/place/Phòng+khám+đa+khoa+GALANT/@10.7551424,106.681645,15z/data=!4m6!3m5!1s0x31752f03471fc295:0xc6fca72acc3cbf1d!8m2!3d10.7551424!4d106.681645!16s%2Fg%2F11f00hl6b5?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D" 
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
                      href="https://www.google.com/maps/place/Phòng+khám+GALANT/@10.7974487,106.6625612,15z/data=!4m6!3m5!1s0x31752f99b707f4c5:0xf82cc92182ee5491!8m2!3d10.7974487!4d106.6625612!16s%2Fg%2F11kmy8szw4?sa=X&ved=1t:2428&ictx=111&utm_campaign=tt-sps&coh=209934&entry=tts" 
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
                      href="https://www.google.com/maps/place/Phòng+Khám+GALANT/@21.0149039,105.7919273,17z/data=!3m1!4b1!4m6!3m5!1s0x3135ab3a86a038d7:0x5c1348702dcd8f87!8m2!3d21.0148989!4d105.7945022!16s%2Fg%2F11tf0vzr3y?entry=tts&g_ep=EgoyMDI0MTIxMS4wIPu8ASoASAFQAw%3D%3D" 
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
                <Link to="/about" className="text-white hover:text-blue-400 transition-colors duration-300 flex items-center group font-bold">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white hover:text-blue-400 transition-colors duration-300 flex items-center group font-bold">
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
                <Link to="/faq" className="text-white hover:text-blue-400 transition-colors duration-300 flex items-center group font-bold">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/appointment-guide" className="text-white hover:text-blue-400 transition-colors duration-300 flex items-center group font-bold">
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
                <Link to="/privacy" className="text-white hover:text-blue-400 transition-colors duration-300 flex items-center group font-bold">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white hover:text-blue-400 transition-colors duration-300 flex items-center group font-bold">
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
                <span>Email: info@trungtamyte.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-white hover:text-blue-400 transition-colors duration-300">
            <FaFacebook className="w-6 h-6" />
          </a>
          <a href="#" className="text-white hover:text-blue-400 transition-colors duration-300">
            <FaTwitter className="w-6 h-6" />
          </a>
          <a href="#" className="text-white hover:text-blue-400 transition-colors duration-300">
            <FaInstagram className="w-6 h-6" />
          </a>
          <a href="#" className="text-white hover:text-blue-400 transition-colors duration-300">
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-blue-900 pt-8 text-center">
          <p className="text-sm text-white font-bold">
            © 2025 Trung Tâm Y Tế. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}