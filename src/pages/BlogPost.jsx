import { useParams, Link } from "react-router-dom";

// Tất cả các bài viết đều xoay quanh chủ đề HIV
const blogPosts = [
  {
    id: 1,
    title: "Hiểu Biết Cơ Bản Về HIV/AIDS",
    content:
      "HIV (Human Immunodeficiency Virus) tấn công hệ miễn dịch của cơ thể, làm suy giảm khả năng chống lại các bệnh nhiễm trùng và ung thư. Việc xét nghiệm định kỳ giúp phát hiện sớm và điều trị kịp thời, tăng chất lượng và tuổi thọ cho người nhiễm. Áp dụng lối sống lành mạnh, tuân thủ điều trị ART đều đặn và sử dụng các biện pháp phòng ngừa (bao gồm bao cao su, PrEP, PEP) là chìa khóa giảm lây truyền HIV.",
    date: "10/06/2025",
    category: "Tổng quan HIV",
    author: "BS. Trần Minh"
  },
  {
    id: 2,
    title: "Phòng Ngừa Lây Nhiễm HIV Trong Cộng Đồng",
    content:
      "Để giảm nguy cơ lây nhiễm HIV, cần tăng cường truyền thông thay đổi hành vi, xét nghiệm tự nguyện, và sử dụng bao cao su đúng cách. Chương trình tiêm phòng vắc‑xin HIV hiện vẫn đang được nghiên cứu, vì vậy PrEP (dự phòng trước phơi nhiễm) và PEP (dự phòng sau phơi nhiễm) là những chiến lược quan trọng trong giai đoạn hiện tại. Việc tạo môi trường không kỳ thị và nâng cao nhận thức cộng đồng sẽ giúp người có nguy cơ cao chủ động tiếp cận dịch vụ y tế.",
    date: "12/06/2025",
    category: "Phòng ngừa",
    author: "Tổ Chức Y Tế Thế Giới"
  },
  {
    id: 3,
    title: "Cập Nhật Về Điều Trị PrEP Năm 2025",
    content:
      "PrEP (Pre‑Exposure Prophylaxis) là biện pháp dự phòng HIV hiệu quả, sử dụng thuốc kháng vi‑rút cho người âm tính nhưng có nguy cơ cao nhiễm HIV. Năm 2025 chứng kiến nhiều tiến bộ: thuốc PrEP tác dụng kéo dài dạng tiêm Cabotegravir mỗi 8 tuần, và viên uống kết hợp Tenofovir Alafenamide/Emtricitabine giảm tác dụng phụ trên xương và thận. Khuyến cáo mới mở rộng nhóm sử dụng, bao gồm phụ nữ mang thai nguy cơ cao và thanh thiếu niên. Việc tuân thủ lịch uống/tiêm và theo dõi định kỳ chức năng thận, gan là bắt buộc để đảm bảo hiệu quả.",
    date: "15/06/2025",
    category: "Điều trị",
    author: "BS. Nguyễn Văn A"
  }
];

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Bài viết không tồn tại</h2>
          <div className="flex justify-center space-x-4">
            <Link to="/" className="text-blue-600 hover:underline">
              Về trang chủ
            </Link>
            <Link to="/blog" className="text-blue-600 hover:underline">
              Quay lại trang Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <article className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <span className="text-sm font-semibold text-blue-600">{post.category}</span>
            <span className="text-sm text-gray-500 mx-2">•</span>
            <span className="text-sm text-gray-500">{post.date}</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="prose max-w-none text-gray-700 mb-6">
            <p>{post.content}</p>
          </div>
          <div className="text-sm text-gray-500">Tác giả: {post.author}</div>
          <div className="mt-8 flex space-x-4">
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
            <Link to="/blog" className="text-blue-600 hover:underline flex items-center">
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay lại trang Blog
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
