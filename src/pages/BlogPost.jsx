import { useParams, Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Hiểu Biết Cơ Bản Về HIV/AIDS",
    content: [
      {
        type: "paragraph",
        text: "HIV (Human Immunodeficiency Virus) tấn công hệ miễn dịch của cơ thể, làm suy giảm khả năng chống lại các bệnh nhiễm trùng và ung thư."
      },
      {
        type: "heading",
        text: "Tại sao xét nghiệm định kỳ quan trọng?"
      },
      {
        type: "paragraph",
        text: "Việc xét nghiệm định kỳ giúp phát hiện sớm và điều trị kịp thời, tăng chất lượng và tuổi thọ cho người nhiễm."
      },
      {
        type: "list",
        items: [
          "Xét nghiệm nhanh cho kết quả trong 20 phút",
          "Xét nghiệm miễn phí tại các trung tâm y tế",
          "Bảo mật thông tin tuyệt đối"
        ]
      },
      {
        type: "heading",
        text: "Biện pháp sống khỏe với HIV"
      },
      {
        type: "paragraph",
        text: "Áp dụng lối sống lành mạnh, tuân thủ điều trị ART đều đặn và sử dụng các biện pháp phòng ngừa là chìa khóa giảm lây truyền HIV."
      }
    ],
    date: "10/06/2025",
    category: "Tổng quan HIV",
    author: "BS. Trần Thị Minh",
  },
  // ... other posts
];

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Bài viết không tồn tại</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Về trang chủ
            </Link>
            <Link 
              to="/blog" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Article Header */}
          <div className="bg-blue-600 px-8 py-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white text-blue-600 text-sm font-semibold rounded-full">
                {post.category}
              </span>
              <span className="text-white text-sm">{post.date}</span>
            </div>
            <h1 className="text-3xl font-bold text-white">{post.title}</h1>
          </div>

          {/* Article Content */}
          <div className="p-8 prose prose-lg max-w-none">
            {post.content.map((section, index) => {
              if (section.type === "heading") {
                return <h2 key={index} className="text-2xl font-semibold text-gray-800 mt-8 mb-4">{section.text}</h2>;
              }
              if (section.type === "paragraph") {
                return <p key={index} className="text-gray-700 mb-6 leading-relaxed">{section.text}</p>;
              }
              if (section.type === "list") {
                return (
                  <ul key={index} className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>

          {/* Article Footer */}
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {post.author && (
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Tác giả:</span> {post.author}
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/blog" 
                  className="flex items-center px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại Blog
                </Link>
                <Link 
                  to="/" 
                  className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Về trang chủ
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}