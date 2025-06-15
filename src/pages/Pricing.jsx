import { FaClinicMedical, FaPills, FaVial, FaUserShield, FaHeartbeat, FaArrowLeft, FaInfoCircle, FaCheckCircle, FaClock, FaPhone } from "react-icons/fa";
import { MdHealthAndSafety, MdLocalHospital, MdPayment } from "react-icons/md";
import { Link } from "react-router-dom";

export default function PricingPage() {
  const pricingCategories = [
    {
      title: "Khám và Tư vấn",
      icon: <FaClinicMedical className="text-3xl text-white" />,
      description: "Dịch vụ khám và tư vấn chuyên sâu về HIV và các bệnh lây truyền qua đường tình dục",
      services: [
        { 
          name: "Khám tổng quát", 
          price: "300,000 VND",
          details: "Bao gồm khám lâm sàng, đo huyết áp, nhịp tim, cân nặng và tư vấn sức khỏe tổng quát"
        },
        { 
          name: "Tư vấn HIV ban đầu", 
          price: "200,000 VND",
          details: "Tư vấn về HIV, các đường lây truyền, cách phòng tránh và xét nghiệm"
        },
        { 
          name: "Tư vấn sau xét nghiệm", 
          price: "150,000 VND",
          details: "Tư vấn về kết quả xét nghiệm, hướng dẫn điều trị và chăm sóc sức khỏe"
        },
        { 
          name: "Khám chuyên khoa", 
          price: "500,000 VND",
          details: "Khám chuyên sâu với bác sĩ chuyên khoa về HIV và các bệnh lây truyền qua đường tình dục"
        }
      ]
    },
    {
      title: "Xét nghiệm",
      icon: <FaVial className="text-3xl text-white" />,
      description: "Các dịch vụ xét nghiệm chính xác và bảo mật về HIV và các bệnh lây truyền qua đường tình dục",
      services: [
        { 
          name: "Xét nghiệm HIV nhanh", 
          price: "150,000 VND",
          details: "Kết quả trong 15-20 phút, độ chính xác cao"
        },
        { 
          name: "Xét nghiệm HIV Elisa", 
          price: "250,000 VND",
          details: "Xét nghiệm chính xác cao, kết quả trong 24 giờ"
        },
        { 
          name: "Xét nghiệm tải lượng virus", 
          price: "1,200,000 VND",
          details: "Đo số lượng virus HIV trong máu, kết quả trong 3-5 ngày"
        },
        { 
          name: "Xét nghiệm CD4", 
          price: "800,000 VND",
          details: "Đo số lượng tế bào CD4, đánh giá hệ miễn dịch"
        },
        { 
          name: "Xét nghiệm STD cơ bản", 
          price: "400,000 VND",
          details: "Xét nghiệm các bệnh lây truyền qua đường tình dục phổ biến"
        },
        { 
          name: "Xét nghiệm STD toàn diện", 
          price: "1,500,000 VND",
          details: "Xét nghiệm đầy đủ các bệnh lây truyền qua đường tình dục"
        }
      ]
    },
    {
      title: "Điều trị ARV",
      icon: <FaPills className="text-3xl text-white" />,
      description: "Dịch vụ điều trị ARV và theo dõi điều trị cho người nhiễm HIV",
      services: [
        { 
          name: "Tư vấn điều trị ARV", 
          price: "200,000 VND",
          details: "Tư vấn về phác đồ điều trị, tác dụng phụ và cách uống thuốc"
        },
        { 
          name: "Cấp phát thuốc ARV (tháng)", 
          price: "Miễn phí*",
          details: "Cấp phát thuốc ARV theo phác đồ điều trị, bao gồm tư vấn sử dụng"
        },
        { 
          name: "Theo dõi điều trị", 
          price: "300,000 VND/lần",
          details: "Khám và đánh giá hiệu quả điều trị, điều chỉnh phác đồ nếu cần"
        },
        { 
          name: "Đánh giá hiệu quả điều trị", 
          price: "500,000 VND",
          details: "Xét nghiệm và đánh giá toàn diện về hiệu quả điều trị"
        }
      ]
    },
    {
      title: "Dự phòng",
      icon: <FaUserShield className="text-3xl text-white" />,
      description: "Các dịch vụ dự phòng lây nhiễm HIV và các bệnh lây truyền qua đường tình dục",
      services: [
        { 
          name: "Tư vấn dự phòng lây nhiễm", 
          price: "200,000 VND",
          details: "Tư vấn về các biện pháp dự phòng lây nhiễm HIV"
        },
        { 
          name: "Cấp phát thuốc PrEP (tháng)", 
          price: "1,200,000 VND",
          details: "Cấp phát thuốc PrEP và tư vấn sử dụng"
        },
        { 
          name: "Cấp phát thuốc PEP", 
          price: "2,500,000 VND",
          details: "Cấp phát thuốc PEP và tư vấn sử dụng trong 28 ngày"
        },
        { 
          name: "Tiêm phòng viêm gan B", 
          price: "300,000 VND/mũi",
          details: "Tiêm phòng viêm gan B, bao gồm tư vấn trước và sau tiêm"
        }
      ]
    },
    {
      title: "Chăm sóc sức khỏe",
      icon: <FaHeartbeat className="text-3xl text-white" />,
      description: "Dịch vụ chăm sóc sức khỏe toàn diện cho người nhiễm HIV",
      services: [
        { 
          name: "Tư vấn dinh dưỡng", 
          price: "200,000 VND",
          details: "Tư vấn về chế độ dinh dưỡng phù hợp với người nhiễm HIV"
        },
        { 
          name: "Tư vấn tâm lý", 
          price: "300,000 VND",
          details: "Tư vấn tâm lý và hỗ trợ tinh thần"
        },
        { 
          name: "Khám sức khỏe định kỳ", 
          price: "500,000 VND",
          details: "Khám sức khỏe định kỳ và đánh giá tổng quát"
        },
        { 
          name: "Gói chăm sóc toàn diện", 
          price: "2,000,000 VND",
          details: "Bao gồm khám sức khỏe, tư vấn dinh dưỡng và tâm lý"
        }
      ]
    },
    {
      title: "Dịch vụ khác",
      icon: <MdLocalHospital className="text-3xl text-white" />,
      description: "Các dịch vụ y tế khác tại phòng khám",
      services: [
        { 
          name: "Cấp cứu ban đầu", 
          price: "500,000 VND",
          details: "Cấp cứu và xử trí các tình huống khẩn cấp"
        },
        { 
          name: "Truyền dịch", 
          price: "200,000 VND",
          details: "Truyền dịch và theo dõi trong quá trình truyền"
        },
        { 
          name: "Thay băng, cắt chỉ", 
          price: "100,000 VND",
          details: "Thay băng vết thương và cắt chỉ sau phẫu thuật"
        },
        { 
          name: "Tiêm thuốc", 
          price: "50,000 VND",
          details: "Tiêm thuốc theo chỉ định của bác sĩ"
        }
      ]
    }
  ];

  return (
    <div className="font-sans bg-gradient-to-br from-[#3B9AB8]/10 via-white to-[#3B9AB8]/5 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg')] bg-cover bg-center opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B9AB8]/90 to-[#2D7A94]/90"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#3B9AB8]/80 animate-fade-in leading-[1.4]">
              Bảng Giá Dịch Vụ
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
              Thông tin chi tiết về giá các dịch vụ khám chữa bệnh và điều trị HIV tại phòng khám chúng tôi
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

      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center px-8 py-4 bg-white text-[#3B9AB8] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group hover:bg-[#3B9AB8]/5"
        >
          <FaArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Quay lại trang chủ</span>
        </Link>
      </div>

      {/* Pricing Content */}
      <div className="container mx-auto px-6 py-20">
        {/* Notice */}
        <div className="bg-white/80 backdrop-blur-sm border-l-4 border-[#3B9AB8] p-6 mb-16 rounded-r-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <FaInfoCircle className="h-6 w-6 text-[#3B9AB8]" />
            </div>
            <div className="ml-4">
              <p className="text-lg text-[#2D7A94]">
                <span className="font-bold">Lưu ý:</span> Giá dịch vụ có thể thay đổi theo chính sách của Bảo hiểm Y tế. 
                Một số dịch vụ được miễn phí cho người có thẻ BHYT đúng tuyến. 
                Vui lòng liên hệ để biết thêm chi tiết.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Tables */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pricingCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
              <div className="bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] px-8 py-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4 text-white group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                </div>
                <p className="text-white/90 text-sm">{category.description}</p>
              </div>
              <div className="p-8">
                <ul className="divide-y divide-gray-100">
                  {category.services.map((service, sIndex) => (
                    <li key={sIndex} className="py-4">
                      <div className="flex justify-between items-start group/item">
                        <div>
                          <span className="text-gray-700 text-lg font-medium group-hover/item:text-[#3B9AB8] transition-colors">
                            {service.name}
                          </span>
                          <p className="text-gray-500 text-sm mt-1">{service.details}</p>
                        </div>
                        <span className="font-bold text-[#3B9AB8] text-lg ml-4 whitespace-nowrap">
                          {service.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-20 bg-white p-12 rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-3xl font-bold text-[#3B9AB8] mb-8 flex items-center">
            <MdPayment className="w-8 h-8 mr-4" />
            Chính sách giá và thanh toán
          </h2>
          <div className="prose prose-[#3B9AB8] max-w-none">
            <ul className="list-none space-y-4">
              <li className="flex items-start text-lg text-gray-700">
                <FaCheckCircle className="w-6 h-6 text-[#3B9AB8] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">VAT:</span> Giá trên chưa bao gồm 10% VAT (nếu có hóa đơn VAT)
                </div>
              </li>
              <li className="flex items-start text-lg text-gray-700">
                <FaCheckCircle className="w-6 h-6 text-[#3B9AB8] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Giảm giá:</span> Giảm 5% cho khách hàng đăng ký gói dịch vụ từ 3 tháng trở lên
                </div>
              </li>
              <li className="flex items-start text-lg text-gray-700">
                <FaCheckCircle className="w-6 h-6 text-[#3B9AB8] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Miễn phí:</span> Miễn phí khám ban đầu cho người nhiễm HIV lần đầu tiên
                </div>
              </li>
              <li className="flex items-start text-lg text-gray-700">
                <FaCheckCircle className="w-6 h-6 text-[#3B9AB8] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Thanh toán:</span> Chấp nhận thanh toán bằng tiền mặt, chuyển khoản hoặc thẻ BHYT
                </div>
              </li>
              <li className="flex items-start text-lg text-gray-700">
                <FaCheckCircle className="w-6 h-6 text-[#3B9AB8] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Trả góp:</span> Hỗ trợ thanh toán trả góp 0% lãi suất cho gói điều trị dài hạn
                </div>
              </li>
            </ul>
            <div className="mt-8 p-6 bg-[#3B9AB8]/5 rounded-xl">
              <p className="text-base text-gray-600 italic">
                * Miễn phí thuốc ARV cho người có thẻ BHYT theo quy định của Bộ Y tế. 
                Để biết thêm chi tiết về điều kiện và thủ tục, vui lòng liên hệ với chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}