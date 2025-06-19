import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Parse MoMo return params from URL
    const params = new URLSearchParams(location.search);
    const errorCode = params.get("errorCode");
    setResult(errorCode === "0" ? "success" : "fail");

    const momoUrl = res?.PaymentRedirectUrl || res?.payUrl || res?.qrCodeUrl || "https://test-payment.momo.vn/v2/gateway/api/create";
    if (momoUrl && typeof momoUrl === "string" && momoUrl.startsWith("http")) {
      window.location.href = `/momo-payment?payUrl=${encodeURIComponent(momoUrl)}`;
      return;
    }

    const payUrl = params.get("payUrl");
    if (payUrl) {
      setTimeout(() => {
        window.location.href = payUrl;
      }, 2000);
    } else {
      navigate("/appointment-booking");
    }
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8]">
      {result === "success" ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công!</h2>
          <p className="mb-6">Cảm ơn bạn đã thanh toán qua MoMo.</p>
          <Link to="/appointments" className="text-blue-600 underline">Xem lịch hẹn của bạn</Link>
        </div>
      ) : result === "fail" ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Thanh toán thất bại!</h2>
          <p className="mb-6">Có lỗi xảy ra trong quá trình thanh toán.</p>
          <Link to="/appointment-booking" className="text-blue-600 underline">Thử lại</Link>
        </div>
      ) : (
        <div>Đang kiểm tra kết quả thanh toán...</div>
      )}
    </div>
  );
}
