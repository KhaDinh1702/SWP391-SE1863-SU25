import React from "react";
import { Link } from "react-router-dom";

// Make this consistent with BlogPost component
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blog</h1>
      <div className="space-y-4">
        {blogPosts.map((post) => (
          <div key={post.id} className="p-4 border rounded shadow">
            <div className="mb-2">
              <span className="text-sm font-semibold text-blue-600">{post.category}</span>
              <span className="text-sm text-gray-500 mx-2">•</span>
              <span className="text-sm text-gray-500">{post.date}</span>
            </div>
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="my-2">{post.summary}</p>
            <div className="text-sm text-gray-500 mb-2">Tác giả: {post.author}</div>
            <Link to={`/blog/${post.id}`} className="text-blue-600 hover:underline">
              Tìm hiểu thêm
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;