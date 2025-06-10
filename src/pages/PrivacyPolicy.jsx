import React from 'react';

export default function PrivacyPolicy() {
  const handleGoHome = () => {
    // Điều hướng về trang chủ
    window.location.href = '/';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 dark:text-gray-100 font-sans relative">
      {/* Nút quay về trang chủ */}
      <button 
        onClick={handleGoHome}
        className="absolute top-6 left-6 flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Về trang chủ
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        {/* Header with gradient */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 text-transparent bg-clip-text">
            Chính Sách Bảo Mật Thông Tin Cá Nhân
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Introduction */}
        <div className="mb-8 p-6 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <p className="text-lg italic">
            "Cam kết bảo vệ thông tin cá nhân của khách hàng là ưu tiên hàng đầu của chúng tôi. Mọi thông tin bạn cung cấp đều được bảo mật tuyệt đối theo quy định của pháp luật."
          </p>
        </div>

        {/* Policy sections */}
        <div className="space-y-10">
          {[
            {
              title: "1. Mục đích thu thập và sử dụng thông tin cá nhân",
              content: "Trong giai đoạn đặt hàng, khách hàng sẽ cung cấp cho chúng tôi thông tin cá nhân liên quan: họ tên, địa chỉ, gmail, kèm các thông tin cần liên hệ khác. Chúng tôi cam kết bảo mật mọi thông tin cá nhân của khách hàng khi gửi thông tin cá nhân tới chúng tôi. Tất cả các thông tin cá nhân liên quan khách hàng gửi tới chỉ sử dụng cho mục đích liên lạc và trao đổi trực tiếp với khách trong thời gian phát sinh đơn hàng tại website của chúng tôi. Chúng tôi cam kết không trao đổi, mua bán thông tin khách hàng vì mục đích thương mại."
            },
            {
              title: "2. Phạm vi sử dụng thông tin",
              content: "Cung cấp các dịch vụ đến khách hàng. Liên lạc và giải quyết đối với khách hàng trong những trường hợp đặc biệt. Không sử dụng thông tin cá nhân của khách hàng ngoài mục đích xác nhận và liên hệ khi khách hàng có nhu cầu mua sản phẩm của chúng tôi."
            },
            {
              title: "3. Thời gian lưu trữ thông tin",
              content: "Thông tin khách hàng được lưu trữ tại hệ thống của chúng tôi tối thiểu là 12 tháng. Nếu trong vòng 12 tháng khách hàng không phát sinh giao dịch mới thì hệ thống sẽ xóa các thông tin khách hàng."
            },
            {
              title: "4. Những người hoặc tổ chức có thể được tiếp cận với thông tin đó",
              content: "Những thông tin thu thập của thành viên sẽ được ban quản trị tiếp cận, Khách hàng và các cơ quan chức năng khi có yêu cầu."
            },
            {
              title: "5. Địa chỉ của đơn vị thu thập và quản lý thông tin",
              content: (
                <div className="space-y-2">
                  <p><span className="font-semibold">Địa chỉ:</span> 104 Trần Bình Trọng, Phường 1, Quận 5, TP.HCM</p>
                  <p><span className="font-semibold">Hotline/Zalo/Viber:</span> 0943 108 138</p>
                </div>
              )
            },
            {
              title: "6. Phương thức để người tiêu dùng chỉnh sửa dữ liệu",
              content: "Thành viên có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách liên hệ với ban quản trị website. Thành viên có quyền gửi khiếu nại nếu nội dung bảo mật thông tin cá nhân không đúng với cam kết. Khi tiếp nhận phản hồi, chúng tôi sẽ xác nhận lại thông tin, trường hợp đúng chúng tôi sẽ có hình thức xử lý phù hợp."
            },
            {
              title: "7. Luật áp dụng khi xảy ra tranh chấp",
              content: "Mọi tranh chấp phát sinh giữa khách hàng và chúng tôi sẽ được hòa giải. Nếu không giải quyết được sẽ đưa ra tòa án có thẩm quyền và tuân theo pháp luật Việt Nam."
            },
            {
              title: "8. Cơ chế tiếp nhận và giải quyết khiếu nại liên quan",
              content: "Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Nếu có khiếu nại, khách hàng có thể gửi yêu cầu trực tiếp đến hotline hoặc đến địa chỉ của đơn vị để được hỗ trợ nhanh chóng."
            }
          ].map((section, index) => (
            <div key={index} className="group">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    {section.title}
                  </h2>
                  <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    {typeof section.content === 'string' ? (
                      <p>{section.content}</p>
                    ) : (
                      section.content
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-lg text-white">
          <h3 className="text-xl font-bold mb-3">Bạn có câu hỏi về chính sách bảo mật?</h3>
          <p className="mb-4">Liên hệ ngay với chúng tôi để được giải đáp mọi thắc mắc.</p>
          <a 
            href="tel:0943108138" 
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            0943 108 138
          </a>
        </div>
      </div>
    </div>
  );
}