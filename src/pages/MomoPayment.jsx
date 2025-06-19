import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MomoPayment() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payUrl = params.get("payUrl");
    if (payUrl) {
      setTimeout(() => {
        window.location.href = payUrl;
      }, 2000);
    } else {
      navigate("/appointment-booking");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8]">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold text-[#A50064] mb-4">
          Đang chuyển đến trang thanh toán MoMo...
        </h2>
        <p className="mb-6">
          Vui lòng chờ trong giây lát hoặc{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const params = new URLSearchParams(location.search);
              const payUrl = params.get("payUrl");
              if (payUrl) window.location.href = payUrl;
            }}
            className="text-[#A50064] underline"
          >
            bấm vào đây
          </a>{" "}
          nếu không được chuyển tự động.
        </p>
      </div>
    </div>
  );
}
