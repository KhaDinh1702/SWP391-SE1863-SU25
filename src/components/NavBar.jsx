import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { FaPhone, FaMapMarkerAlt, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaClock, FaEnvelope, FaFacebook, FaYoutube, FaInstagram, FaCalendarAlt } from "react-icons/fa";

export default function FullNavbar() {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const userData = authService.getCurrentUser();
      setUser(userData);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    alert("Bạn đã đăng xuất thành công");
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="font-sans sticky top-0 z-50">
      {/* Topbar */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap justify-between items-center">
            {/* Left side - Contact Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2 hover:text-blue-200 transition-colors duration-300">
                <FaPhone className="text-lg" />
                <span>0943 108 138</span>
              </div>

              <div className="flex items-center gap-2 hover:text-blue-200 transition-colors duration-300">
                <FaClock className="text-lg" />
                <span>8:00 - 20:00</span>
              </div>

              <div className="flex items-center gap-2 hover:text-blue-200 transition-colors duration-300">
                <FaEnvelope className="text-lg" />
                <span>info@trungtamytetonghop.vn</span>
              </div>
            </div>

            {/* Right side - Social & Quick Links */}
            <div className="flex items-center space-x-4">
              {/* Social Media Links */}
              <div className="flex items-center space-x-3 border-r border-blue-700 pr-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors duration-300">
                  <FaFacebook className="text-lg" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors duration-300">
                  <FaYoutube className="text-lg" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors duration-300">
                  <FaInstagram className="text-lg" />
                </a>
              </div>

              {/* Quick Links */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate("/appointment-booking")}
                  className="flex items-center gap-2 hover:text-blue-200 transition-colors duration-300"
                >
                  <FaCalendarAlt className="text-lg" />
                  <span>Đặt lịch khám</span>
                </button>
                <button 
                  onClick={() => navigate("/contact-24h")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300"
                >
                  Liên hệ 24/7
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className={`bg-white shadow-md transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => navigate("/")}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                Dịch vụ y tế và điều trị HIV
              </h1>
            </div>

            {/* Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { path: "/about", label: "Giới thiệu" },
                { path: "/appointment-booking", label: "Đặt lịch hẹn"},
                { path: "/pricing", label: "Bảng giá" },
                { path: "/services", label: "Dịch vụ" },
                { path: "/medical", label: "Nhà thuốc" },
                { path: "/blog", label: "Blog Kiến thức" }
              ].map((item) => (
                <span 
                  key={item.path}
                  onClick={() => navigate(item.path)} 
                  className={`cursor-pointer text-base font-medium transition-all duration-300 relative group ${
                    isActive(item.path) 
                      ? 'text-blue-700' 
                      : 'text-gray-700 hover:text-blue-700'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    isActive(item.path) ? 'scale-x-100' : ''
                  }`}></span>
                </span>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-base text-gray-700 flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    Xin chào, <span className="text-blue-700 font-medium ml-1">{user.username}</span>
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <FaSignOutAlt />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <FaSignInAlt />
                    <span>Đăng nhập</span>
                  </button>
                  
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2.5 rounded-lg hover:from-gray-700 hover:to-gray-800 text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <FaUserPlus />
                    <span>Đăng ký</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}