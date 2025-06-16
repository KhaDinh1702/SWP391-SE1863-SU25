import { useState, useEffect } from "react";
import Navbar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import Carousel from "../components/home/Carousel.jsx";
import CallWidget from "../components/home/CallWidget";
import ChatWidget from "../components/home/ChatWidget";
import PatientProfile from "../components/patient/PatientProfile.jsx";
import newsData from "../data/newsData";
import doctorsData from "../data/doctorsData";
import DoctorCarousel from "../components/home/DoctorCarousel.jsx";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { FaArrowRight, FaShieldAlt, FaFileAlt, FaUserMd, FaHeadset, FaAward, FaPhone, FaCalendarAlt, FaBookMedical, FaArrowUp, FaClock, FaUserFriends, FaTruck, FaMicroscope, FaTransgenderAlt, FaUserTie, FaSyringe } from "react-icons/fa";
import { GiMedicinePills, GiHealthNormal } from "react-icons/gi";

export default function Home() {
  const navigate = useNavigate();
  const loggedIn = authService.isAuthenticated();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPartnersPaused, setIsPartnersPaused] = useState(false);

  // Partner logos array for easy management
  const partnerLogos = [
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#3B9AB8]/10 via-white to-[#3B9AB8]/5 text-gray-800">
      <Navbar />
      {loggedIn && <PatientProfile />}

      <main className="flex-grow p-4 md:p-6">
        {/* Hero Section */}
        <section className="mb-16 relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3B9AB8] via-[#2D7A94] to-[#3B9AB8] opacity-95"></div>
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 animate-pulse"></div>
          
          {/* Content Container */}
          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
            <div className="text-center space-y-8">
              {/* Text Content */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight animate-fade-in">
                  <span className="text-white">
                    Chăm sóc sức khỏe toàn diện
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d1e9f3]">
                    Dịch vụ y tế 3AE
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed animate-fade-in-up">
                  {loggedIn 
                    ? "Đồng hành cùng bạn trên hành trình chăm sóc sức khỏe"
                    : "Đăng nhập để trải nghiệm dịch vụ y tế chất lượng cao"
                  }
                </p>
              </div>

              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
                <button 
                  onClick={() => navigate("/appointment-booking")}
                  className="px-8 py-4 bg-white text-[#3B9AB8] rounded-xl hover:bg-[#f0f9fb] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
                >
                  <FaCalendarAlt className="text-lg" />
                  <span>Đặt lịch khám ngay</span>
                </button>
                <button 
                  onClick={() => navigate("/services")}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
                >
                  <GiMedicinePills className="text-lg" />
                  <span>Xem dịch vụ</span>
                </button>
              </div>
            </div>
          </div>
        </section>
{/* Top Feature Section */}
        <section className="w-full bg-gradient-to-r from-[#3B9AB8] via-[#2D7A94] to-[#3B9AB8] py-12 px-2 md:px-0 mb-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Image with decoration */}
            <div className="flex-1 w-full md:w-1/2 flex justify-center relative">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#0090e7]/40 rounded-full z-0"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#1cb5fc]/30 rounded-full z-0"></div>
                <img src="src/assets/1.png" alt="Galant Person" className="relative z-10 w-72 h-80 object-cover rounded-3xl shadow-xl bg-[#1a237e]/10" />
              </div>
            </div>
            {/* Features */}
            <div className="flex-1 w-full md:w-1/2 flex flex-col gap-5">
              <div className="bg-white rounded-xl shadow-lg px-8 py-5 flex items-center gap-4">
                <span className="text-[#0090e7] text-2xl"><FaShieldAlt /></span>
                <span className="font-bold text-[#1a237e] text-lg">ARV Bảo hiểm y tế</span>
              </div>
              <div className="bg-white rounded-xl shadow-lg px-8 py-5 flex items-center gap-4">
                <span className="text-[#0090e7] text-2xl"><FaPhone /></span>
                <span className="font-bold text-[#1a237e] text-lg">PEP 72 giờ (Điều trị dự phòng HIV)</span>
              </div>
              <div className="bg-white rounded-xl shadow-lg px-8 py-5 flex items-center gap-4">
                <span className="text-[#0090e7] text-2xl"><FaSyringe /></span>
                <span className="font-bold text-[#1a237e] text-lg">Tiêm chủng (Vaccine)</span>
              </div>
              <div className="bg-white rounded-xl shadow-lg px-8 py-5 flex items-center gap-4">
                <span className="text-[#0090e7] text-2xl"><FaMicroscope /></span>
                <span className="font-bold text-[#1a237e] text-lg">Xét nghiệm   </span>
              </div>
            </div>
          </div>
        </section>
        {/* Stats Section */}
        <section className="max-w-6xl mx-auto mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { number: "15+", label: "Năm kinh nghiệm", icon: <FaAward className="text-2xl text-[#3B9AB8]" /> },
            { number: "10K+", label: "Bệnh nhân", icon: <GiHealthNormal className="text-2xl text-[#3B9AB8]" /> },
            { number: "50+", label: "Bác sĩ", icon: <FaUserMd className="text-2xl text-[#3B9AB8]" /> },
            { number: "24/7", label: "Hỗ trợ", icon: <FaHeadset className="text-2xl text-[#3B9AB8]" /> }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#3B9AB8]/20 flex flex-col items-center">
              <div className="mb-3 p-3 bg-[#d1e9f3] rounded-full">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-[#3B9AB8]">{stat.number}</h3>
              <p className="text-gray-600 text-center">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Carousel Section */}
        <section className="mb-16 transform hover:scale-[1.01] transition-all duration-500 max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="bg-[#3B9AB8] p-2 rounded-xl mr-4">
              <FaBookMedical className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#3B9AB8]">Dịch vụ nổi bật</h2>
          </div>
          <Carousel />
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] rounded-3xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/pattern-dots.png')]"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            Bạn cần tư vấn y tế?
          </h2>
          <p className="text-xl text-white/90 mb-8 relative z-10">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center relative z-10">
            <button className="px-8 py-4 bg-white text-[#3B9AB8] rounded-xl hover:bg-[#f0f9fb] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold">
              <FaPhone className="text-lg" />
              <span>Gọi ngay: 0943 108 138</span>
            </button>
            <button 
              onClick={() => navigate("/advisory-contact")}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
            >
              <FaHeadset className="text-lg" />
              <span>Liên hệ tư vấn</span>
            </button>
          </div>
        </section>

        {/* ARV Insurance Info Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-white/90 backdrop-blur-md border border-[#3B9AB8]/20 p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#d1e9f3] text-[#3B9AB8] px-6 py-2 rounded-full mb-4">
              <FaShieldAlt className="mr-2" />
              <span className="font-semibold">DỊCH VỤ ARV</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B9AB8] mb-4">
              Điều trị HIV với Bảo hiểm Y tế
            </h2>
            <p className="text-xl text-[#2D7A94]">
              Thủ tục nhanh chóng - Nhận thuốc ngay trong ngày
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShieldAlt className="text-4xl text-[#3B9AB8]" />,
                title: "Thủ tục đơn giản",
                desc: "Chỉ cần thẻ BHYT và đơn thuốc, nhận thuốc ngay"
              },
              {
                icon: <FaFileAlt className="text-4xl text-[#3B9AB8]" />,
                title: "Miễn phí xét nghiệm",
                desc: "12 chỉ số quan trọng hoàn toàn miễn phí"
              },
              {
                icon: <FaUserMd className="text-4xl text-[#3B9AB8]" />,
                title: "Bác sĩ chuyên khoa",
                desc: "Tư vấn và theo dõi điều trị tận tình"
              },
              {
                icon: <GiMedicinePills className="text-4xl text-[#3B9AB8]" />,
                title: "Thuốc chất lượng",
                desc: "Đảm bảo nguồn gốc và chất lượng thuốc ARV"
              },
              {
                icon: <FaHeadset className="text-4xl text-[#3B9AB8]" />,
                title: "Hỗ trợ 24/7",
                desc: "Đội ngũ tư vấn luôn sẵn sàng giúp đỡ"
              },
              {
                icon: <FaAward className="text-4xl text-[#3B9AB8]" />,
                title: "Uy tín hàng đầu",
                desc: "Được Bộ Y tế công nhận chất lượng"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#3B9AB8]/20 transform hover:-translate-y-2"
              >
                <div className="mb-4 p-3 bg-[#d1e9f3] rounded-full w-max mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#3B9AB8] mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
            
          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-[#3B9AB8]/10 to-[#3B9AB8]/5 p-8 rounded-2xl shadow-inner border border-[#3B9AB8]/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#3B9AB8] mb-3">Bạn đang cần điều trị ARV?</h3>
                <p className="text-gray-700">
                  Đội ngũ chuyên gia của chúng tôi sẽ tư vấn và hướng dẫn bạn quy trình đăng ký BHYT và nhận thuốc ARV miễn phí.
                </p>
              </div>
            </div>
          </div>
        </section>
               {/* Why Choose 3AE Section */}
               <section className="w-full bg-gradient-to-r from-[#3B9AB8] via-[#2D7A94] to-[#3B9AB8] py-16 px-2 md:px-0">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Video */}
            <div className="flex-1 w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-xl aspect-video rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/5g1ijpBI6Dk?start=13"
                  title="XÉT NGHIỆM HIV VÀ ĐIỀU TRỊ HIV BẢO HIỂM Y TẾ - PKDK 3AE CÓ KHÁM BHYT (ARV - BHYT)."
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
            {/* Features */}
            <div className="flex-1 w-full md:w-1/2">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">VÌ SAO NÊN CHỌN 3AE</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white text-lg">
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaClock /></span> Mở cửa xuyên suốt: 8h - 20h (T2 - CN)</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaUserMd /></span> Xét nghiệm 30 phút, nhận kết quả Online</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaFileAlt /></span> Thanh toán bằng bảo hiểm y tế</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaUserFriends /></span> Chăm sóc, hỗ trợ tâm lý xã hội, tâm thần</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaTruck /></span> Tư vấn ONLINE & Giao thuốc tại nhà</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaUserTie /></span> Bác sĩ, nhân viên có chuyên môn cao</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaMicroscope /></span> Công nghệ thiết bị y tế hiện đại</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaTransgenderAlt /></span> Đồng cảm và thấu hiểu cộng đồng LGBT+</div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section className="doctors-section mt-8 py-16 bg-gradient-to-br from-white to-[#3B9AB8]/5 text-center mb-20 max-w-6xl mx-auto rounded-3xl shadow-xl border border-[#3B9AB8]/20">
          <div className="mb-12">
            <div className="inline-flex items-center bg-[#d1e9f3] text-[#3B9AB8] px-6 py-2 rounded-full mb-4">
              <FaUserMd className="mr-2" />
              <span className="font-semibold">ĐỘI NGŨ CHUYÊN GIA</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B9AB8] mb-2">
              Bác sĩ đầu ngành tại 3AE
            </h2>
            <p className="text-xl text-[#2D7A94] font-semibold">
              Chuyên môn cao - Tận tâm - Trách nhiệm
            </p>
          </div>

          <DoctorCarousel />
        </section>

        {/* News Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-white/90 backdrop-blur-md border border-[#3B9AB8]/20 p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#d1e9f3] text-[#3B9AB8] px-6 py-2 rounded-full mb-4">
              <FaBookMedical className="mr-2" />
              <span className="font-semibold">KIẾN THỨC Y TẾ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B9AB8] mb-4">
              Tin tức & Sự kiện
            </h2>
            <p className="text-xl text-[#2D7A94]">
              Cập nhật thông tin y tế mới nhất về điều trị HIV
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.slice(0, 3).map((news, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#3B9AB8]/20 overflow-hidden flex flex-col transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm">{news.date}</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-[#3B9AB8] mb-2">{news.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{news.desc}</p>
                  <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3B9AB8] hover:text-[#2D7A94] font-medium mt-auto flex items-center gap-2 group"
                  >
                    <span>Đọc thêm</span>
                    <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
          </div>
        </section>

        {/* Partners Section - Seamless Infinite Scroll */}
        <section className="w-full py-12 bg-white border-t border-[#E63946]/20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1a237e] mb-8 tracking-wide">
            ĐỐI TÁC CỦA 3AE
          </h2>
          <div className="overflow-hidden relative">
            <div
              className="flex items-center whitespace-nowrap"
              style={{
                width: 'max-content',
                animation: `scrollX 30s linear infinite`,
                animationPlayState: isPartnersPaused ? 'paused' : 'running',
              }}
              onMouseDown={() => setIsPartnersPaused(true)}
              onMouseUp={() => setIsPartnersPaused(false)}
              onMouseLeave={() => setIsPartnersPaused(false)}
              onTouchStart={() => setIsPartnersPaused(true)}
              onTouchEnd={() => setIsPartnersPaused(false)}
            >
              {/* Render two sets of logos for seamless looping */}
              {[...partnerLogos, ...partnerLogos].map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Partner ${idx % partnerLogos.length + 1}`}
                  className="h-20 w-auto object-contain inline-block mx-6"
                  draggable="false"
                />
              ))}
            </div>
          </div>
          <style>{`
            @keyframes scrollX {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </section>

      </main>

      {/* Floating Widgets */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-row items-end gap-4">
        <CallWidget />
        <ChatWidget />
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo(0, 0)}
            className="bg-[#3B9AB8] hover:bg-[#2D7A94] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-fade-in"
            aria-label="Quay lại đầu trang"
          >
            <FaArrowUp className="text-xl" />
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}