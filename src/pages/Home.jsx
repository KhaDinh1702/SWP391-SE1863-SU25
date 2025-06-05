import Navbar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import ARVTreatmentForm from "../components/ARVTreatmentForm.jsx";
import ChatWidget from "../components/ChatWidget.jsx";
import Carousel from "../components/Carousel.jsx";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-6">
        {/* Welcome Section */}
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">
            Chào mừng đến với dịch vụ y tế và điều trị HIV 4AE
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Đây là trang chủ. Bạn có thể đăng nhập, đăng ký hoặc xem thông tin dịch vụ.
          </p>
        </section>

         {/* Carousel Section */}
        <section className="mb-12">
          <Carousel />
        </section>

        {/* ARV Treatment Form Section */}
        <section className="max-w-6xl mx-auto mb-12">
          <ARVTreatmentForm />
        </section>

        {/* New ARV Insurance Section */}
        <section className="max-w-6xl mx-auto bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">
              ARV BẢO HIỂM Y TẾ
            </h2>
            <p className="text-xl text-blue-700">
              Thủ tục nhanh chóng, không phải chờ đợi, nhận thuốc trong 15 phút
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">
                Thủ tục nhanh
              </h3>
              <p className="text-gray-700">
                Không phải chờ đợi, nhận thuốc trong 15 phút
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">
                Chính sách đầy đủ
              </h3>
              <p className="text-gray-700">
                Được hưởng mọi chính sách BHYT như ở bệnh viện
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg text-blue-800 mb-3">
                Miễn phí xét nghiệm
              </h3>
              <p className="text-gray-700">
                Khám và xét nghiệm 12 chỉ số quan trọng hoàn toàn miễn phí
              </p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Chat Widget */}
      <ChatWidget />
      
      <Footer />
    </div>
  );
}