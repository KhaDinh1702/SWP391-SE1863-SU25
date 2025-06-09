import { FaPills, FaSearch, FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { MdLocalPharmacy, MdHealthAndSafety } from "react-icons/md";
import { FiAlertCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function MedicinePage() {
  // State to track which medicine's details are expanded
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCardExpansion = (index, section) => {
    setExpandedCards(prev => ({
      ...prev,
      [`${section}-${index}`]: !prev[`${section}-${index}`]
    }));
  };

  // ARV Medications
  const arvMedicines = [
    {
      name: "Tenofovir/Lamivudine/Dolutegravir (TLD)",
      description: "Phác đồ điều trị HIV hàng đầu, 1 viên/ngày",
      price: "Miễn phí*",
      dosage: "1 viên mỗi ngày",
      sideEffects: "Có thể gây chóng mặt, buồn nôn nhẹ",
      image: "https://th.bing.com/th/id/OIP.nSCiYZYdKuR2x_ztrsxnhAHaGj?rs=1&pid=ImgDetMain",
      details: {
        composition: "Tenofovir 300mg + Lamivudine 300mg + Dolutegravir 50mg",
        mechanism: "Ức chế enzyme reverse transcriptase và integrase của HIV",
        indications: "Điều trị HIV-1 ở người lớn và trẻ em ≥40kg",
        contraindications: "Quá mẫn với bất kỳ thành phần nào của thuốc",
        precautions: "Theo dõi chức năng thận, đặc biệt ở bệnh nhân có bệnh thận",
        storage: "Bảo quản dưới 30°C, tránh ẩm",
        manufacturer: "Các công ty dược trong nước và quốc tế",
        registration: "Đã đăng ký với Bộ Y tế"
      }
    },
    {
      name: "Efavirenz 600mg",
      description: "Thuốc ARV thế hệ cũ, dùng trước khi ngủ",
      price: "450,000 VND/hộp",
      dosage: "1 viên mỗi tối",
      sideEffects: "Có thể gây ác mộng, chóng mặt",
      image: "https://th.bing.com/th/id/OIP.CES4E1fonSkKiXEUuSlv2wHaEV?rs=1&pid=ImgDetMain",
      details: {
        composition: "Efavirenz 600mg",
        mechanism: "Ức chế enzyme reverse transcriptase không nucleoside (NNRTI)",
        indications: "Điều trị HIV-1 phối hợp với các ARV khác",
        contraindications: "Quá mẫn, suy gan nặng, dùng cùng với voriconazole",
        precautions: "Có thể ảnh hưởng tâm thần, tránh dùng khi lái xe",
        storage: "Bảo quản ở nhiệt độ phòng",
        manufacturer: "Merck Sharp & Dohme",
        registration: "Đã đăng ký với Bộ Y tế"
      }
    },
    {
      name: "Abacavir/Lamivudine (ABC/3TC)",
      description: "Phối hợp 2 thuốc, dùng cho bệnh nhân dị ứng Tenofovir",
      price: "600,000 VND/hộp",
      dosage: "1 viên 2 lần/ngày",
      sideEffects: "Hiếm khi gây dị ứng",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ePojHZz3lgsIfqlOEer9fEZkoAKDz0zTzw&s",
      details: {
        composition: "Abacavir 600mg + Lamivudine 300mg",
        mechanism: "Ức chế enzyme reverse transcriptase nucleoside (NRTI)",
        indications: "Điều trị HIV-1 ở người lớn và trẻ em",
        contraindications: "Quá mẫn với abacavir, suy gan nặng",
        precautions: "Xét nghiệm HLA-B*5701 trước khi dùng",
        storage: "Bảo quản dưới 30°C",
        manufacturer: "ViiV Healthcare",
        registration: "Đã đăng ký với Bộ Y tế"
      }
    }
  ];

  // Other HIV-related medicines
  const otherMedicines = [
    {
      name: "Cotrimoxazole 480mg",
      description: "Dự phòng nhiễm trùng cơ hội",
      price: "120,000 VND/hộp",
      category: "Dự phòng",
      image: "https://www.vinmec.com/static/uploads/20220303_051822_042418_cotrimoxazol_480mg_max_1800x1800_png_a52dafcc45.png",
      details: {
        composition: "Sulfamethoxazole 400mg + Trimethoprim 80mg",
        mechanism: "Ức chế tổng hợp acid folic của vi khuẩn",
        indications: "Dự phòng PCP và các nhiễm trùng cơ hội khác ở bệnh nhân HIV",
        contraindications: "Quá mẫn với sulfonamide, suy gan/thận nặng",
        precautions: "Uống nhiều nước, theo dõi tác dụng phụ trên da",
        storage: "Bảo quản ở nhiệt độ phòng",
        manufacturer: "Nhiều công ty dược trong nước",
        registration: "Đã đăng ký với Bộ Y tế"
      }
    },
    {
      name: "Fluconazole 200mg",
      description: "Điều trị nấm miệng, thực quản",
      price: "80,000 VND/vỉ",
      category: "Điều trị nhiễm trùng",
      image: "https://5.imimg.com/data5/SELLER/Default/2024/8/445352144/BC/KO/AS/22822005/fluconazole-200mg-tablet.jpeg",
      details: {
        composition: "Fluconazole 200mg",
        mechanism: "Ức chế tổng hợp ergosterol của màng tế bào nấm",
        indications: "Điều trị và dự phòng nhiễm nấm Candida ở bệnh nhân HIV",
        contraindications: "Quá mẫn với azole, dùng cùng cisapride",
        precautions: "Điều chỉnh liều ở bệnh nhân suy thận",
        storage: "Bảo quản dưới 30°C",
        manufacturer: "Pfizer và các công ty generic",
        registration: "Đã đăng ký với Bộ Y tế"
      }
    },
    {
      name: "Truvada (PrEP)",
      description: "Thuốc dự phòng trước phơi nhiễm HIV",
      price: "1,200,000 VND/hộp",
      category: "Dự phòng",
      image: "https://galantclinic.com/wp-content/uploads/2024/02/prep-1.jpg",
      details: {
        composition: "Tenofovir disoproxil 300mg + Emtricitabine 200mg",
        mechanism: "Ức chế sao chép HIV khi phơi nhiễm",
        indications: "Dự phòng HIV cho người có nguy cơ cao",
        contraindications: "Quá mẫn, suy thận nặng (độ thanh thải creatinin <30mL/phút)",
        precautions: "Xét nghiệm HIV trước khi dùng, theo dõi chức năng thận",
        storage: "Bảo quản dưới 25°C",
        manufacturer: "Gilead Sciences",
        registration: "Đã đăng ký với Bộ Y tế"
      }
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
                    <button 
                      onClick={() => toggleCardExpansion(index, 'arv')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                    >
                      {expandedCards[`arv-${index}`] ? (
                        <>
                          <FiChevronUp className="mr-2" />
                          Thu gọn thông tin
                        </>
                      ) : (
                        <>
                          <FiChevronDown className="mr-2" />
                          Xem chi tiết
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Detailed Information Section */}
                {expandedCards[`arv-${index}`] && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <h4 className="font-bold text-lg text-gray-800 mb-4">Thông tin chi tiết</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Thành phần:</p>
                        <p className="text-gray-700">{medicine.details.composition}</p>
                      </div>
                      <div>
                        <p className="font-medium">Cơ chế tác dụng:</p>
                        <p className="text-gray-700">{medicine.details.mechanism}</p>
                      </div>
                      <div>
                        <p className="font-medium">Chỉ định:</p>
                        <p className="text-gray-700">{medicine.details.indications}</p>
                      </div>
                      <div>
                        <p className="font-medium">Chống chỉ định:</p>
                        <p className="text-gray-700">{medicine.details.contraindications}</p>
                      </div>
                      <div>
                        <p className="font-medium">Thận trọng:</p>
                        <p className="text-gray-700">{medicine.details.precautions}</p>
                      </div>
                      <div>
                        <p className="font-medium">Bảo quản:</p>
                        <p className="text-gray-700">{medicine.details.storage}</p>
                      </div>
                      <div>
                        <p className="font-medium">Nhà sản xuất:</p>
                        <p className="text-gray-700">{medicine.details.manufacturer}</p>
                      </div>
                      <div>
                        <p className="font-medium">Đăng ký:</p>
                        <p className="text-gray-700">{medicine.details.registration}</p>
                      </div>
                    </div>
                  </div>
                )}
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
                    <button 
                      onClick={() => toggleCardExpansion(index, 'other')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                    >
                      {expandedCards[`other-${index}`] ? (
                        <>
                          <FiChevronUp className="mr-2" />
                          Thu gọn thông tin
                        </>
                      ) : (
                        <>
                          <FiChevronDown className="mr-2" />
                          Xem chi tiết
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Detailed Information Section */}
                {expandedCards[`other-${index}`] && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <h4 className="font-bold text-lg text-gray-800 mb-4">Thông tin chi tiết</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Thành phần:</p>
                        <p className="text-gray-700">{medicine.details.composition}</p>
                      </div>
                      <div>
                        <p className="font-medium">Cơ chế tác dụng:</p>
                        <p className="text-gray-700">{medicine.details.mechanism}</p>
                      </div>
                      <div>
                        <p className="font-medium">Chỉ định:</p>
                        <p className="text-gray-700">{medicine.details.indications}</p>
                      </div>
                      <div>
                        <p className="font-medium">Chống chỉ định:</p>
                        <p className="text-gray-700">{medicine.details.contraindications}</p>
                      </div>
                      <div>
                        <p className="font-medium">Thận trọng:</p>
                        <p className="text-gray-700">{medicine.details.precautions}</p>
                      </div>
                      <div>
                        <p className="font-medium">Bảo quản:</p>
                        <p className="text-gray-700">{medicine.details.storage}</p>
                      </div>
                      <div>
                        <p className="font-medium">Nhà sản xuất:</p>
                        <p className="text-gray-700">{medicine.details.manufacturer}</p>
                      </div>
                      <div>
                        <p className="font-medium">Đăng ký:</p>
                        <p className="text-gray-700">{medicine.details.registration}</p>
                      </div>
                    </div>
                  </div>
                )}
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
            <li>Tư vấn sử dụng thuốc miễn phí với dược sĩ chuyên môn</li>
          </ul>
        </div>
      </div>
    </div>
  );
}