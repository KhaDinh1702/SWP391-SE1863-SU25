import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaShieldAlt, FaUserShield, FaFileContract } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import boYTeLogo from '../assets/bo-y-te.jpg';
import boCongThuongLogo from '../assets/bo-cong-thuong.png';

const Footer = () => {
  const locations = [
    {
      title: "3AE QUẬN 5",
      address: "Số 104 Trần Bình Trọng, P.1, Quận 5",
      hours: "⏱ 8:00 – 20:00 (Thứ 2 – CN)",
      map: "https://maps.app.goo.gl/r4HqLmE7puGDJmJp7",
      phone: "0943 108 138 – 028 7303 1869"
    },
    {
      title: "3AE TÂN BÌNH",
      address: "96 Ngô Thị Thu Minh, P.2, Q.Tân Bình",
      hours: "⏱ 11:00 – 20:00 (Thứ 2 – Thứ 7)",
      map: "https://maps.app.goo.gl/cpQu7AMMPpxBVRM67",
      phone: "0901 386 618 – 028 7304 1869"
    },
    {
      title: "3AE HÀ NỘI",
      address: "15 ngõ 143 Trung Kính, Cầu Giấy, Hà Nội",
      hours: "⏱ 09:00 – 20:00 (Thứ 2 – Chủ nhật)",
      map: "https://maps.app.goo.gl/bnQLjuPq6pguu5uE8",
      phone: "0964 269 100 – 028 7300 5222"
    }
  ];

  const menuItems = [
    {
      title: "Trung tâm y tế",
      items: [
        { name: "Giới thiệu", path: "/about" },
        { name: "Dịch vụ", path: "/services" },
        { name: "Hệ thống phòng khám", path: "/locations" }
      ]
    },
    {
      title: "Trợ giúp",
      items: [
        { name: "Câu hỏi thường gặp", path: "/faq" },
        { name: "Hướng dẫn đặt lịch", path: "/appointment-guide" }
      ]
    },
    {
      title: "Pháp lý",
      items: [
        { name: "Chính sách bảo mật", path: "/privacy" },
        { name: "Điều khoản dịch vụ", path: "/terms" }
      ]
    }
  ];

  const certifications = [
    {
      icon: <FaShieldAlt className="w-5 h-5 text-blue-500 dark:text-blue-300" />,
      title: "Chứng nhận ISO 9001:2015",
      description: "Hệ thống quản lý chất lượng"
    },
    {
      icon: <FaUserShield className="w-5 h-5 text-blue-500 dark:text-blue-300" />,
      title: "Bảo mật thông tin",
      description: "Tuân thủ quy định về bảo vệ dữ liệu"
    },
    {
      icon: <FaFileContract className="w-5 h-5 text-blue-500 dark:text-blue-300" />,
      title: "Giấy phép hoạt động",
      description: "Được cấp bởi Sở Y tế TP.HCM"
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#0f1a5f] dark:to-[#0a1238] border-t border-blue-100 dark:border-blue-900/50">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Locations - Adjusted to match height */}
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-blue-800 dark:text-blue-100 mb-4">HỆ THỐNG DỊCH VỤ Y TẾ 3AE</h2>
            <div className="flex-grow space-y-6">
              {locations.map((loc, index) => (
                <div key={index} className="group">
                  <h3 className="font-bold text-blue-700 dark:text-blue-200 mb-1">{loc.title}</h3>
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-300 mt-1" />
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-100">{loc.address}</p>
                      <p className="text-sm text-blue-500 dark:text-blue-200">{loc.hours}</p>
                      <div className="flex items-center mt-1">
                        <FaPhone className="w-3 h-3 mr-1 text-blue-500 dark:text-blue-300" />
                        <p className="text-sm text-blue-600 dark:text-blue-100">{loc.phone}</p>
                      </div>
                      <a 
                        href={loc.map}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors duration-200"
                      >
                        <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                        Xem bản đồ
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          {menuItems.map((section, index) => (
            <div key={index} className="flex flex-col">
              <h2 className="text-lg font-bold text-blue-800 dark:text-blue-100 mb-4">{section.title}</h2>
              <ul className="flex-grow space-y-2">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <Link 
                      to={item.path} 
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-200 dark:hover:text-blue-100 flex items-center transition-colors duration-200"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-blue-800 dark:text-blue-100 mb-4">Liên hệ</h2>
            <div className="flex-grow space-y-3">
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-200">
                <FaPhone className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-300" />
                <span>Hotline: 0943 108 138</span>
              </div>
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-200">
                <FaEnvelope className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-300" />
                <span>info@trungtamytetonghop.vn</span>
              </div>
              <div className="flex space-x-4 mt-4">
                <a href="https://facebook.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors duration-200">
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors duration-200">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors duration-200">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors duration-200">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-white/50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start space-x-3">
              <div className="flex-shrink-0">
                {cert.icon}
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-sm">{cert.title}</h3>
                <p className="text-blue-600 dark:text-blue-300 text-xs mt-1">{cert.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-blue-600 dark:text-blue-300 border-t border-blue-200 dark:border-blue-800/50 pt-6">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Trung tâm y tế GALANT. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <img src={boYTeLogo} alt="Bộ Y Tế" className="h-8 object-contain opacity-90 hover:opacity-100 transition-opacity" />
            <img src={boCongThuongLogo} alt="Bộ Công Thương" className="h-8 object-contain opacity-90 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;