import { useState } from "react";
import { FaPhone, FaTimes, FaClock, FaBuilding, FaAmbulance, FaUserMd, FaFileMedical } from "react-icons/fa";

const CallWidget = () => {
  const [isCallOpen, setIsCallOpen] = useState(false);
  const phoneNumber = "0943108138";

  const departments = [
    {
      name: "Tư vấn điều trị HIV/ARV",
      number: "0943108138",
      hours: "7:30 - 19:00 (Thứ 2 - Thứ 6)",
      icon: <FaUserMd className="text-xl" />
    },
    {
      name: "Cấp cứu 24/7",
      number: "0912345678",
      hours: "24/7",
      icon: <FaAmbulance className="text-xl" />
    },
    {
      name: "Đăng ký khám bệnh",
      number: "0987654321",
      hours: "7:30 - 17:00 (Thứ 2 - Thứ 7)",
      icon: <FaFileMedical className="text-xl" />
    },
    {
      name: "Hỗ trợ BHYT",
      number: "0967890123",
      hours: "8:00 - 17:00 (Thứ 2 - Thứ 6)",
      icon: <FaBuilding className="text-xl" />
    }
  ];

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="fixed bottom-6 right-24 z-50 transition-all duration-300 ease-in-out">
      {isCallOpen ? (
        <div className="w-80 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaPhone className="text-xl" />
                <h3 className="font-semibold text-lg">Liên hệ nhanh</h3>
              </div>
              <button
                onClick={() => setIsCallOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Đóng hộp thoại"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto bg-gray-50">
            <div className="text-center py-2">
              <p className="text-sm text-gray-600 font-medium">
                Chọn bộ phận cần liên hệ
              </p>
            </div>

            {departments.map((dept, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                onClick={() => handleCall(dept.number)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-green-700">{dept.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <FaClock className="text-xs text-gray-400" />
                      <p className="text-xs text-gray-500">{dept.hours}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 text-green-600 p-2 rounded-full ml-4">
                    {dept.icon}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-green-600">
                    {dept.number}
                  </p>
                  <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                    Gọi ngay
                  </div>
                </div>
              </div>
            ))}

            {/* Call Button */}
            <button
              onClick={() => handleCall(phoneNumber)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 mt-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              <FaPhone className="text-lg" />
              <span>Gọi ngay: {phoneNumber}</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCallOpen(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
          aria-label="Mở hộp thoại gọi điện"
        >
          <FaPhone className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default CallWidget;