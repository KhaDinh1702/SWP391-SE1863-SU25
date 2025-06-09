import { FaPills, FaSearch, FaShoppingCart, FaInfoCircle, FaArrowLeft, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MdLocalPharmacy, MdHealthAndSafety } from "react-icons/md";
import { FiAlertCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from 'antd';

export default function MedicinePage() {
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedMedicine(null);
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
      image: "https://drugstoreng.ams3.cdn.digitaloceanspaces.com/prod/drugstore-nigeria-online-pharmacy/products/NKLzI7HIjRtH3CzfUCU5vOzHQ3cWZTxfYr9VpumB.jpg",
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
    <div className="font-sans bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">Nhà Thuốc 3AE</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Cung cấp đầy đủ thuốc ARV và các loại thuốc hỗ trợ điều trị HIV với chất lượng quốc tế
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaPhone className="mr-2" />
              <span>Hotline: 0943 108 138</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaClock className="mr-2" />
              <span>7:00 - 20:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-300"
        >
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Quay lại trang chủ
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* ARV Medicines Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <MdHealthAndSafety className="text-3xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Thuốc ARV Điều Trị HIV</h2>
              <p className="text-gray-600">Các loại thuốc ARV được cấp phép và đảm bảo chất lượng</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {arvMedicines.map((medicine, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col h-full">
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {medicine.image ? (
                    <img src={medicine.image} alt={medicine.name} className="h-full w-full object-cover transform hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <FaPills className="text-5xl text-gray-400" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{medicine.name}</h3>
                    <p className="text-gray-600 mb-4">{medicine.description}</p>
                    
                    <div className="mb-4 space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">Liều dùng:</span>
                        <span className="text-gray-600">{medicine.dosage}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">Tác dụng phụ:</span>
                        <span className="text-gray-600">{medicine.sideEffects}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium text-gray-700">Giá:</span>
                        <span className="font-bold text-blue-600">{medicine.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button 
                      onClick={() => showModal(medicine)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <FaInfoCircle className="mr-2" />
                      Xem chi tiết
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
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <MdLocalPharmacy className="text-3xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Thuốc Hỗ Trợ Khác</h2>
              <p className="text-gray-600">Các loại thuốc hỗ trợ điều trị và dự phòng</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherMedicines.map((medicine, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col h-full">
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {medicine.image ? (
                    <img src={medicine.image} alt={medicine.name} className="h-full w-full object-cover transform hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <FaPills className="text-5xl text-gray-400" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{medicine.name}</h3>
                    <p className="text-gray-600 mb-4">{medicine.description}</p>
                    
                    <div className="mb-4 space-y-3">
                      <div className="flex justify-between py-2">
                        <span className="font-medium text-gray-700">Phân loại:</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {medicine.category}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium text-gray-700">Giá:</span>
                        <span className="font-bold text-blue-600">{medicine.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button 
                      onClick={() => showModal(medicine)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <FaInfoCircle className="mr-2" />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notice Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            <FiAlertCircle className="mr-2 text-2xl" />
            Thông tin quan trọng
          </h3>
          <ul className="space-y-3 text-blue-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Thuốc ARV được cấp miễn phí cho bệnh nhân có thẻ BHYT theo quy định</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Cần có đơn thuốc của bác sĩ để mua các loại thuốc kháng virus</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Nhà thuốc mở cửa từ 7:00 - 20:00 tất cả các ngày trong tuần</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Hỗ trợ giao thuốc tận nhà trong nội thành</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Tư vấn sử dụng thuốc miễn phí với dược sĩ chuyên môn</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Medicine Details Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <FaInfoCircle className="text-blue-600 mr-2 text-xl" />
            <span className="text-xl font-bold">Thông tin chi tiết</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        className="medicine-details-modal"
      >
        {selectedMedicine && (
          <div className="p-4">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {selectedMedicine.image ? (
                  <img 
                    src={selectedMedicine.image} 
                    alt={selectedMedicine.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaPills className="w-full h-full text-gray-400 p-8" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedMedicine.name}</h3>
                <p className="text-gray-600 mb-4">{selectedMedicine.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Giá:</span>
                    <span className="font-bold text-blue-600">{selectedMedicine.price}</span>
                  </div>
                  {selectedMedicine.dosage && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Liều dùng:</span>
                      <span className="text-gray-600">{selectedMedicine.dosage}</span>
                    </div>
                  )}
                  {selectedMedicine.sideEffects && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Tác dụng phụ:</span>
                      <span className="text-gray-600">{selectedMedicine.sideEffects}</span>
                    </div>
                  )}
                  {selectedMedicine.category && (
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-700">Phân loại:</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {selectedMedicine.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-blue-600">Thành phần:</p>
                <p className="text-gray-700">{selectedMedicine.details.composition}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-blue-600">Cơ chế tác dụng:</p>
                <p className="text-gray-700">{selectedMedicine.details.mechanism}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-blue-600">Chỉ định:</p>
                <p className="text-gray-700">{selectedMedicine.details.indications}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-blue-600">Chống chỉ định:</p>
                <p className="text-gray-700">{selectedMedicine.details.contraindications}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-blue-600">Thận trọng:</p>
                <p className="text-gray-700">{selectedMedicine.details.precautions}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-blue-600">Bảo quản:</p>
                <p className="text-gray-700">{selectedMedicine.details.storage}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-blue-600">Nhà sản xuất:</p>
                <p className="text-gray-700">{selectedMedicine.details.manufacturer}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-blue-600">Đăng ký:</p>
                <p className="text-gray-700">{selectedMedicine.details.registration}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}