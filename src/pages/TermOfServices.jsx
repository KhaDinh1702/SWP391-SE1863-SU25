import React from 'react';
import { useNavigate } from 'react-router-dom';
import FullNavbar from '../components/NavBar';
import Footer from '../components/Footer';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B9AB8]/10 via-white to-[#3B9AB8]/5">
      {/* NavBar */}
      <FullNavbar />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800">
        <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#3B9AB8]">
              Điều Khoản Dịch Vụ
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="mb-6 text-[#2D7A94]">
              Việc sử dụng website của chúng tôi đồng nghĩa với việc bạn đồng ý với các điều khoản dưới đây.
            </p>

            <div className="space-y-8">
              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  1. Quyền và trách nhiệm
                </h2>
                <p className="text-[#2D7A94]">
                  Bạn có quyền sử dụng dịch vụ trong phạm vi pháp luật cho phép và không gây ảnh hưởng đến người khác.
                </p>
              </section>

              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  2. Hạn chế trách nhiệm
                </h2>
                <p className="text-[#2D7A94]">
                  Chúng tôi không chịu trách nhiệm với các thiệt hại phát sinh từ việc sử dụng sai mục đích hoặc không đúng cách các dịch vụ trên website.
                </p>
              </section>

              <section className="border-l-4 border-[#3B9AB8] pl-6">
                <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-3">
                  3. Thay đổi điều khoản
                </h2>
                <p className="text-[#2D7A94]">
                  Chúng tôi có quyền thay đổi điều khoản bất kỳ lúc nào. Người dùng cần kiểm tra định kỳ để cập nhật.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}