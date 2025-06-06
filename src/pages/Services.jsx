import { FaClinicMedical, FaPills, FaUserShield, FaHeartbeat, FaFlask } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import { Link } from "react-router-dom";

export default function ServicesPage() {
  const services = [
    {
      icon: <FaClinicMedical className="text-4xl text-blue-600" />,
      title: "Khám và điều trị HIV",
      description: "Cung cấp dịch vụ khám, tư vấn và điều trị HIV với phác đồ hiện đại, bảo mật thông tin tuyệt đối."
    },
    {
      icon: <FaPills className="text-4xl text-blue-600" />,
      title: "Cung cấp thuốc ARV",
      description: "Cung cấp đầy đủ các loại thuốc ARV và thuốc điều trị nhiễm trùng cơ hội với giá cả hợp lý."
    },
    {
      icon: <FaUserShield className="text-4xl text-blue-600" />,
      title: "Dự phòng lây nhiễm HIV",
      description: "Tư vấn và cung cấp các biện pháp dự phòng lây nhiễm HIV như PrEP, PEP và bao cao su."
    },
    {
      icon: <MdHealthAndSafety className="text-4xl text-blue-600" />,
      title: "Xét nghiệm STDs",
      description: "Xét nghiệm các bệnh lây truyền qua đường tình dục chính xác, nhanh chóng và bảo mật."
    },
    {
      icon: <FaHeartbeat className="text-4xl text-blue-600" />,
      title: "Chăm sóc sức khỏe toàn diện",
      description: "Khám và điều trị các bệnh lý thông thường, chăm sóc sức khỏe định kỳ cho người nhiễm HIV."
    },
    {
      icon: <FaFlask className="text-4xl text-blue-600" />,
      title: "Xét nghiệm tải lượng virus",
      description: "Xét nghiệm tải lượng virus HIV, CD4 và các xét nghiệm chuyên sâu khác để theo dõi điều trị."
    }
  ];

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-6">Dịch vụ y tế chất lượng cao</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Chúng tôi cung cấp các dịch vụ y tế toàn diện về HIV và các bệnh lây truyền qua đường tình dục với đội ngũ bác sĩ giàu kinh nghiệm.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-16 relative">
        {/* Back to Home button - positioned top right */}
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

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Các dịch vụ của chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết mang lại dịch vụ chăm sóc sức khỏe tốt nhất với sự tôn trọng và bảo mật tuyệt đối.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}