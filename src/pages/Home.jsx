import { useState } from "react";
import Navbar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import ARVTreatmentForm from "../components/ARVTreatmentForm.jsx";
import Carousel from "../components/Carousel.jsx";
import CallWidget from "../components/CallWidget";
import ChatWidget from "../components/ChatWidget";
import newsData from "../data/newsData";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white text-gray-800">
      <Navbar />

      <main className="flex-grow p-4 md:p-6">
        {/* Hero Section */}
        <section className="mb-16 text-center py-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl shadow-lg">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 leading-tight drop-shadow">
              Chào mừng đến với dịch vụ y tế và điều trị HIV 3AE
            </h1>
            <p className="text-xl md:text-2xl text-blue-800 mb-6">
              Đăng nhập, đăng ký, hoặc khám phá thông tin dịch vụ đáng tin cậy
            </p>
            <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition duration-300 shadow-lg">
              Khám phá ngay
            </button>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="mb-16">
          <Carousel />
        </section>

        {/* ARV Treatment Form */}
        <section className="max-w-6xl mx-auto mb-16">
          <ARVTreatmentForm />
        </section>

        {/* ARV Insurance Info Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-white/80 backdrop-blur-md border border-blue-100 p-6 md:p-10 rounded-2xl shadow-2xl">
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
                title: "Thủ tục nhanh",
                desc: "Không phải chờ đợi, nhận thuốc trong 15 phút",
              },
              {
                title: "Chính sách đầy đủ",
                desc: "Hưởng mọi quyền lợi BHYT như bệnh viện công",
              },
              {
                title: "Miễn phí xét nghiệm",
                desc: "12 chỉ số quan trọng hoàn toàn miễn phí",
              },
              {
                title: "Tài liệu đầy đủ",
                desc: "Truy cập tài liệu ARV hướng dẫn chi tiết",
              },
              {
                title: "Uy tín hàng đầu",
                desc: "Đội ngũ bác sĩ chuyên môn cao, tận tâm",
              },
              {
                title: "Hỗ trợ tận tình",
                desc: "Nhân viên luôn sẵn sàng hỗ trợ 24/7",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-blue-100"
              >
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <p className="text-base text-gray-600 text-justify leading-relaxed">
              Tại 3AE, chúng tôi cam kết mang đến cho bạn dịch vụ y tế chất lượng cao với sự tận tâm và chuyên nghiệp.
              Với đội ngũ y bác sĩ giàu kinh nghiệm cùng hệ thống cơ sở vật chất hiện đại, chúng tôi không chỉ hỗ trợ điều trị HIV hiệu quả
              mà còn đồng hành cùng bạn trong suốt hành trình chăm sóc sức khỏe.
              Mọi thủ tục đều được tối ưu hóa để giúp bạn tiết kiệm thời gian, đảm bảo sự thuận tiện, riêng tư và an toàn tuyệt đối.
            </p>
          </div>
        </section>
{/* News Section */}
<section className="max-w-6xl mx-auto mb-20 bg-white/90 backdrop-blur-md border border-blue-100 p-6 md:p-10 rounded-2xl shadow-2xl">
  <div className="text-center mb-8">
    <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
      Tin tức về HIV/AIDS
    </h2>
    <p className="text-xl text-blue-700">
      Cập nhật kiến thức, chính sách và xu hướng mới nhất trong điều trị HIV
    </p>
  </div>

  {/* Horizontal Scroll Container */}
  <div className="overflow-x-auto">
    <div className="flex space-x-6 min-w-max pb-2">
      {newsData.map((news, index) => (
        <div
          key={index}
          className="min-w-[300px] max-w-[300px] bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-blue-100"
        >
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
          <h3 className="text-lg font-semibold text-blue-800 mb-1">{news.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{news.date}</p>
          <p className="text-gray-600 mb-4">{news.desc}</p>
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Đọc thêm →
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