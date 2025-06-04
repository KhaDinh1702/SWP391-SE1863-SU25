import React from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Hiểu Biết Cơ Bản Về HIV/AIDS",
    summary: "HIV là gì? AIDS là gì? Cách phân biệt và các giai đoạn phát triển của bệnh.",
    category: "Kiến Thức Cơ Bản",
    date: "10/06/2025",
    author: "BS. Trần Thị Minh"
  },
  {
    id: 2,
    title: "Các Con Đường Lây Truyền HIV Tại Việt Nam",
    summary: "Nhận biết các đường lây nhiễm chính và cách phòng tránh trong cộng đồng.",
    category: "Phòng Ngừa",
    date: "12/06/2025",
    author: "TS. Nguyễn Văn Hùng"
  },
  {
    id: 3,
    title: "Điều Trị ARV: Hiệu Quả và Tiếp Cận Tại Việt Nam",
    summary: "Cập nhật phác đồ điều trị mới nhất và các địa điểm cung cấp thuốc miễn phí.",
    category: "Điều Trị",
    date: "15/06/2025",
    author: "PGS.TS Lê Thị Mai"
  },
  {
    id: 4,
    title: "Xét Nghiệm HIV: Khi Nào và Ở Đâu?",
    summary: "Hướng dẫn địa chỉ các trung tâm xét nghiệm tin cậy và chính sách bảo mật.",
    category: "Xét Nghiệm",
    date: "18/06/2025",
    author: "ThS. Phạm Quốc Khánh"
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kiến Thức Về HIV/AIDS</h1>
          <p className="text-lg text-gray-600">Cập nhật thông tin chính xác về phòng ngừa và điều trị HIV tại Việt Nam</p>
        </div>
        <Link to="/" className="text-blue-600 hover:underline flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Về trang chủ
            </Link>

        <div className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    post.category === "Kiến Thức Cơ Bản" ? "bg-blue-100 text-blue-800" :
                    post.category === "Phòng Ngừa" ? "bg-green-100 text-green-800" :
                    post.category === "Điều Trị" ? "bg-purple-100 text-purple-800" :
                    "bg-orange-100 text-orange-800"
                  }`}>
                    {post.category}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.summary}</p>
                
                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm text-gray-500">Tác giả: {post.author}</span>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tìm hiểu thêm
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;