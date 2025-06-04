import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import { FaPhone, FaMapMarkerAlt, FaPlus, FaSearch } from "react-icons/fa";

export default function FullNavbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy user từ localStorage khi component mount
    const syncUser = () => setUser(getUser());

    // Đồng bộ khi có thay đổi ở localStorage (đa tab)
    window.addEventListener("storage", syncUser);
    syncUser(); // chạy lần đầu

    return () => window.removeEventListener("storage", syncUser);
  }, []);

 const handleLogout = () => {
  logout();
  setUser(null);
  // Hiển thị thông báo
  alert('Bạn đã đăng xuất thành công');
  navigate("/login");
};

  return (
    <div>
      {/* Topbar */}
      <div className="bg-[#10269c] text-white text-sm flex justify-between items-center px-6 py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt />
            <span>Hệ thống phòng khám</span>
          </div>
          <div className="flex items-center gap-1">
            <FaPhone />
            <span>0943 108 138</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:underline">
            <FaPlus />
            <span>Đặt lịch khám</span>
          </div>
        </div>
        {/* Search */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ hoặc sản phẩm"
            className="pl-9 pr-3 py-1 w-full rounded-md text-black"
          />
          <FaSearch className="absolute top-2 left-2 text-gray-500" />
        </div>
      </div>

      {/* Main navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          
          <h1 className="text-xl font-bold">Dịch vụ y tế và điều trị HIV GALANT</h1>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-6 text-sm font-semibold">
          <span className="cursor-pointer hover:text-blue-700">Giới thiệu</span> 
          <span className="cursor-pointer hover:text-blue-700">STDs & HIV</span>
          <span className="cursor-pointer hover:text-blue-700">Dịch vụ</span>
          <span className="cursor-pointer hover:text-blue-700">Nhà thuốc</span>
          <span onClick={() => navigate("/blog")} className="cursor-pointer hover:text-blue-700"> Blog Kiến thức</span>
          <span className="cursor-pointer hover:text-blue-700">Liên Hệ</span>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-700">
                👋 Xin chào, <span className="text-blue-700 font-medium">{user.username}</span>
              </span>
              
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-700 text-white px-3 py-1 rounded text-sm hover:bg-blue-800"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
              >
                Đăng ký
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
