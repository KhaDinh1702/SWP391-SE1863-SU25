import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaShieldAlt, FaUserShield, FaFileContract, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import boYTeLogo from '../assets/bo-y-te.jpg';
import boCongThuongLogo from '../assets/bo-cong-thuong.png';

const Footer = () => {
  const locations = [
    {
      title: "3AE QUẬN 5",
      address: "Số 104 Trần Bình Trọng, P.1, Quận 5",
      hours: "8:00 – 20:00 (Thứ 2 – CN)",
      map: "https://maps.app.goo.gl/r4HqLmE7puGDJmJp7",
      phone: "0943 108 138 – 028 7303 1869"
    },
    {
      title: "3AE TÂN BÌNH",
      address: "96 Ngô Thị Thu Minh, P.2, Q.Tân Bình",
      hours: "11:00 – 20:00 (Thứ 2 – Thứ 7)",
      map: "https://maps.app.goo.gl/cpQu7AMMPpxBVRM67",
      phone: "0901 386 618 – 028 7304 1869"
    },
    {
      title: "3AE HÀ NỘI",
      address: "15 ngõ 143 Trung Kính, Cầu Giấy, Hà Nội",
      hours: "09:00 – 20:00 (Thứ 2 – Chủ nhật)",
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
        { name: "Đội ngũ bác sĩ", path: "/doctors" },
        { name: "Cơ sở vật chất", path: "/facilities" }
      ]
    },
    {
      title: "Trợ giúp",
      items: [
        { name: "Câu hỏi thường gặp", path: "/faq" },
        { name: "Hướng dẫn đặt lịch", path: "/appointment-guide" },
        { name: "Hướng dẫn thanh toán", path: "/payment-guide" },
        { name: "Chính sách bảo hiểm", path: "/insurance" }
      ]
    },
    {
      title: "Pháp lý",
      items: [
        { name: "Chính sách bảo mật", path: "/privacy" },
        { name: "Điều khoản dịch vụ", path: "/terms" },
        { name: "Giấy phép hoạt động", path: "/licenses" },
        { name: "Khiếu nại", path: "/complaints" }
      ]
    }
  ];

  const certifications = [
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "ISO 9001:2015",
      description: "Chứng nhận hệ thống quản lý chất lượng"
    },
    {
      icon: <FaUserShield className="w-6 h-6" />,
      title: "Bảo mật thông tin",
      description: "Tuân thủ quy định bảo vệ dữ liệu"
    },
    {
      icon: <FaFileContract className="w-6 h-6" />,
      title: "Giấy phép hoạt động",
      description: "Được cấp bởi Sở Y tế TP.HCM"
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#3B9AB8] to-[#2D7A94] text-white">
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Locations */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaMapMarkerAlt className="mr-3 text-[#C46547]" />
              <span>HỆ THỐNG PHÒNG KHÁM 3AE</span>
            </h2>
            <div className="space-y-6">
              {locations.map((loc, index) => (
                <div key={index} className="group">
                  <h3 className="font-bold text-white/90 mb-3">{loc.title}</h3>
                  <div className="space-y-2">
                    <p className="flex items-start text-sm text-white/90">
                      <FaMapMarkerAlt className="flex-shrink-0 w-4 h-4 mr-2 mt-0.5 text-[#C46547]" />
                      <span>{loc.address}</span>
                    </p>
                    <p className="flex items-center text-sm text-white/80">
                      <FaClock className="w-3 h-3 mr-2 text-white/80" />
                      <span>{loc.hours}</span>
                    </p>
                    <p className="flex items-center text-sm text-white/90">
                      <FaPhone className="w-3 h-3 mr-2 text-white/80" />
                      <span>{loc.phone}</span>
                    </p>
                    <a 
                      href={loc.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors duration-200 mt-1"
                    >
                      <FaMapMarkerAlt className="w-3 h-3 mr-1 text-white/80" />
                      Xem bản đồ
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          {menuItems.map((section, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">{section.title}</h2>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <Link 
                      to={item.path} 
                      className="text-sm text-white/80 hover:text-white flex items-center transition-colors duration-200 group"
                    >
                      <span className="w-2 h-2 bg-white/80 rounded-full mr-3 group-hover:bg-white transition-all duration-200"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Social */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Liên hệ & Hỗ trợ</h2>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-white/90">
                  <div className="bg-white/10 p-2 rounded-lg mr-3">
                    <FaPhone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Hotline tư vấn</p>
                    <p className="text-white/80">0943 108 138</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-white/90">
                  <div className="bg-white/10 p-2 rounded-lg mr-3">
                    <FaEnvelope className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-white/80">info@trungtamytetonghop.vn</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Kết nối với chúng tôi</h3>
              <div className="flex space-x-4">
                {[
                  { icon: <FaFacebook className="w-5 h-5" />, url: "https://facebook.com" },
                  { icon: <FaTwitter className="w-5 h-5" />, url: "https://twitter.com" },
                  { icon: <FaInstagram className="w-5 h-5" />, url: "https://instagram.com" },
                  { icon: <FaLinkedin className="w-5 h-5" />, url: "https://linkedin.com" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex items-start space-x-4 hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 p-3 rounded-lg text-white">
                {cert.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{cert.title}</h3>
                <p className="text-sm text-white/80">{cert.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/20">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-sm text-white/80">
              &copy; {new Date().getFullYear()} Trung tâm y tế 3AE. All rights reserved.
            </p>
            <p className="text-xs text-white/60 mt-1">
              MST: 0312345678 | GPKD số: 41A123456 do Sở KHĐT TP.HCM cấp ngày 01/01/2020
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <img src={boYTeLogo} alt="Bộ Y Tế" className="h-8 object-contain opacity-90 hover:opacity-100 transition-opacity" />
            <img src={boCongThuongLogo} alt="Bộ Công Thương" className="h-8 object-contain opacity-90 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;