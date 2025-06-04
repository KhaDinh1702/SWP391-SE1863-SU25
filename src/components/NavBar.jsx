import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import { FaPhone, FaMapMarkerAlt, FaPlus, FaUser } from "react-icons/fa";

export default function FullNavbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userData = getUser();
      setUser(userData);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    alert('Bạn đã đăng xuất thành công');
    navigate("/login");
  };

  return (
    <div className="font-sans">
      {/* Topbar */}
      <div className="bg-[#10269c] text-white text-base flex justify-between items-center px-8 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-lg" />
            <span>Hệ thống phòng khám</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-lg" />
            <span>0943 108 138</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <FaPlus className="text-lg" />
            <span>Đặt lịch khám</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white shadow-md">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <h1 className="text-2xl font-bold text-blue-900">
            Dịch vụ y tế và điều trị HIV GALANT
          </h1>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-8 text-base font-semibold">
          <span className="cursor-pointer hover:text-blue-700 transition-colors duration-200">Giới thiệu</span> 
          <span className="cursor-pointer hover:text-blue-700 transition-colors duration-200">STDs & HIV</span>
          <span className="cursor-pointer hover:text-blue-700 transition-colors duration-200">Dịch vụ</span>
          <span className="cursor-pointer hover:text-blue-700 transition-colors duration-200">Nhà thuốc</span>
          <span 
            onClick={() => navigate("/blog")} 
            className="cursor-pointer hover:text-blue-700 transition-colors duration-200"
          >
            Blog Kiến thức
          </span>
          <span className="cursor-pointer hover:text-blue-700 transition-colors duration-200">Liên Hệ</span>
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
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-base font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-base font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Đăng nhập</span>
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-base font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Đăng ký</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}