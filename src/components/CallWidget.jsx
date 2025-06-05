import { useState } from "react";

const CallWidget = () => {
  const [isCallOpen, setIsCallOpen] = useState(false);
  const phoneNumber = "0943108138";

  const departments = [
    {
      name: "Tư vấn điều trị HIV/ARV",
      number: "0943108138",
      hours: "7:30 - 19:00 (Thứ 2 - Thứ 6)"
    },
    {
      name: "Cấp cứu 24/7",
      number: "0912345678",
      hours: "24/7"
    },
    {
      name: "Đăng ký khám bệnh",
      number: "0987654321",
      hours: "7:30 - 17:00 (Thứ 2 - Thứ 7)"
    },
    {
      name: "Hỗ trợ BHYT",
      number: "0967890123",
      hours: "8:00 - 17:00 (Thứ 2 - Thứ 6)"
    }
  ];

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="fixed bottom-6 right-24 z-50 transition-all duration-300 ease-in-out">
      {isCallOpen ? (
        <div className="w-80 bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Liên hệ nhanh</h3>
              <button
                onClick={() => setIsCallOpen(false)}
                className="text-white hover:text-gray-200 text-lg transition-colors"
                aria-label="Đóng hộp thoại"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            <div className="text-center py-2">
              <p className="text-sm text-gray-600 font-medium">
                Chọn bộ phận cần liên hệ
              </p>
            </div>

            {departments.map((dept, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleCall(dept.number)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-green-700">{dept.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{dept.hours}</p>
                  </div>
                  <div className="bg-green-100 text-green-700 p-2 rounded-full ml-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-semibold mt-2 text-green-600">
                  {dept.number}
                </p>
              </div>
            ))}

            {/* Call Button */}
            <button
              onClick={() => handleCall(phoneNumber)}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-green-700 hover:to-green-800 transition-all duration-300 mt-2 shadow-md"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                />
              </svg>
              <span>Gọi ngay: {phoneNumber}</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCallOpen(true)}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
          aria-label="Mở hộp thoại gọi điện"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CallWidget;