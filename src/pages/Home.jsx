import { useState } from "react";
import Navbar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import Carousel from "../components/home/Carousel.jsx";
import CallWidget from "../components/home/CallWidget";
import ChatWidget from "../components/home/ChatWidget";
import PatientProfile from "../components/patient/PatientProfile.jsx";
import newsData from "../data/newsData";
import doctorsData from "../data/doctorsData";
import DoctorCarousel from "../components/home/DoctorCarousel.jsx";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { FaArrowRight, FaShieldAlt, FaFileAlt, FaUserMd, FaHeadset, FaAward, FaPhone } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800">
      <Navbar />
      {loggedIn && <PatientProfile />}

      <main className="flex-grow p-4 md:p-6">
        {/* Hero Section */}
        <section className="mb-16 relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 opacity-95"></div>
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 animate-pulse"></div>
          
          {/* Content Container */}
          <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-32">
            <div className="text-center space-y-8">
              {/* Text Content */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight animate-fade-in">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                    Chào mừng đến với
                  </span>
                  <br />
                  <span className="text-white">
                    Dịch vụ y tế và điều trị HIV 3AE
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-200 leading-relaxed animate-fade-in-up">
                  {loggedIn 
                    ? "Khám phá thông tin dịch vụ y tế đáng tin cậy của chúng tôi"
                    : "Đăng nhập, đăng ký, hoặc khám phá thông tin dịch vụ đáng tin cậy"
                  }
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="mb-16 transform hover:scale-[1.02] transition-all duration-500">
          <Carousel />
        </section>
             {/* CTA Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Bạn cần tư vấn?
          </h2>
          <p className="text-xl text-blue-700 mb-8">
            Đội ngũ y tế của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <FaPhone className="text-lg" />
              <span>Gọi ngay: 0943 108 138</span>
            </button>
            <button 
              onClick={() => navigate("/appointment-booking")}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <FaFileAlt className="text-lg" />
              <span>Đặt lịch khám</span>
            </button>
          </div>
        </section>

        {/* ARV Insurance Info Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-white/90 backdrop-blur-md border border-blue-100 p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-900">
              ARV BẢO HIỂM Y TẾ
            </h2>
            <p className="text-xl text-blue-700">
              Thủ tục nhanh chóng – Nhận thuốc trong 15 phút – Không phải chờ đợi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShieldAlt className="text-3xl text-blue-600" />,
                title: "Thủ tục nhanh",
                desc: "Không phải chờ đợi, nhận thuốc trong 15 phút",
              },
              {
                icon: <FaFileAlt className="text-3xl text-blue-600" />,
                title: "Chính sách đầy đủ",
                desc: "Hưởng mọi quyền lợi BHYT như bệnh viện công",
              },
              {
                icon: <FaAward className="text-3xl text-blue-600" />,
                title: "Miễn phí xét nghiệm",
                desc: "12 chỉ số quan trọng hoàn toàn miễn phí",
              },
              {
                icon: <FaFileAlt className="text-3xl text-blue-600" />,
                title: "Tài liệu đầy đủ",
                desc: "Truy cập tài liệu ARV hướng dẫn chi tiết",
              },
              {
                icon: <FaUserMd className="text-3xl text-blue-600" />,
                title: "Uy tín hàng đầu",
                desc: "Đội ngũ bác sĩ chuyên môn cao, tận tâm",
              },
              {
                icon: <FaHeadset className="text-3xl text-blue-600" />,
                title: "Hỗ trợ tận tình",
                desc: "Nhân viên luôn sẵn sàng hỗ trợ 24/7",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-2 hover:bg-blue-50/50"
              >
                <div className="mb-4 transform hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
            
          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-inner">
            <p className="text-base text-gray-700 text-justify leading-relaxed">
              Tại 3AE, chúng tôi cam kết mang đến cho bạn dịch vụ y tế chất lượng cao với sự tận tâm và chuyên nghiệp.
              Với đội ngũ y bác sĩ giàu kinh nghiệm cùng hệ thống cơ sở vật chất hiện đại, chúng tôi không chỉ hỗ trợ điều trị HIV hiệu quả
              mà còn đồng hành cùng bạn trong suốt hành trình chăm sóc sức khỏe.
              Mọi thủ tục đều được tối ưu hóa để giúp bạn tiết kiệm thời gian, đảm bảo sự thuận tiện, riêng tư và an toàn tuyệt đối.
            </p>
          </div>
        </section>

        {/* Doctors Section */}
        <section className="py-16 bg-gradient-to-br from-white to-blue-50 text-center mb-20 max-w-6xl mx-auto rounded-3xl shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-900">
            ĐỘI NGŨ Y TẾ TẠI 3AE
          </h2>
          <p className="text-xl text-teal-600 font-semibold mb-10">
            CHUYÊN GIA TẬN TÂM VÀ CHUYÊN NGHIỆP
          </p>

          <DoctorCarousel />
        </section>

        {/* News Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-white/90 backdrop-blur-md border border-blue-100 p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-900">
              Tin tức về HIV/AIDS
            </h2>
            <p className="text-xl text-blue-700">
              Cập nhật kiến thức, chính sách và xu hướng mới nhất trong điều trị HIV
            </p>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-6 min-w-max">
              {newsData.map((news, index) => (
                <div
                  key={index}
                  className="min-w-[320px] max-w-[320px] bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col transform hover:-translate-y-2 hover:bg-blue-50/50"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2 line-clamp-2">{news.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{news.date}</p>
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{news.desc}</p>

                  <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium mt-auto flex items-center gap-2 group"
                  >
                    <span>Đọc thêm</span>
                    <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      {/* Floating Widgets */}
      <CallWidget />
      <ChatWidget />

      <Footer />
    </div>
  );
}