import Navbar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import ARVTreatmentForm from "../components/ARVTreatmentForm.jsx";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Chào mừng đến với dịch vụ y tế và điều trị HIV 4AE</h1>
          <p className="mt-2 text-gray-600">Đây là trang chủ. Bạn có thể đăng nhập, đăng ký hoặc xem thông tin dịch vụ.</p>
        </div>

        {/* ARV Treatment Form */}
        <section className="max-w-6xl mx-auto mb-12">
          <ARVTreatmentForm />
        </section>

        {/* New ARV Insurance Section */}
        <section className="max-w-6xl mx-auto bg-blue-50 p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800">ARV BẢO HIỂM Y TẾ</h2>
            <p className="mt-2 text-blue-600">Thủ tục nhanh chóng, không phải chờ đợi, nhận thuốc trong 15 phút</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Benefit 1 */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-blue-700 mb-2">Thủ tục nhanh</h3>
              <p className="text-gray-600">Không phải chờ đợi, nhận thuốc trong 15 phút</p>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-blue-700 mb-2">Chính sách đầy đủ</h3>
              <p className="text-gray-600">Được hưởng mọi chính sách BHYT như ở bệnh viện</p>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-blue-700 mb-2">Miễn phí xét nghiệm</h3>
              <p className="text-gray-600">Khám và xét nghiệm 12 chỉ số quan trọng hoàn toàn miễn phí</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}