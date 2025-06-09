import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-[#10269c] border-t border-gray-200 dark:border-blue-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Medical Center */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white uppercase mb-4">
              Trung tâm y tế
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-200">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Dịch vụ</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Đội ngũ bác sĩ</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white uppercase mb-4">
              Trợ giúp
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-200">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Hướng dẫn đặt lịch</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white uppercase mb-4">
              Pháp lý
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-200">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white uppercase mb-4">
              Liên hệ
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-200">
              <li>104 Trần Bình Trọng, Quận 5, TP.HCM</li>
              <li>Hotline: 0943 108 138</li>
              <li>Email: info@trungtamyte.com</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-blue-900 mt-8 pt-8 text-center text-sm text-gray-500 dark:text-gray-300">
          © 2025 Trung Tâm Y Tế. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  )
}