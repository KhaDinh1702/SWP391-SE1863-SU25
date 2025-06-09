import { FaClinicMedical, FaPills, FaUserShield, FaHeartbeat, FaFlask, FaArrowLeft, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import { Link } from "react-router-dom";

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
    <div className="font-sans bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/90"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Dịch vụ y tế chất lượng cao
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Chúng tôi cung cấp các dịch vụ y tế toàn diện về HIV và các bệnh lây truyền qua đường tình dục với đội ngũ bác sĩ giàu kinh nghiệm.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <FaPhone className="w-5 h-5 mr-2" />
                <span>Hotline: 1900 1234</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <FaClock className="w-5 h-5 mr-2" />
                <span>Giờ làm việc: 8:00 - 20:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-16 relative">
        {/* Back to Home button */}
        <div className="absolute top-6 left-6">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <FaArrowLeft className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Các dịch vụ của chúng tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Chúng tôi cam kết mang lại dịch vụ chăm sóc sức khỏe tốt nhất với sự tôn trọng và bảo mật tuyệt đối.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300">
                <div className="text-blue-600">{service.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              <div className="space-y-2">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Liên hệ với chúng tôi</h3>
            <p className="text-gray-600">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
              <FaPhone className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-800">Hotline</p>
                <p className="text-gray-600">1900 1234</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
              <FaMapMarkerAlt className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-800">Địa chỉ</p>
                <p className="text-gray-600">123 Đường ABC, Quận XYZ</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
              <FaClock className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-800">Giờ làm việc</p>
                <p className="text-gray-600">8:00 - 20:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}