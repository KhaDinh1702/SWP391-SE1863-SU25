import { useState } from "react";
import { register } from "../utils/auth"; 
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar.jsx";

function EyeIcon({ visible, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{ cursor: "pointer", position: "absolute", right: 12, top: 10, fontWeight: 'bold', color: '#444' }}
      tabIndex={0}
      aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
    >
      {visible ? "Ẩn" : "Hiện"}
    </span>
  );
}

export default function Register() {
  const [username, setUsername] = useState(""); // email hoặc số điện thoại
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Kiểm tra đơn giản username có phải email hoặc số điện thoại không
  function validateUsername(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{9,15}$/; // 9-15 số
    return emailRegex.test(input) || phoneRegex.test(input);
  }

  const handleRegister = () => {
    if (!validateUsername(username)) {
      setError("Vui lòng nhập email hoặc số điện thoại hợp lệ");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải ít nhất 6 ký tự");
      return;
    }
    const ok = register(username, password);
    if (ok) {
      navigate("/login");
    } else {
      setError("Tài khoản đã tồn tại");
    }
  };

  const handleGoogleRegister = () => {
    alert("Chức năng đăng ký bằng Google chưa được tích hợp");
    // Ở đây bạn sẽ xử lý OAuth với Google sau này
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Đăng ký</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Email hoặc số điện thoại"
          className="border px-3 py-2 w-full mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            className="border px-3 py-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeIcon visible={showPassword} onClick={() => setShowPassword((v) => !v)} />
        </div>
        <button
          onClick={handleRegister}
          className="bg-green-700 text-white w-full py-2 rounded hover:bg-green-800 mb-4"
        >
          Đăng ký
        </button>
        <div className="text-center mb-2 text-gray-500">Hoặc</div>
        <button
          onClick={handleGoogleRegister}
          className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
        >
          {/* Icon Google đơn giản bằng emoji */}
          <span>🔴</span> Đăng ký bằng Google
        </button>
      </div>
    </div>
  );
}
