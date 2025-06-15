import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUsers, FaUserMd, FaHeartbeat, FaHandHoldingHeart } from "react-icons/fa";
import logo from "../assets/logo.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3B9AB8]/10 to-white font-sans px-4 py-8 max-w-6xl mx-auto text-gray-800 md:px-8 md:py-12">
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="inline-flex items-center px-8 py-4 bg-white text-[#3B9AB8] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group hover:bg-[#3B9AB8]/10"
        >
          <FaArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Quay lại trang chủ</span>
        </Link>
      </div>

      {/* Clinic Name and Tagline */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-6">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#3B9AB8] animate-fade-in">
            Giới thiệu về dịch vụ y tế và điều trị HIV 3AE 
          </h1>
        </div>
        <div className="text-xl md:text-2xl font-medium text-[#3B9AB8] mb-8 flex flex-wrap justify-center gap-4">
          <span className="inline-block px-4 py-2 bg-[#3B9AB8]/10 rounded-full hover:bg-[#3B9AB8]/20 transition-colors duration-300">THÂN THIỆN</span>
          <span className="inline-block px-4 py-2 bg-[#3B9AB8]/10 rounded-full hover:bg-[#3B9AB8]/20 transition-colors duration-300">TÂM TÌNH</span>
          <span className="inline-block px-4 py-2 bg-[#3B9AB8]/10 rounded-full hover:bg-[#3B9AB8]/20 transition-colors duration-300">THẤU CẢM</span>
          <span className="inline-block px-4 py-2 bg-[#3B9AB8]/10 rounded-full hover:bg-[#3B9AB8]/20 transition-colors duration-300">TRÁCH NHIỆM</span>
          <span className="inline-block px-4 py-2 bg-[#3B9AB8]/10 rounded-full hover:bg-[#3B9AB8]/20 transition-colors duration-300">CHUYÊN NGHIỆP</span>
        </div>
      </div>

      {/* Clinic Introduction */}
      <div className="bg-white rounded-2xl p-8 md:p-10 mb-16 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
        <p className="text-lg md:text-xl leading-relaxed text-center text-gray-700">
          Phòng khám đa khoa chúng tôi là mô hình chăm sóc sức khỏe cộng đồng bền vững do sự hợp tác của các tổ chức dựa vào cộng đồng (CBO) thành lập. 
          3AE đã phát triển được 6 chi nhánh tại TP.HCM và TP Hà Nội.
        </p>
      </div>

      {/* History Section */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#3B9AB8] mb-8 pb-2 border-b-2 border-[#3B9AB8]/20">
          Lịch sử hình thành
        </h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-[1.02] transition-transform duration-300">
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            3AE được thành lập năm 2010 với sứ mệnh cung cấp dịch vụ y tế chất lượng cao cho cộng đồng, 
            đặc biệt tập trung vào chăm sóc sức khỏe cho nhóm người có HIV. 
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            Từ một phòng khám nhỏ tại Quận 5, TP.HCM, sau hơn 10 năm phát triển, 
            chúng tôi tự hào là hệ thống phòng khám tư nhân tiên phong trong điều trị HIV 
            bằng bảo hiểm y tế với 6 cơ sở trên cả nước.
          </p>
        </div>
      </div>

      {/* Highlight Section */}
      <div className="text-center bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] text-white rounded-2xl p-10 mb-16 shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          PHÒNG KHÁM TƯ NHÂN ĐẦU TIÊN ĐIỀU TRỊ ARV BẰNG BHYT
        </h2>
        <p className="text-lg md:text-xl">
          Tiên phong trong điều trị HIV/AIDS với bảo hiểm y tế - Chất lượng quốc tế - Chi phí hợp lý
        </p>
      </div>

      {/* Services Section */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#3B9AB8] mb-8 pb-2 border-b-2 border-[#3B9AB8]/20">
          Dịch vụ nổi bật
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="text-[#3B9AB8] mb-4">
              <FaHeartbeat className="text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#3B9AB8] mb-4">Điều trị HIV/AIDS</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-[#3B9AB8] mr-2">•</span>
                <span>Cấp phát thuốc ARV bằng BHYT</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3B9AB8] mr-2">•</span>
                <span>Tư vấn và xét nghiệm HIV</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3B9AB8] mr-2">•</span>
                <span>Điều trị dự phòng trước phơi nhiễm (PrEP)</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="text-[#3B9AB8] mb-4">
              <FaUserMd className="text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#3B9AB8] mb-4">Khám đa khoa</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-[#3B9AB8] mr-2">•</span>
                <span>Khám và điều trị bệnh thông thường</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3B9AB8] mr-2">•</span>
                <span>Tầm soát các bệnh lây nhiễm</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3B9AB8] mr-2">•</span>
                <span>Tiêm chủng vắc xin</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="text-[#3B9AB8] mb-4">
              <FaHandHoldingHeart className="text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#3B9AB8] mb-4">Hỗ trợ cộng đồng</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-[#3B9AB8] mr-2">•</span>
                <span>Tư vấn tâm lý</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3B9AB8] mr-2">•</span>
                <span>Nhóm hỗ trợ bệnh nhân</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3B9AB8] mr-2">•</span>
                <span>Chương trình giáo dục sức khỏe</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="bg-white rounded-2xl p-8 md:p-10 mb-16 shadow-lg">
        <h3 className="text-2xl font-semibold text-center text-[#3B9AB8] mb-10">
          Những con số ấn tượng
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-[#3B9AB8]/10 rounded-xl transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-[#3B9AB8] mb-3">10,000+</div>
            <div className="text-gray-700">Bệnh nhân HIV đang điều trị</div>
          </div>
          <div className="p-6 bg-[#3B9AB8]/10 rounded-xl transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-[#3B9AB8] mb-3">15+</div>
            <div className="text-gray-700">Năm kinh nghiệm</div>
          </div>
          <div className="p-6 bg-[#3B9AB8]/10 rounded-xl transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-[#3B9AB8] mb-3">98%</div>
            <div className="text-gray-700">Bệnh nhân hài lòng</div>
          </div>
          <div className="p-6 bg-[#3B9AB8]/10 rounded-xl transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-[#3B9AB8] mb-3">50+</div>
            <div className="text-gray-700">Nhân viên y tế</div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="bg-white rounded-2xl p-8 md:p-10 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#3B9AB8] mb-8">
          Liên hệ với chúng tôi
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-medium text-[#3B9AB8] mb-6">Thông tin liên hệ</h3>
            <div className="space-y-6 text-lg">
              <p className="flex items-start group">
                <FaMapMarkerAlt className="w-5 h-5 text-[#3B9AB8] mr-4 mt-1 group-hover:text-[#2D7A94] transition-colors duration-300" />
                <span className="text-gray-700">Trụ sở chính: 104 Trần Bình Trọng, Quận 5, TP.HCM</span>
              </p>
              <p className="flex items-center group">
                <FaPhone className="w-5 h-5 text-[#3B9AB8] mr-4 group-hover:text-[#2D7A94] transition-colors duration-300" />
                <span className="text-gray-700">Hotline: <strong>0943 108 138</strong></span>
              </p>
              <p className="flex items-center group">
                <FaEnvelope className="w-5 h-5 text-[#3B9AB8] mr-4 group-hover:text-[#2D7A94] transition-colors duration-300" />
                <a href="mailto:lienhe@3AEclinic.vn" className="text-[#3B9AB8] hover:text-[#2D7A94] transition-colors duration-300">
                  lienhe@3AEclinic.vn
                </a>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-[#3B9AB8] mb-6">Giờ làm việc</h3>
            <ul className="space-y-4 text-lg">
              <li className="flex justify-between items-center p-3 bg-[#3B9AB8]/10 rounded-lg">
                <span className="text-gray-700">Thứ 2 - Thứ 6:</span>
                <span className="font-medium text-[#3B9AB8]">7:30 - 19:00</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-[#3B9AB8]/10 rounded-lg">
                <span className="text-gray-700">Thứ 7:</span>
                <span className="font-medium text-[#3B9AB8]">7:30 - 17:00</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-[#3B9AB8]/10 rounded-lg">
                <span className="text-gray-700">Chủ nhật:</span>
                <span className="font-medium text-[#3B9AB8]">8:00 - 12:00</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Khẩn cấp:</span>
                <span className="font-medium text-red-600">24/7</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
