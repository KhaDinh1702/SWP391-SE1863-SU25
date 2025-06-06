import { FaClinicMedical, FaPills, FaVial, FaUserShield, FaHeartbeat } from "react-icons/fa";
import { MdHealthAndSafety, MdLocalHospital } from "react-icons/md";
import { Link } from "react-router-dom";

export default function PricingPage() {
  const pricingCategories = [
    {
      title: "Khám và Tư vấn",
      icon: <FaClinicMedical className="text-3xl text-blue-600" />,
      services: [
        { name: "Khám tổng quát", price: "300,000 VND" },
        { name: "Tư vấn HIV ban đầu", price: "200,000 VND" },
        { name: "Tư vấn sau xét nghiệm", price: "150,000 VND" },
        { name: "Khám chuyên khoa", price: "500,000 VND" }
      ]
    },
    {
      title: "Xét nghiệm",
      icon: <FaVial className="text-3xl text-blue-600" />,
      services: [
        { name: "Xét nghiệm HIV nhanh", price: "150,000 VND" },
        { name: "Xét nghiệm HIV Elisa", price: "250,000 VND" },
        { name: "Xét nghiệm tải lượng virus", price: "1,200,000 VND" },
        { name: "Xét nghiệm CD4", price: "800,000 VND" },
        { name: "Xét nghiệm STD cơ bản", price: "400,000 VND" },
        { name: "Xét nghiệm STD toàn diện", price: "1,500,000 VND" }
      ]
    },
    {
      title: "Điều trị ARV",
      icon: <FaPills className="text-3xl text-blue-600" />,
      services: [
        { name: "Tư vấn điều trị ARV", price: "200,000 VND" },
        { name: "Cấp phát thuốc ARV (tháng)", price: "Miễn phí*" },
        { name: "Theo dõi điều trị", price: "300,000 VND/lần" },
        { name: "Đánh giá hiệu quả điều trị", price: "500,000 VND" }
      ]
    },
    {
      title: "Dự phòng",
      icon: <FaUserShield className="text-3xl text-blue-600" />,
      services: [
        { name: "Tư vấn dự phòng lây nhiễm", price: "200,000 VND" },
        { name: "Cấp phát thuốc PrEP (tháng)", price: "1,200,000 VND" },
        { name: "Cấp phát thuốc PEP", price: "2,500,000 VND" },
        { name: "Tiêm phòng viêm gan B", price: "300,000 VND/mũi" }
      ]
    },
    {
      title: "Chăm sóc sức khỏe",
      icon: <FaHeartbeat className="text-3xl text-blue-600" />,
      services: [
        { name: "Tư vấn dinh dưỡng", price: "200,000 VND" },
        { name: "Tư vấn tâm lý", price: "300,000 VND" },
        { name: "Khám sức khỏe định kỳ", price: "500,000 VND" },
        { name: "Gói chăm sóc toàn diện", price: "2,000,000 VND" }
      ]
    },
    {
      title: "Dịch vụ khác",
      icon: <MdLocalHospital className="text-3xl text-blue-600" />,
      services: [
        { name: "Cấp cứu ban đầu", price: "500,000 VND" },
        { name: "Truyền dịch", price: "200,000 VND" },
        { name: "Thay băng, cắt chỉ", price: "100,000 VND" },
        { name: "Tiêm thuốc", price: "50,000 VND" }
      ]
    }
  ];

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-6">Bảng Giá Dịch Vụ</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Thông tin giá các dịch vụ khám chữa bệnh và điều trị HIV tại phòng khám chúng tôi
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
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

      {/* Pricing Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-12">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-bold">Lưu ý:</span> Giá dịch vụ có thể thay đổi theo chính sách của Bảo hiểm Y tế. 
                Một số dịch vụ được miễn phí cho người có thẻ BHYT đúng tuyến. 
                Vui lòng liên hệ để biết thêm chi tiết.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Tables */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 px-6 py-4 flex items-center">
                <div className="mr-4 text-white">
                  {category.icon}
                </div>
                <h2 className="text-xl font-bold text-white">{category.title}</h2>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-200">
                  {category.services.map((service, sIndex) => (
                    <li key={sIndex} className="py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">{service.name}</span>
                        <span className="font-medium text-blue-600">{service.price}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Chính sách giá và thanh toán</h2>
          <div className="prose prose-blue max-w-none">
            <ul className="list-disc pl-5 space-y-2">
              <li>Giá trên chưa bao gồm 10% VAT (nếu có hóa đơn VAT)</li>
              <li>Giảm 5% cho khách hàng đăng ký gói dịch vụ từ 3 tháng trở lên</li>
              <li>Miễn phí khám ban đầu cho người nhiễm HIV lần đầu tiên</li>
              <li>Chấp nhận thanh toán bằng tiền mặt, chuyển khoản hoặc thẻ BHYT</li>
              <li>Hỗ trợ thanh toán trả góp 0% lãi suất cho gói điều trị dài hạn</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500 italic">
              * Miễn phí thuốc ARV cho người có thẻ BHYT theo quy định của Bộ Y tế
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}