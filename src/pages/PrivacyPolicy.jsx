import React from 'react';
import { useNavigate } from 'react-router-dom';
import boYTeLogo from '../assets/bo-y-te.jpg';
import boCongThuongLogo from '../assets/bo-cong-thuong.png';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B9AB8]/10 via-white to-[#3B9AB8]/5">
      <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800">
        <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl relative">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#3B9AB8]">
              Chính Sách Bảo Mật Thông Tin Cá Nhân
            </h1>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-[#3B9AB8] hover:bg-[#2D7A94] text-white font-medium rounded-lg transition-colors duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Về trang chủ
            </button>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="mb-6 text-[#2D7A94] italic">
              "Cam kết bảo vệ thông tin cá nhân của khách hàng là ưu tiên hàng đầu của chúng tôi. Mọi thông tin bạn cung cấp đều được bảo mật tuyệt đối theo quy định của pháp luật."
            </p>

            <div className="space-y-8">
              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  1. Mục đích thu thập và sử dụng thông tin cá nhân
                </h2>
                <p className="text-[#2D7A94]">
                  Trong giai đoạn đặt hàng, khách hàng sẽ cung cấp cho chúng tôi thông tin cá nhân liên quan: họ tên, địa chỉ, gmail, kèm các thông tin cần liên hệ khác. Chúng tôi cam kết bảo mật mọi thông tin cá nhân của khách hàng khi gửi thông tin cá nhân tới chúng tôi. Tất cả các thông tin cá nhân liên quan khách hàng gửi tới chỉ sử dụng cho mục đích liên lạc và trao đổi trực tiếp với khách trong thời gian phát sinh đơn hàng tại website của chúng tôi. Chúng tôi cam kết không trao đổi, mua bán thông tin khách hàng vì mục đích thương mại.
                </p>
              </section>

              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  2. Phạm vi sử dụng thông tin
                </h2>
                <p className="text-[#2D7A94]">
                  Cung cấp các dịch vụ đến khách hàng. Liên lạc và giải quyết đối với khách hàng trong những trường hợp đặc biệt. Không sử dụng thông tin cá nhân của khách hàng ngoài mục đích xác nhận và liên hệ khi khách hàng có nhu cầu mua sản phẩm của chúng tôi.
                </p>
              </section>

              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  3. Thời gian lưu trữ thông tin
                </h2>
                <p className="text-[#2D7A94]">
                  Thông tin khách hàng được lưu trữ tại hệ thống của chúng tôi tối thiểu là 12 tháng. Nếu trong vòng 12 tháng khách hàng không phát sinh giao dịch mới thì hệ thống sẽ xóa các thông tin khách hàng.
                </p>
              </section>

              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  4. Những người hoặc tổ chức có thể được tiếp cận với thông tin đó
                </h2>
                <p className="text-[#2D7A94]">
                  Những thông tin thu thập của thành viên sẽ được ban quản trị tiếp cận, Khách hàng và các cơ quan chức năng khi có yêu cầu.
                </p>
              </section>

              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  5. Địa chỉ của đơn vị thu thập và quản lý thông tin
                </h2>
                <div className="text-[#2D7A94] space-y-2">
                  <p><span className="font-semibold">Địa chỉ:</span> 104 Trần Bình Trọng, Phường 1, Quận 5, TP.HCM</p>
                  <p><span className="font-semibold">Hotline/Zalo/Viber:</span> 0943 108 138</p>
                </div>
              </section>

              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  6. Phương thức để người tiêu dùng chỉnh sửa dữ liệu
                </h2>
                <p className="text-[#2D7A94]">
                  Thành viên có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách liên hệ với ban quản trị website. Thành viên có quyền gửi khiếu nại nếu nội dung bảo mật thông tin cá nhân không đúng với cam kết. Khi tiếp nhận phản hồi, chúng tôi sẽ xác nhận lại thông tin, trường hợp đúng chúng tôi sẽ có hình thức xử lý phù hợp.
                </p>
              </section>

              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  7. Luật áp dụng khi xảy ra tranh chấp
                </h2>
                <p className="text-[#2D7A94]">
                  Mọi tranh chấp phát sinh giữa khách hàng và chúng tôi sẽ được hòa giải. Nếu không giải quyết được sẽ đưa ra tòa án có thẩm quyền và tuân theo pháp luật Việt Nam.
                </p>
              </section>

              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  8. Cơ chế tiếp nhận và giải quyết khiếu nại liên quan
                </h2>
                <p className="text-[#2D7A94]">
                  Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Nếu có khiếu nại, khách hàng có thể gửi yêu cầu trực tiếp đến hotline hoặc đến địa chỉ của đơn vị để được hỗ trợ nhanh chóng.
                </p>
              </section>
            </div>

            <div className="mt-12 p-6 bg-[#3B9AB8]/5 rounded-lg">
              <h3 className="text-xl font-semibold text-[#3B9AB8] mb-3">
                Bạn có câu hỏi về chính sách bảo mật?
              </h3>
              <p className="text-[#2D7A94] mb-4">
                Liên hệ ngay với chúng tôi để được giải đáp mọi thắc mắc.
              </p>
              <a 
                href="tel:0943108138" 
                className="inline-flex items-center px-6 py-3 bg-[#3B9AB8] hover:bg-[#2D7A94] text-white font-medium rounded-lg transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                0943 108 138
              </a>
            </div>
          </div>

          {/* Logos in bottom right corner */}
          <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2">
            <img src={boYTeLogo} alt="Bộ Y Tế" className="h-10 object-contain opacity-90 hover:opacity-100 transition-opacity" />
            <img src={boCongThuongLogo} alt="Bộ Công Thương" className="h-10 object-contain opacity-90 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
} 