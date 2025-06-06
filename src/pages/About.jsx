import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="font-sans px-4 py-8 max-w-5xl mx-auto text-gray-800 md:px-8 md:py-12">
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
            <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang chủ
          </Link>
        </div>

      {/* Clinic Name and Tagline */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
          Giới thiệu về GALANT
        </h1>
        <div className="text-xl md:text-2xl font-medium text-blue-700 mb-6">
          <span className="inline-block mx-2">THÂN THIỆN</span> • 
          <span className="inline-block mx-2">TÂM TÌNH</span> • 
          <span className="inline-block mx-2">THẤU CẢM</span> • 
          <span className="inline-block mx-2">TRÁCH NHIỆM</span> • 
          <span className="inline-block mx-2">CHUYÊN NGHIỆP</span>
        </div>
      </div>

      {/* Clinic Introduction */}
      <div className="bg-blue-50 rounded-xl p-6 md:p-8 mb-12">
        <p className="text-lg md:text-xl leading-relaxed text-center">
          Phòng khám đa khoa chúng tôi là mô hình chăm sóc sức khỏe cộng đồng bền vững do sự hợp tác của các tổ chức dựa vào cộng đồng (CBO) thành lập. 
          GALANT đã phát triển được 6 chi nhánh tại TP.HCM và TP Hà Nội.
        </p>
      </div>
        {/* History Section */}
        <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-6 pb-2 border-b border-blue-200">
                Lịch sử hình thành
            </h2>
        <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-lg leading-relaxed mb-4">
            GALANT được thành lập năm 2010 với sứ mệnh cung cấp dịch vụ y tế chất lượng cao cho cộng đồng, 
            đặc biệt tập trung vào chăm sóc sức khỏe cho nhóm người có HIV. 
            </p>
            <p className="text-lg leading-relaxed">
            Từ một phòng khám nhỏ tại Quận 5, TP.HCM, sau hơn 10 năm phát triển, 
            chúng tôi tự hào là hệ thống phòng khám tư nhân tiên phong trong điều trị HIV 
            bằng bảo hiểm y tế với 6 cơ sở trên cả nước.
            </p>
        </div>
        </div>

      {/* Highlight Section */}
      <div className="text-center bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-xl p-8 mb-12 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          PHÒNG KHÁM TƯ NHÂN ĐẦU TIÊN ĐIỀU TRỊ ARV BẰNG BHYT
        </h2>
        <p className="text-lg md:text-xl">
          Tiên phong trong điều trị HIV/AIDS với bảo hiểm y tế - Chất lượng quốc tế - Chi phí hợp lý
        </p>
      </div>

            

      {/* Branches Section */}
      <section className="mb-12">
  <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-6 pb-2 border-b border-blue-200">
    Dịch vụ nổi bật
  </h2>
  <div className="grid md:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-blue-700 mb-3">Điều trị HIV/AIDS</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>Cấp phát thuốc ARV bằng BHYT</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>Tư vấn và xét nghiệm HIV</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>Điều trị dự phòng trước phơi nhiễm (PrEP)</span>
        </li>
      </ul>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-blue-700 mb-3">Khám đa khoa</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>Khám và điều trị bệnh thông thường</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>Tầm soát các bệnh lây nhiễm</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>Tiêm chủng vắc xin</span>
        </li>
      </ul>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-blue-700 mb-3">Hỗ trợ cộng đồng</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>Tư vấn tâm lý</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>Nhóm hỗ trợ bệnh nhân</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>Chương trình giáo dục sức khỏe</span>
        </li>
      </ul>
    </div>
  </div>
</section>

<div className="bg-white rounded-xl p-6 md:p-8 mb-12 shadow-md">
  <h3 className="text-xl font-semibold text-center text-blue-800 mb-6">
    Những con số ấn tượng
  </h3>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
    <div className="p-4">
      <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
      <div className="text-gray-700">Bệnh nhân HIV đang điều trị</div>
    </div>
    <div className="p-4">
      <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
      <div className="text-gray-700">Năm kinh nghiệm</div>
    </div>
    <div className="p-4">
      <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
      <div className="text-gray-700">Bệnh nhân hài lòng</div>
    </div>
    <div className="p-4">
      <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
      <div className="text-gray-700">Nhân viên y tế</div>
    </div>
  </div>
</div>

      {/* Contact Section */}
      <section className="bg-blue-50 rounded-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-6">
          Liên hệ với chúng tôi
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium text-blue-700 mb-4">Thông tin liên hệ</h3>
            <div className="space-y-4 text-lg">
              <p className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
                </svg>
                <span>Trụ sở chính: 104 Trần Bình Trọng, Quận 5, TP.HCM</span>
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Hotline: <strong>0943 108 138</strong></span>
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:lienhe@4aeclinic.vn" className="text-blue-600 hover:underline">
                  lienhe@4aeclinic.vn
                </a>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-blue-700 mb-4">Giờ làm việc</h3>
            <ul className="space-y-3 text-lg">
              <li className="flex justify-between">
                <span>Thứ 2 - Thứ 6:</span>
                <span>7:30 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span>Thứ 7:</span>
                <span>7:30 - 17:00</span>
              </li>
              <li className="flex justify-between">
                <span>Chủ nhật:</span>
                <span>8:00 - 12:00</span>
              </li>
              <li className="flex justify-between font-medium text-blue-700">
                <span>Khẩn cấp:</span>
                <span>24/7</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
