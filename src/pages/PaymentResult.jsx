import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Parse MoMo return params from URL
    const params = new URLSearchParams(location.search);
    const resultCode = params.get("resultCode");
    setResult(resultCode === "0" ? "success" : "fail");

    if (resultCode === "0") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8]">
      {result === "success" ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công!</h2>
          <p className="mb-6">Cảm ơn bạn đã thanh toán qua MoMo.<br />Bạn sẽ được chuyển về trang chủ sau vài giây.<br />Nếu không được chuyển tự động, hãy bấm nút bên dưới.</p>
          <Link to="/appointment-booking" className="text-blue-600 underline">Về trang chủ</Link>
        </div>
      ) : result === "fail" ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Thanh toán thất bại!</h2>
          <p className="mb-6">Có lỗi xảy ra trong quá trình thanh toán.</p>
          <Link to="/appointment-booking" className="text-blue-600 underline">Về trang đặt lịch</Link>
        </div>
      ) : (
        <div>Đang kiểm tra kết quả thanh toán...</div>
      )}
    </div>
  );
}