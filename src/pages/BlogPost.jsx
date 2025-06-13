import { useParams, Link } from "react-router-dom";
import { FaHome, FaArrowLeft, FaCalendarAlt, FaUserMd, FaTag, FaShareAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const blogPosts = [
  {
    id: 1,
    title: "Hiểu Biết Cơ Bản Về HIV/AIDS",
    content: [
      {
        type: "paragraph",
        text: "HIV (Human Immunodeficiency Virus) tấn công hệ miễn dịch của cơ thể, làm suy giảm khả năng chống lại các bệnh nhiễm trùng và ung thư. Hiểu biết về HIV/AIDS là bước đầu tiên quan trọng trong việc phòng ngừa và điều trị."
      },
      {
        type: "heading",
        text: "Tại sao xét nghiệm định kỳ quan trọng?"
      },
      {
        type: "paragraph",
        text: "Việc xét nghiệm định kỳ giúp phát hiện sớm và điều trị kịp thời, tăng chất lượng và tuổi thọ cho người nhiễm. Đây là một phần không thể thiếu trong chiến lược phòng chống HIV/AIDS."
      },
      {
        type: "list",
        items: [
          "Xét nghiệm nhanh cho kết quả trong 20 phút",
          "Xét nghiệm miễn phí tại các trung tâm y tế",
          "Bảo mật thông tin tuyệt đối",
          "Tư vấn trước và sau xét nghiệm"
        ]
      },
      {
        type: "heading",
        text: "Biện pháp sống khỏe với HIV"
      },
      {
        type: "paragraph",
        text: "Áp dụng lối sống lành mạnh, tuân thủ điều trị ART đều đặn và sử dụng các biện pháp phòng ngừa là chìa khóa giảm lây truyền HIV và duy trì sức khỏe tốt."
      }
    ],
    date: "10/06/2025",
    category: "Kiến Thức Cơ Bản",
    author: "BS. Trần Thị Minh",
    image: "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg",
    tags: ["HIV", "AIDS", "Xét nghiệm", "Điều trị"]
  },
  {
    id: 2,
    title: "Các Con Đường Lây Truyền HIV Tại Việt Nam",
    content: [
      {
        type: "paragraph",
        text: "Hiểu rõ về các con đường lây truyền HIV là cách tốt nhất để phòng tránh và giảm thiểu nguy cơ lây nhiễm trong cộng đồng."
      },
      {
        type: "heading",
        text: "Các đường lây truyền chính"
      },
      {
        type: "list",
        items: [
          "Quan hệ tình dục không an toàn",
          "Dùng chung bơm kim tiêm",
          "Từ mẹ sang con trong quá trình mang thai, sinh nở và cho con bú",
          "Tiếp xúc với máu nhiễm HIV qua vết thương hở"
        ]
      },
      {
        type: "heading",
        text: "Biện pháp phòng ngừa"
      },
      {
        type: "paragraph",
        text: "Sử dụng bao cao su đúng cách, không dùng chung bơm kim tiêm, và xét nghiệm thường xuyên là những biện pháp hiệu quả để phòng tránh lây nhiễm HIV."
      }
    ],
    date: "12/06/2025",
    category: "Phòng Ngừa",
    author: "TS. Nguyễn Văn Hùng",
    image: "https://img.freepik.com/free-photo/doctor-examining-patient_23-2147755109.jpg",
    tags: ["Lây truyền", "Phòng ngừa", "An toàn"]
  },
  {
    id: 3,
    title: "Điều Trị ARV: Hiệu Quả và Tiếp Cận Tại Việt Nam",
    content: [
      {
        type: "paragraph",
        text: "Điều trị ARV (Antiretroviral) đã cách mạng hóa việc điều trị HIV, giúp người nhiễm có thể sống khỏe mạnh và giảm nguy cơ lây truyền."
      },
      {
        type: "heading",
        text: "Lợi ích của điều trị ARV"
      },
      {
        type: "list",
        items: [
          "Ức chế virus HIV",
          "Tăng cường hệ miễn dịch",
          "Giảm nguy cơ lây truyền",
          "Cải thiện chất lượng cuộc sống"
        ]
      },
      {
        type: "heading",
        text: "Tiếp cận điều trị tại Việt Nam"
      },
      {
        type: "paragraph",
        text: "Việt Nam đã có nhiều tiến bộ trong việc cung cấp thuốc ARV miễn phí cho người nhiễm HIV. Các trung tâm y tế địa phương đều có thể cung cấp thuốc và tư vấn điều trị."
      }
    ],
    date: "15/06/2025",
    category: "Điều Trị",
    author: "PGS.TS Lê Thị Mai",
    image: "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg",
    tags: ["ARV", "Điều trị", "Thuốc"]
  },
  {
    id: 4,
    title: "Xét Nghiệm HIV: Khi Nào và Ở Đâu?",
    content: [
      {
        type: "paragraph",
        text: "Xét nghiệm HIV là bước quan trọng trong việc phát hiện sớm và điều trị kịp thời. Hiểu rõ về thời điểm và địa điểm xét nghiệm sẽ giúp bạn chủ động hơn trong việc bảo vệ sức khỏe."
      },
      {
        type: "heading",
        text: "Khi nào nên xét nghiệm?"
      },
      {
        type: "list",
        items: [
          "Sau khi có hành vi nguy cơ 3 tháng",
          "Trước khi kết hôn",
          "Khi mang thai",
          "Định kỳ 6 tháng/lần nếu có nguy cơ cao"
        ]
      },
      {
        type: "heading",
        text: "Địa điểm xét nghiệm uy tín"
      },
      {
        type: "paragraph",
        text: "Các trung tâm y tế dự phòng, bệnh viện đa khoa và phòng khám tư nhân được cấp phép đều có thể thực hiện xét nghiệm HIV. Đặc biệt, các trung tâm y tế dự phòng cung cấp dịch vụ xét nghiệm miễn phí và bảo mật."
      }
    ],
    date: "18/06/2025",
    category: "Xét Nghiệm",
    author: "ThS. Phạm Quốc Khánh",
    image: "https://img.freepik.com/free-photo/doctor-examining-patient_23-2147755109.jpg",
    tags: ["Xét nghiệm", "Chẩn đoán", "Sức khỏe"]
  }
];

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3B9AB8]/10 via-white to-[#3B9AB8]/5 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-[#3B9AB8] mb-4">Bài viết không tồn tại</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/" 
              className="px-6 py-3 bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] text-white rounded-full hover:from-[#2D7A94] hover:to-[#3B9AB8] transition-all duration-300 flex items-center justify-center group"
            >
              <FaHome className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Về trang chủ
            </Link>
            <Link 
              to="/blog" 
              className="px-6 py-3 bg-white text-[#3B9AB8] rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
            >
              <FaArrowLeft className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Quay lại Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#3B9AB8]/10 via-white to-[#3B9AB8]/5 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Article Header */}
          <div className="relative h-64 md:h-96">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-[#3B9AB8]/10 text-[#3B9AB8]">
                  {post.category}
                </span>
                <div className="flex items-center text-white/80">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center text-white/80">
                  <FaUserMd className="w-4 h-4 mr-2" />
                  <span>{post.author}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8 prose prose-lg max-w-none">
            {post.content.map((section, index) => {
              if (section.type === "heading") {
                return (
                  <h2 key={index} className="text-2xl font-semibold text-[#3B9AB8] mt-8 mb-4 border-b border-[#3B9AB8]/20 pb-2">
                    {section.text}
                  </h2>
                );
              }
              if (section.type === "paragraph") {
                return (
                  <p key={index} className="text-[#2D7A94] mb-6 leading-relaxed">
                    {section.text}
                  </p>
                );
              }
              if (section.type === "list") {
                return (
                  <ul key={index} className="list-disc pl-6 mb-6 space-y-2 text-[#2D7A94]">
                    {section.items.map((item, i) => (
                      <li key={i} className="hover:text-[#3B9AB8] transition-colors">{item}</li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>

          {/* Tags */}
          <div className="px-8 py-6 bg-[#3B9AB8]/5 border-t border-[#3B9AB8]/20">
            <div className="flex items-center gap-2 mb-4">
              <FaTag className="w-5 h-5 text-[#3B9AB8]" />
              <span className="font-semibold text-[#3B9AB8]">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-[#3B9AB8]/10 text-[#3B9AB8] rounded-full text-sm hover:bg-[#3B9AB8]/20 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <div className="px-8 py-6 bg-[#3B9AB8]/5 border-t border-[#3B9AB8]/20">
            <div className="flex items-center gap-2 mb-4">
              <FaShareAlt className="w-5 h-5 text-[#3B9AB8]" />
              <span className="font-semibold text-[#3B9AB8]">Chia sẻ bài viết:</span>
            </div>
            <div className="flex gap-3">
              <button className="p-2 bg-[#3B9AB8] text-white rounded-full hover:bg-[#2D7A94] transition-colors">
                <FaFacebook className="w-5 h-5" />
              </button>
              <button className="p-2 bg-[#3B9AB8] text-white rounded-full hover:bg-[#2D7A94] transition-colors">
                <FaTwitter className="w-5 h-5" />
              </button>
              <button className="p-2 bg-[#3B9AB8] text-white rounded-full hover:bg-[#2D7A94] transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Article Footer */}
          <div className="px-8 py-6 bg-[#3B9AB8]/5 border-t border-[#3B9AB8]/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center text-[#3B9AB8]">
                <FaUserMd className="w-5 h-5 mr-2" />
                <span className="font-semibold">Tác giả:</span> {post.author}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/blog" 
                  className="px-6 py-3 bg-white text-[#3B9AB8] rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center group"
                >
                  <FaArrowLeft className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Quay lại Blog
                </Link>
                <Link 
                  to="/" 
                  className="px-6 py-3 bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] text-white rounded-full hover:from-[#2D7A94] hover:to-[#3B9AB8] transition-all duration-300 flex items-center group"
                >
                  <FaHome className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
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