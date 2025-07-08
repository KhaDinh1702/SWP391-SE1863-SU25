import { FaClinicMedical, FaPills, FaUserShield, FaHeartbeat, FaFlask, FaArrowLeft, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import { Link } from "react-router-dom";
import FullNavbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ServicesPage() {
  const services = [
    {
      icon: <FaClinicMedical className="text-4xl" />,
      title: "Khám và điều trị HIV",
      description: "Cung cấp dịch vụ khám, tư vấn và điều trị HIV với phác đồ hiện đại, bảo mật thông tin tuyệt đối.",
      features: ["Tư vấn chuyên sâu", "Điều trị theo phác đồ", "Bảo mật thông tin"]
    },
    {
      icon: <FaPills className="text-4xl" />,
      title: "Cung cấp thuốc ARV",
      description: "Cung cấp đầy đủ các loại thuốc ARV và thuốc điều trị nhiễm trùng cơ hội với giá cả hợp lý.",
      features: ["Thuốc chính hãng", "Giá cả hợp lý", "Giao hàng tận nơi"]
    },
    {
      icon: <FaUserShield className="text-4xl" />,
      title: "Dự phòng lây nhiễm HIV",
      description: "Tư vấn và cung cấp các biện pháp dự phòng lây nhiễm HIV như PrEP, PEP và bao cao su.",
      features: ["Tư vấn PrEP/PEP", "Cung cấp vật dụng", "Theo dõi định kỳ"]
    },
    {
      icon: <MdHealthAndSafety className="text-4xl" />,
      title: "Xét nghiệm STDs",
      description: "Xét nghiệm các bệnh lây truyền qua đường tình dục chính xác, nhanh chóng và bảo mật.",
      features: ["Kết quả nhanh chóng", "Bảo mật tuyệt đối", "Tư vấn sau xét nghiệm"]
    },
    {
      icon: <FaHeartbeat className="text-4xl" />,
      title: "Chăm sóc sức khỏe toàn diện",
      description: "Khám và điều trị các bệnh lý thông thường, chăm sóc sức khỏe định kỳ cho người nhiễm HIV.",
      features: ["Khám tổng quát", "Theo dõi sức khỏe", "Tư vấn dinh dưỡng"]
    },
    {
      icon: <FaFlask className="text-4xl" />,
      title: "Xét nghiệm tải lượng virus",
      description: "Xét nghiệm tải lượng virus HIV, CD4 và các xét nghiệm chuyên sâu khác để theo dõi điều trị.",
      features: ["Xét nghiệm chuyên sâu", "Kết quả chính xác", "Tư vấn điều trị"]
    }
  ];

  return (
    <div className="font-sans bg-gradient-to-br from-[#3B9AB8]/10 via-white to-[#3B9AB8]/5 min-h-screen">
      {/* NavBar */}
      <FullNavbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg')] bg-cover bg-center opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B9AB8]/90 to-[#2D7A94]/90"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#3B9AB8]/80 animate-fade-in">
              Dịch vụ y tế chất lượng cao
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
              Chúng tôi cung cấp các dịch vụ y tế toàn diện về HIV và các bệnh lây truyền qua đường tình dục với đội ngũ bác sĩ giàu kinh nghiệm.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <FaPhone className="w-6 h-6 mr-3" />
                <span className="text-lg">Hotline: 1900 1234</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <FaClock className="w-6 h-6 mr-3" />
                <span className="text-lg">Giờ làm việc: 8:00 - 20:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-20 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#3B9AB8] mb-6">
            Các dịch vụ của chúng tôi
          </h2>
          <p className="text-[#2D7A94] max-w-2xl mx-auto text-xl leading-relaxed">
            Chúng tôi cam kết mang lại dịch vụ chăm sóc sức khỏe tốt nhất với sự tôn trọng và bảo mật tuyệt đối.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="mb-8 p-6 bg-gradient-to-br from-[#3B9AB8]/10 to-[#3B9AB8]/5 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300">
                <div className="text-[#3B9AB8]">{service.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-[#3B9AB8] mb-4 group-hover:text-[#2D7A94] transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {service.description}
              </p>
              <div className="space-y-4">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-gray-700 group/item">
                    <div className="w-2 h-2 bg-[#3B9AB8] rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-32 bg-white rounded-3xl shadow-2xl p-12 transform hover:scale-[1.02] transition-all duration-300">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#3B9AB8] mb-4">Liên hệ với chúng tôi</h3>
            <p className="text-[#2D7A94] text-xl">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex items-center justify-center p-6 bg-gradient-to-br from-[#3B9AB8]/10 to-[#3B9AB8]/5 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaPhone className="w-8 h-8 text-[#3B9AB8] mr-4" />
              <div>
                <p className="font-bold text-[#3B9AB8] text-lg">Hotline</p>
                <p className="text-[#2D7A94] text-lg">1900 1234</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-6 bg-gradient-to-br from-[#3B9AB8]/10 to-[#3B9AB8]/5 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaMapMarkerAlt className="w-8 h-8 text-[#3B9AB8] mr-4" />
              <div>
                <p className="font-bold text-[#3B9AB8] text-lg">Địa chỉ</p>
                <p className="text-[#2D7A94] text-lg">123 Đường ABC, Quận XYZ</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-6 bg-gradient-to-br from-[#3B9AB8]/10 to-[#3B9AB8]/5 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaClock className="w-8 h-8 text-[#3B9AB8] mr-4" />
              <div>
                <p className="font-bold text-[#3B9AB8] text-lg">Giờ làm việc</p>
                <p className="text-[#2D7A94] text-lg">8:00 - 20:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}