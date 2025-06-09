import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaUserMd, FaArrowRight } from 'react-icons/fa';

const blogPosts = [
  {
    id: 1,
    title: "Hiểu Biết Cơ Bản Về HIV/AIDS",
    summary: "HIV là gì? AIDS là gì? Cách phân biệt và các giai đoạn phát triển của bệnh.",
    category: "Kiến Thức Cơ Bản",
    date: "10/06/2025",
    author: "BS. Trần Thị Minh",
    image: "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg"
  },
  {
    id: 2,
    title: "Các Con Đường Lây Truyền HIV Tại Việt Nam",
    summary: "Nhận biết các đường lây nhiễm chính và cách phòng tránh trong cộng đồng.",
    category: "Phòng Ngừa",
    date: "12/06/2025",
    author: "TS. Nguyễn Văn Hùng",
    image: "https://img.freepik.com/free-photo/doctor-examining-patient_23-2147755109.jpg"
  },
  {
    id: 3,
    title: "Điều Trị ARV: Hiệu Quả và Tiếp Cận Tại Việt Nam",
    summary: "Cập nhật phác đồ điều trị mới nhất và các địa điểm cung cấp thuốc miễn phí.",
    category: "Điều Trị",
    date: "15/06/2025",
    author: "PGS.TS Lê Thị Mai",
    image: "https://cdn-images.vtv.vn/zoom/640_400/2020/12/1/pchiv-16067939865091955328581-crop-16067944450441726639751.jpg"
  },
  {
    id: 4,
    title: "Xét Nghiệm HIV: Khi Nào và Ở Đâu?",
    summary: "Hướng dẫn địa chỉ các trung tâm xét nghiệm tin cậy và chính sách bảo mật.",
    category: "Xét Nghiệm",
    date: "18/06/2025",
    author: "ThS. Phạm Quốc Khánh",
    image: "https://hips.hearstapps.com/hmg-prod/images/types-of-doctors-1600114658.jpg?crop=0.670xw:1.00xh;0.0553xw,0&resize=640:*"
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl transform -skew-y-2"></div>
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Kiến Thức Về HIV/AIDS
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cập nhật thông tin chính xác về phòng ngừa và điều trị HIV tại Việt Nam
            </p>
          </div>
        </div>

        {/* Back to Home Button */}
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-50 mb-8 group"
        >
          <FaHome className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          <span>Về trang chủ</span>
        </Link>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    post.category === "Kiến Thức Cơ Bản" ? "bg-blue-100 text-blue-800" :
                    post.category === "Phòng Ngừa" ? "bg-green-100 text-green-800" :
                    post.category === "Điều Trị" ? "bg-purple-100 text-purple-800" :
                    "bg-orange-100 text-orange-800"
                  }`}>
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <FaUserMd className="w-4 h-4 mr-2" />
                  <span>{post.author}</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3">{post.summary}</p>
                
                <Link 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group"
                >
                  <span>Tìm hiểu thêm</span>
                  <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;