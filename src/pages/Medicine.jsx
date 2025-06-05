import { FaPills, FaSearch, FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { MdLocalPharmacy, MdHealthAndSafety } from "react-icons/md";
import { Link } from "react-router-dom";

export default function MedicinePage() {
  // ARV Medications
  const arvMedicines = [
    {
      name: "Tenofovir/Lamivudine/Dolutegravir (TLD)",
      description: "Phác đồ điều trị HIV hàng đầu, 1 viên/ngày",
      price: "Miễn phí*",
      dosage: "1 viên mỗi ngày",
      sideEffects: "Có thể gây chóng mặt, buồn nôn nhẹ",
      image: "https://th.bing.com/th/id/OIP.nSCiYZYdKuR2x_ztrsxnhAHaGj?rs=1&pid=ImgDetMain"
    },
    {
      name: "Efavirenz 600mg",
      description: "Thuốc ARV thế hệ cũ, dùng trước khi ngủ",
      price: "450,000 VND/hộp",
      dosage: "1 viên mỗi tối",
      sideEffects: "Có thể gây ác mộng, chóng mặt",
      image: "https://th.bing.com/th/id/OIP.CES4E1fonSkKiXEUuSlv2wHaEV?rs=1&pid=ImgDetMain"
    },
    {
      name: "Abacavir/Lamivudine (ABC/3TC)",
      description: "Phối hợp 2 thuốc, dùng cho bệnh nhân dị ứng Tenofovir",
      price: "600,000 VND/hộp",
      dosage: "1 viên 2 lần/ngày",
      sideEffects: "Hiếm khi gây dị ứng",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ePojHZz3lgsIfqlOEer9fEZkoAKDz0zTzw&s"
    }
  ];

  // Other HIV-related medicines
  const otherMedicines = [
    {
      name: "Cotrimoxazole 480mg",
      description: "Dự phòng nhiễm trùng cơ hội",
      price: "120,000 VND/hộp",
      category: "Dự phòng",
      image: "https://www.vinmec.com/static/uploads/20220303_051822_042418_cotrimoxazol_480mg_max_1800x1800_png_a52dafcc45.png"
    },
    {
      name: "Fluconazole 200mg",
      description: "Điều trị nấm miệng, thực quản",
      price: "80,000 VND/vỉ",
      category: "Điều trị nhiễm trùng",
      image: "https://5.imimg.com/data5/SELLER/Default/2024/8/445352144/BC/KO/AS/22822005/fluconazole-200mg-tablet.jpeg"
    },
    {
      name: "Truvada (PrEP)",
      description: "Thuốc dự phòng trước phơi nhiễm HIV",
      price: "1,200,000 VND/hộp",
      category: "Dự phòng",
      image: "https://galantclinic.com/wp-content/uploads/2024/02/prep-1.jpg"
    }
  ];

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-6">Nhà Thuốc 4AE</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Cung cấp đầy đủ thuốc ARV và các loại thuốc hỗ trợ điều trị HIV
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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">

        {/* ARV Medicines Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <MdHealthAndSafety className="text-3xl text-blue-600 mr-4" />
            <h2 className="text-2xl font-bold text-gray-800">Thuốc ARV Điều Trị HIV</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {arvMedicines.map((medicine, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {medicine.image ? (
                    <img src={medicine.image} alt={medicine.name} className="h-full w-full object-cover" />
                  ) : (
                    <FaPills className="text-5xl text-gray-400" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{medicine.name}</h3>
                    <p className="text-gray-600 mb-4">{medicine.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium">Liều dùng:</span>
                        <span>{medicine.dosage}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium">Tác dụng phụ:</span>
                        <span>{medicine.sideEffects}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Giá:</span>
                        <span className="font-bold text-blue-600">{medicine.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                      <FaShoppingCart className="mr-2" />
                      Đặt mua
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Other Medicines Section */}
        <section>
          <div className="flex items-center mb-8">
            <MdLocalPharmacy className="text-3xl text-blue-600 mr-4" />
            <h2 className="text-2xl font-bold text-gray-800">Thuốc Hỗ Trợ Khác</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherMedicines.map((medicine, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {medicine.image ? (
                    <img src={medicine.image} alt={medicine.name} className="h-full w-full object-cover" />
                  ) : (
                    <FaPills className="text-5xl text-gray-400" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{medicine.name}</h3>
                    <p className="text-gray-600 mb-4">{medicine.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Phân loại:</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {medicine.category}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 mt-2">
                        <span className="font-medium">Giá:</span>
                        <span className="font-bold text-blue-600">{medicine.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                      <FaShoppingCart className="mr-2" />
                      Đặt mua
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notice Section */}
        <div className="mt-16 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Thông tin quan trọng</h3>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>Thuốc ARV được cấp miễn phí cho bệnh nhân có thẻ BHYT theo quy định</li>
            <li>Cần có đơn thuốc của bác sĩ để mua các loại thuốc kháng virus</li>
            <li>Nhà thuốc mở cửa từ 7:00 - 20:00 tất cả các ngày trong tuần</li>
            <li>Hỗ trợ giao thuốc tận nhà trong nội thành</li>
          </ul>
        </div>
      </div>
    </div>
  );
}