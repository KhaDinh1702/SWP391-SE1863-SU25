import { useState } from "react";
import Navbar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import ARVTreatmentForm from "../components/ARVTreatmentForm.jsx";
import Carousel from "../components/Carousel.jsx";
import CallWidget from "../components/CallWidget";
import ChatWidget from "../components/ChatWidget";
import newsData from "../data/newsData";
import { FaArrowRight, FaShieldAlt, FaFileAlt, FaUserMd, FaHeadset, FaAward } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800">
      <Navbar />

      <main className="flex-grow p-4 md:p-6">
        {/* Hero Section */}
        <section className="mb-16 text-center py-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
          <div className="max-w-4xl mx-auto px-4 relative">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg animate-fade-in">
              Chào mừng đến với dịch vụ y tế và điều trị HIV 3AE
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Đăng nhập, đăng ký, hoặc khám phá thông tin dịch vụ đáng tin cậy
            </p>
            <button className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition duration-300 shadow-lg flex items-center justify-center gap-2 mx-auto">
              <span>Khám phá ngay</span>
              <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="mb-16 transform hover:scale-[1.02] transition-transform duration-300">
          <Carousel />
        </section>

        {/* ARV Treatment Form */}
        <section className="max-w-6xl mx-auto mb-16">
          <ARVTreatmentForm />
        </section>

        {/* ARV Insurance Info Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-white/90 backdrop-blur-md border border-blue-100 p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
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
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-blue-100 transform hover:-translate-y-1"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 p-6 rounded-2xl">
            <p className="text-base text-gray-700 text-justify leading-relaxed">
              Tại 3AE, chúng tôi cam kết mang đến cho bạn dịch vụ y tế chất lượng cao với sự tận tâm và chuyên nghiệp.
              Với đội ngũ y bác sĩ giàu kinh nghiệm cùng hệ thống cơ sở vật chất hiện đại, chúng tôi không chỉ hỗ trợ điều trị HIV hiệu quả
              mà còn đồng hành cùng bạn trong suốt hành trình chăm sóc sức khỏe.
              Mọi thủ tục đều được tối ưu hóa để giúp bạn tiết kiệm thời gian, đảm bảo sự thuận tiện, riêng tư và an toàn tuyệt đối.
            </p>
          </div>
        </section>

        {/* News Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-white/90 backdrop-blur-md border border-blue-100 p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Tin tức về HIV/AIDS
            </h2>
            <p className="text-xl text-blue-700">
              Cập nhật kiến thức, chính sách và xu hướng mới nhất trong điều trị HIV
            </p>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-6 min-w-max">
              {newsData.map((news, index) => (
                <div
                  key={index}
                  className="min-w-[320px] max-w-[320px] bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-blue-100 flex flex-col transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-300"
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