import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import FullNavbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Licenses() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3B9AB8]/10 to-white font-sans">
      {/* NavBar */}
      <FullNavbar />
      
      {/* Main Content */}
      <div className="px-4 py-8 max-w-6xl mx-auto text-gray-800 md:px-8 md:py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#3B9AB8] mb-4">Giấy Phép Hoạt Động & Chính Sách</h1>
        <p className="text-xl md:text-2xl font-medium text-[#3B9AB8]">Thông tin pháp lý và quy định sử dụng dịch vụ tại 3AE</p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-4">I – QUY ĐỊNH CHUNG</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <p><b>Tên Miền:</b> Trang thương mại điện tử 3AE được vận hành thông qua tên miền duy nhất là <a href="https://3AEClinic.com" className="text-[#3B9AB8] underline" target="_blank" rel="noopener noreferrer">https://3AEClinic.com</a> và do Phòng Khám Đa Khoa 3AE toàn quyền quản lý và sử dụng.</p>
          <p className="mt-4"><b>Định nghĩa chung:</b></p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
            <li><b>Bên cung cấp:</b> Là Phòng Khám Đa Khoa 3AE.</li>
            <li><b>Bên sử dụng:</b> Là tổ chức, cá nhân có nhu cầu tìm hiểu thông tin về sức khỏe, đặt lịch khám chữa bệnh hoặc sử dụng các dịch vụ khác được cung cấp bởi 3AE.</li>
            <li><b>Thành viên:</b> Bao gồm bên cung cấp, bên sử dụng, cộng tác viên, và khách truy cập website.</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-4">II – QUY TRÌNH ĐẶT KHÁM BỆNH TRỰC TUYẾN</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Khách hàng tìm kiếm thông tin dịch vụ cần sử dụng tại <a href="https://3AEClinic.com" className="text-[#3B9AB8] underline" target="_blank" rel="noopener noreferrer">www.3AEClinic.com</a>.</li>
            <li>Khách hàng kiểm tra giá và thông tin chi tiết của dịch vụ, nếu đồng ý, khách hàng có thể nhấn vào nút đặt lịch khám.</li>
            <li>Điền đầy đủ thông tin theo mẫu (Họ tên, Điện thoại, Email,…).</li>
            <li>Khách hàng kiểm tra email để xác nhận thông tin.</li>
            <li>Sau khi nhận thông tin của người sử dụng dịch vụ, bộ phận CSKH của 3AE sẽ liên lạc với khách hàng thông qua số điện thoại đã cung cấp để xác thực thông tin đặt lịch khám chữa bệnh. Trường hợp khách hàng không cung cấp đầy đủ thông tin hoặc 3AE nghi ngờ thông tin không chính xác, chúng tôi có quyền từ chối dịch vụ và sẽ thông báo đến khách hàng qua điện thoại hoặc email đã cung cấp.</li>
            <li>3AE có thể thực hiện dịch vụ ngay tại địa chỉ khách hàng đã cung cấp hoặc khách hàng đến trực tiếp các cơ sở bệnh viện/phòng khám của 3AE để sử dụng dịch vụ.</li>
          </ol>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-4">III – QUY TRÌNH GIAO NHẬN, VẬN CHUYỂN</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <p className="text-gray-700">3AE thực hiện giao hồ sơ, kết quả khám chữa bệnh tận tay bệnh nhân. Sau khi nhận thông tin từ khách hàng và đã xác thực thông tin sử dụng dịch vụ qua điện thoại, 3AE sẽ tiến hành thực hiện dịch vụ theo yêu cầu của quý khách hàng.</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-4">IV – PHƯƠNG THỨC THANH TOÁN</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Thanh toán trực tiếp tại bệnh viện, phòng khám.</li>
            <li>Nhân viên phòng khám thu tiền tận nơi khi thăm khám tại nhà.</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-4">VI – ĐẢM BẢO AN TOÀN GIAO DỊCH</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <p className="text-gray-700">Để đảm bảo các giao dịch được tiến hành thành công và hạn chế tối đa rủi ro, khách hàng nên cung cấp thông tin đầy đủ và chính xác (tên, địa chỉ, số điện thoại, email) khi sử dụng các dịch vụ tại 3AE.</p>
          <p className="text-gray-700 mt-2">Trường hợp thăm khám và lấy mẫu tại địa chỉ của khách hàng, quý khách hàng chỉ nên thanh toán sau khi đã sử dụng đầy đủ dịch vụ và hài lòng với chất lượng dịch vụ.</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#3B9AB8] mb-4">VII – CHÍNH SÁCH BẢO MẬT THÔNG TIN</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><b>Bảo vệ thông tin khách hàng:</b> 3AE cam kết bảo mật thông tin cá nhân của khách hàng nhằm tôn trọng và bảo vệ quyền lợi cá nhân của người mua.</li>
            <li><b>Mục đích và phạm vi thu thập:</b> Để truy cập và sử dụng một số dịch vụ tại <a href="https://3AEClinic.com" className="text-[#3B9AB8] underline" target="_blank" rel="noopener noreferrer">https://3AEClinic.com</a>, khách hàng có thể cần cung cấp thông tin cá nhân (Email, Họ tên, Số điện thoại…). Tất cả thông tin khai báo phải đảm bảo tính chính xác và hợp pháp. 3AE không chịu trách nhiệm pháp lý liên quan đến thông tin khai báo.</li>
            <li>Chúng tôi cũng có thể thu thập thông tin về số lần truy cập, số trang bạn xem, số liên kết bạn click và các thông tin khác liên quan đến việc kết nối đến website 3AEClinic.com.</li>
            <li><b>Phạm vi sử dụng thông tin:</b> 3AE thu thập và sử dụng thông tin cá nhân của bạn với mục đích phù hợp và hoàn toàn tuân thủ nội dung của Chính sách bảo mật này.</li>
            <li><b>Thời gian lưu trữ thông tin:</b> Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc khách hàng tự thực hiện hủy bỏ thông qua trang quản lý tài khoản.</li>
          </ul>
          <div className="mt-6">
            <p className="text-gray-700 font-semibold">Đơn vị thu thập và quản lý thông tin cá nhân:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li><b>CÔNG TY CỔ PHẦN GREENBIZ – PHÒNG KHÁM ĐA KHOA 3AE</b></li>
              <li>Giấy chứng nhận đăng ký doanh nghiệp số: 0313657065</li>
              <li>Website: <a href="https://3AEclinic.com/" className="text-[#3B9AB8] underline" target="_blank" rel="noopener noreferrer">https://3AEclinic.com/</a></li>
              <li>Địa chỉ:  Số 104 Trần Bình Trọng, P.1, Quận 5</li>
            </ul>
          </div>
          <div className="mt-6 text-gray-700">
            <b>Cam kết bảo mật thông tin khách hàng:</b> 3AE cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Việc thu thập và sử dụng thông tin của khách hàng chỉ được thực hiện khi có sự đồng ý của khách hàng trừ những trường hợp pháp luật yêu cầu khác.
          </div>
        </div>
      </section>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 