import { useState } from "react";
import Navbar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import ARVTreatmentForm from "../components/ARVTreatmentForm.jsx";
import Carousel from "../components/Carousel.jsx";
import CallWidget from "../components/CallWidget";
import ChatWidget from "../components/ChatWidget";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-6">
        {/* Welcome Section */}
        <section className="mb-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
              Chào mừng đến với dịch vụ y tế và điều trị HIV 4AE
            </h1>
            <p className="text-lg text-gray-600">
              Đây là trang chủ. Bạn có thể đăng nhập, đăng ký hoặc xem thông tin dịch vụ.
            </p>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="mb-16">
          <Carousel />
          
        </section>

        {/* ARV Treatment Form Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <ARVTreatmentForm />
        </section>
        
        {/* New ARV Insurance Section */}
        <section className="max-w-6xl mx-auto mb-16 bg-gradient-to-r from-blue-50 to-blue-100 p-6 md:p-8 rounded-xl shadow-lg">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
              ARV BẢO HIỂM Y TẾ
            </h2>
            <p className="text-lg md:text-xl text-blue-700">
              Thủ tục nhanh chóng, không phải chờ đợi, nhận thuốc trong 15 phút
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Benefit 1 */}
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">
                Thủ tục nhanh
              </h3>
              <p className="text-gray-700">
                Không phải chờ đợi, nhận thuốc trong 15 phút
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">
                Chính sách đầy đủ
              </h3>
              <p className="text-gray-700">
                Được hưởng mọi chính sách BHYT như ở bệnh viện
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">
                Miễn phí xét nghiệm
              </h3>
              <p className="text-gray-700">
                Khám và xét nghiệm 12 chỉ số quan trọng hoàn toàn miễn phí
              </p>
            </div>
            
            {/* Benefit 4 */}
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">
                Tài liệu đầy đủ
              </h3>
              <p className="text-gray-700">
                Xem và đọc các tài liệu hướng dẫn chi tiết về ARV
              </p>
            </div>
            
            {/* Benefit 5 */}
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">
                Uy tín hàng đầu
              </h3>
              <p className="text-gray-700">
                Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm
              </p>
            </div>
            
            {/* Benefit 6 */}
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">
                Hỗ trợ tận tình
              </h3>
              <p className="text-gray-700">
                Đội ngũ nhân viên luôn sẵn sàng hỗ trợ bạn 24/7
              </p>
            </div>  
             
          </div>
          <p className="text-base text-gray-500 mt-4">
  Tại 4AE, chúng tôi cam kết mang đến cho bạn dịch vụ y tế chất lượng cao với sự tận tâm và chuyên nghiệp. 
  Với đội ngũ y bác sĩ giàu kinh nghiệm cùng hệ thống cơ sở vật chất hiện đại, chúng tôi không chỉ hỗ trợ điều trị HIV hiệu quả 
  mà còn đồng hành cùng bạn trong suốt hành trình chăm sóc sức khỏe. Mọi thủ tục đều được tối ưu hóa để giúp bạn tiết kiệm thời gian, 
  đảm bảo sự thuận tiện, riêng tư và an toàn tuyệt đối.
</p>

        </section>
      </main>
      
      {/* Floating Widgets */}
      <CallWidget />
      <ChatWidget />
      
      <Footer />
    </div>
  );
}