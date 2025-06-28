import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { authService } from "../services/authService";
import { FaPhone, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaClock, FaEnvelope, FaFacebook, FaYoutube, FaInstagram, FaCalendarAlt } from "react-icons/fa";
import logo from "../assets/logo.jpg";

export default function FullNavbar() {
  const { t, i18n } = useTranslation();
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
    alert(t('nav.logoutSuccess'));
    navigate("/");
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="font-sans sticky top-0 z-50">
      {/* Topbar */}
      <div className="bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] text-white text-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap justify-between items-center">
            {/* Left side - Contact Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <select 
                  className="bg-transparent text-white border-none focus:ring-0 text-sm cursor-pointer"
                  value={i18n.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  <option value="vi" className="bg-[#3B9AB8] text-white">{t('languages.vi')}</option>
                  <option value="en" className="bg-[#3B9AB8] text-white">{t('languages.en')}</option>
                </select>
                <div className="flex items-center text-white/80 hover:text-white transition-colors duration-200">
                  <FaClock className="w-3 h-3 mr-1" />
                  <span className="text-sm">8:00 - 17:00</span>
                </div>
                <a href="mailto:info@trungtamytetonghop.vn" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center">
                  <FaEnvelope className="w-3 h-3 mr-1" />
                  <span className="text-sm">info@trungtamytetonghop.vn</span>
                </a>
                <a href="tel:0943108138" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center">
                  <FaPhone className="w-3 h-3 mr-1" />
                  <span className="text-sm">0943 108 138</span>
                </a>
              </div>
            </div>

            {/* Right side - Social & Quick Links */}
            <div className="flex items-center space-x-4">
              {/* Social Media Links */}
              <div className="flex items-center space-x-3 border-r border-[#3B9AB8]/30 pr-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#3B9AB8]/80 transition-colors duration-300">
                  <FaFacebook className="text-lg" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#3B9AB8]/80 transition-colors duration-300">
                  <FaYoutube className="text-lg" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#3B9AB8]/80 transition-colors duration-300">
                  <FaInstagram className="text-lg" />
                </a>
              </div>

              {/* Quick Links */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate("/appointment-booking")}
                  className="flex items-center gap-2 hover:text-[#3B9AB8]/80 transition-colors duration-300"
                >
                  <FaCalendarAlt className="text-lg" />
                  <span>{t('nav.bookAppointment')}</span>
                </button>
                <button 
                  onClick={() => navigate("/contact-24h")}
                  className="bg-[#3B9AB8] hover:bg-[#2D7A94] text-white px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300"
                >
                  {t('nav.contact24h')}
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
            <button 
              className="flex items-center gap-3 cursor-pointer group border-t-2 border-[#3B9AB8] pt-2 bg-transparent border-0 p-0" 
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="Logo" className="h-12 w-auto" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] bg-clip-text text-transparent group-hover:from-[#2D7A94] group-hover:to-[#3B9AB8] transition-all duration-300">
                {t('nav.companyName')}
              </h1>
            </button>

            {/* Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { path: "/about", label: t('nav.about') },
                { path: "/appointment-booking", label: t('nav.appointment') },
                { path: "/pricing", label: t('nav.pricing') },
                { path: "/services", label: t('nav.services') },
                { path: "/medical", label: t('nav.medical') },
                { path: "/blog", label: t('nav.blog') }
              ].map((item) => (
                <button 
                  key={item.path}
                  onClick={() => navigate(item.path)} 
                  className={`cursor-pointer text-base font-medium transition-all duration-300 relative group bg-transparent border-0 p-0 ${
                    isActive(item.path) 
                      ? 'text-[#3B9AB8]' 
                      : 'text-gray-700 hover:text-[#3B9AB8]'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#3B9AB8] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    isActive(item.path) ? 'scale-x-100' : ''
                  }`}></span>
                </button>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-base text-gray-700 flex items-center">
                    <FaUser className="mr-2 text-[#3B9AB8]" />
                    {t('nav.hello')}, <span className="text-[#3B9AB8] font-medium ml-1">{user.username}</span>
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <FaSignOutAlt />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] text-white px-6 py-2.5 rounded-lg hover:from-[#2D7A94] hover:to-[#3B9AB8] text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <FaSignInAlt />
                    <span>{t('nav.login')}</span>
                  </button>
                  
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2.5 rounded-lg hover:from-gray-700 hover:to-gray-800 text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <FaUserPlus />
                    <span>{t('nav.register')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>    </div>
  );
}