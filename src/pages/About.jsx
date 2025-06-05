import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="font-sans px-8 py-10 max-w-4xl mx-auto text-gray-800">
         <Link to="/" className="text-blue-600 hover:underline flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Về trang chủ
        </Link>
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Giới thiệu về chúng tôi</h1>

      <p className="text-lg mb-4">
        Chào mừng bạn đến với <strong>Dịch vụ y tế và điều trị HIV</strong> – nơi bạn có thể
        tiếp cận các dịch vụ chăm sóc sức khỏe chất lượng cao, uy tín và an toàn.
      </p>

      <p className="text-lg mb-4">
        Chúng tôi là hệ thống phòng khám chuyên sâu trong việc tư vấn, xét nghiệm và điều trị
        các bệnh lây truyền qua đường tình dục (STDs) và HIV/AIDS. Với đội ngũ bác sĩ giàu kinh
        nghiệm và cơ sở vật chất hiện đại, chúng tôi cam kết mang đến cho bạn sự chăm sóc y tế tốt nhất.
      </p>

      <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">Sứ mệnh của chúng tôi</h2>
      <p className="text-lg mb-4">
        Sứ mệnh của chúng tôi là hỗ trợ cộng đồng tiếp cận thông tin chính xác, dịch vụ y tế an toàn và thân thiện,
        nhằm nâng cao nhận thức và giảm thiểu tác động của HIV/AIDS và các bệnh xã hội khác.
      </p>

      <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">Giá trị cốt lõi</h2>
      <ul className="list-disc pl-6 text-lg space-y-2">
        <li>Tận tâm với bệnh nhân</li>
        <li>Bảo mật và tôn trọng</li>
        <li>Chất lượng dịch vụ cao</li>
        <li>Hợp tác và hỗ trợ cộng đồng</li>
      </ul>

      <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">Liên hệ</h2>
      <p className="text-lg">
        Địa chỉ: 123 Đường Y Tế, Quận 1, TP. Hồ Chí Minh <br />
        Hotline: <strong>0943 108 138</strong> <br />
        Email: <a href="mailto:lienhe@dichvuytehiv.vn" className="text-blue-600 hover:underline">lienhe@dichvuytehiv.vn</a>
      </p>

    </div>
  );
}
