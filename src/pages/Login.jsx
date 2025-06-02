import { useState } from "react";
import { login } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar.jsx";
import { authService } from "../services/api.js";

//show/hide password
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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Kiểm tra username có phải email hoặc số điện thoại
  // function validateUsername(input) {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const phoneRegex = /^\d{9,15}$/; // 9-15 số
  //   return emailRegex.test(input) || phoneRegex.test(input);
  // }

 const handleLogin = async () => {
  setError("");

  try {
    const data = await authService.login({username, password});
    
    // Log the response data to console
    console.log("Login response:", data);
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);
    localStorage.setItem("userId", data.userId);

    navigate("/");
  } catch (error) {
    console.error("Login error details:", error); // This will log the full error object
    setError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
  }
};


  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
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
          onClick={handleLogin}
          className="bg-blue-700 text-white w-full py-2 rounded hover:bg-blue-800"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
