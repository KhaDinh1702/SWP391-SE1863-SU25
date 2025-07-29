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
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8]">
      {result === "success" ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công!</h2>
          <p className="mb-6">Cảm ơn bạn đã thanh toán qua MoMo.</p>
          <Link to="/" className="text-blue-600 underline">Về trang chủ</Link>
        </div>
      ) : result === "fail" ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Thanh toán thất bại!</h2>
          <p className="mb-6">Có lỗi xảy ra trong quá trình thanh toán.</p>
          <Link to="/" className="text-blue-600 underline">Về trang chủ</Link>
        </div>
      ) : (
        <div>Đang kiểm tra kết quả thanh toán...</div>
      )}
    </div>
  );
}