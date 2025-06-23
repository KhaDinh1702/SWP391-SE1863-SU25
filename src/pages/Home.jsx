import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
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
import BackToTop from "../components/home/BackToTop.jsx";

export default function Home() {
  const { t } = useTranslation();  const navigate = useNavigate();
  const loggedIn = authService.isAuthenticated();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Partner logos array for easy management
  const partnerLogos = [
    "https://logos-world.net/wp-content/uploads/2020/03/Coca-Cola-Logo.png",
    "https://th.bing.com/th/id/R.1e90245986039b84305aa20206dea2ad?rik=O%2b7qNV%2fEb8xw2g&pid=ImgRaw&r=0",
    "https://static.wixstatic.com/media/9d8ed5_651b6cb038ff4917bcdbe0c58ca2c241~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/9d8ed5_651b6cb038ff4917bcdbe0c58ca2c241~mv2.png",
    "https://ebaohiem.com/images/source/tin_tuc/2019/logo-bao-hiem-xa-hoi-viet-nam.jpg",
    "https://th.bing.com/th/id/OIP.MejFHh0UQHtNM6U75aOoxgHaHa?w=512&h=512&rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3",
    "https://th.bing.com/th/id/OIP.Du9qNNvEVHtVaV8TrSHqWwAAAA?rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3",
    "https://songbangplastic.com/wp-content/uploads/2022/01/bvdhyd.jpeg",
    "https://th.bing.com/th/id/OIP.NGY9uCBfSFTUKKW9JBKqeQAAAA?rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3",
    "https://th.bing.com/th/id/R.94bd23045324c6857df1c8149af50cb3?rik=Nrv1%2bhhaJpZNQg&riu=http%3a%2f%2fconsosukien.vn%2fpic%2fNews%2fbo-giao-duc-va-dao-tao-tiep-tuc-xay-dung-va-hoan-thien-co-so-du-lieu-nganh-giao-duc.jpg&ehk=aZt4I0LoztCD%2bnKIP%2bb8fk1OCoU83e4FvHme5JD1VHY%3d&risl=&pid=ImgRaw&r=0",
    "https://th.bing.com/th/id/OIP.r8LYj7EID5rcC2m42w2zMwHaHa?rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3",
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
            <div className="text-center space-y-8">              {/* Text Content */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight animate-fade-in">
                  <span className="text-white">
                    {t('home.hero.title1')}
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d1e9f3]">
                    {t('home.hero.title2')}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed animate-fade-in-up">
                  {loggedIn 
                    ? t('home.hero.subtitle1')
                    : t('home.hero.subtitle2')
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
                  <span>{t('home.hero.bookNow')}</span>
                </button>
                <button 
                  onClick={() => navigate("/services")}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
                >
                  <GiMedicinePills className="text-lg" />
                  <span>{t('home.hero.viewServices')}</span>
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
            {/* Features */}            <div className="flex-1 w-full md:w-1/2 flex flex-col gap-5">
              <div className="bg-white rounded-xl shadow-lg px-8 py-5 flex items-center gap-4">
                <span className="text-[#0090e7] text-2xl"><FaShieldAlt /></span>
                <span className="font-bold text-[#1a237e] text-lg">{t('home.features.arv')}</span>
              </div>
              <div className="bg-white rounded-xl shadow-lg px-8 py-5 flex items-center gap-4">
                <span className="text-[#0090e7] text-2xl"><FaPhone /></span>
                <span className="font-bold text-[#1a237e] text-lg">{t('home.features.pep')}</span>
              </div>
              <div className="bg-white rounded-xl shadow-lg px-8 py-5 flex items-center gap-4">
                <span className="text-[#0090e7] text-2xl"><FaSyringe /></span>
                <span className="font-bold text-[#1a237e] text-lg">{t('home.features.vaccine')}</span>
              </div>
              <div className="bg-white rounded-xl shadow-lg px-8 py-5 flex items-center gap-4">
                <span className="text-[#0090e7] text-2xl"><FaMicroscope /></span>
                <span className="font-bold text-[#1a237e] text-lg">{t('home.features.testing')}</span>
              </div>
            </div>
          </div>
        </section>        {/* Stats Section */}
        <section className="max-w-6xl mx-auto mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { number: "15+", label: t('home.stats.experience'), icon: <FaAward className="text-2xl text-[#3B9AB8]" /> },
            { number: "10K+", label: t('home.stats.patients'), icon: <GiHealthNormal className="text-2xl text-[#3B9AB8]" /> },
            { number: "50+", label: t('home.stats.doctors'), icon: <FaUserMd className="text-2xl text-[#3B9AB8]" /> },
            { number: "24/7", label: t('home.stats.support'), icon: <FaHeadset className="text-2xl text-[#3B9AB8]" /> }          ].map((stat, index) => (
            <div key={`stat-${stat.number}-${index}`} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#3B9AB8]/20 flex flex-col items-center">
              <div className="mb-3 p-3 bg-[#d1e9f3] rounded-full">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-[#3B9AB8]">{stat.number}</h3>
              <p className="text-gray-600 text-center">{stat.label}</p>
            </div>
          ))}
        </section>        {/* Carousel Section */}
        <section className="mb-16 transform hover:scale-[1.01] transition-all duration-500 max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="bg-[#3B9AB8] p-2 rounded-xl mr-4">
              <FaBookMedical className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#3B9AB8]">{t('home.services.title')}</h2>
          </div>
          <Carousel />
        </section>        {/* CTA Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] rounded-3xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/pattern-dots.png')]"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 relative z-10">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center relative z-10">
            <button className="px-8 py-4 bg-white text-[#3B9AB8] rounded-xl hover:bg-[#f0f9fb] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold">
              <FaPhone className="text-lg" />
              <span>{t('home.cta.callNow')}</span>
            </button>
            <button 
              onClick={() => navigate("/advisory-contact")}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
            >
              <FaHeadset className="text-lg" />
              <span>{t('home.cta.contact')}</span>
            </button>
          </div>
        </section>        {/* ARV Insurance Info Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-white/90 backdrop-blur-md border border-[#3B9AB8]/20 p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#d1e9f3] text-[#3B9AB8] px-6 py-2 rounded-full mb-4">
              <FaShieldAlt className="mr-2" />
              <span className="font-semibold">{t('home.arv.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B9AB8] mb-4">
              {t('home.arv.title')}
            </h2>
            <p className="text-xl text-[#2D7A94]">
              {t('home.arv.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShieldAlt className="text-4xl text-[#3B9AB8]" />,
                title: t('home.arv.features.simple.title'),
                desc: t('home.arv.features.simple.desc')
              },
              {
                icon: <FaFileAlt className="text-4xl text-[#3B9AB8]" />,
                title: t('home.arv.features.free.title'),
                desc: t('home.arv.features.free.desc')
              },
              {
                icon: <FaUserMd className="text-4xl text-[#3B9AB8]" />,
                title: t('home.arv.features.specialist.title'),
                desc: t('home.arv.features.specialist.desc')
              },
              {
                icon: <GiMedicinePills className="text-4xl text-[#3B9AB8]" />,
                title: t('home.arv.features.quality.title'),
                desc: t('home.arv.features.quality.desc')
              },
              {
                icon: <FaHeadset className="text-4xl text-[#3B9AB8]" />,
                title: t('home.arv.features.support.title'),
                desc: t('home.arv.features.support.desc')
              },
              {
                icon: <FaAward className="text-4xl text-[#3B9AB8]" />,
                title: t('home.arv.features.trusted.title'),
                desc: t('home.arv.features.trusted.desc')
              }            ].map((item, idx) => (
              <div
                key={`arv-feature-${idx}-${item.title.slice(0, 10)}`}
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
                <h3 className="text-2xl font-bold text-[#3B9AB8] mb-3">{t('home.arv.needHelp.title')}</h3>
                <p className="text-gray-700">
                  {t('home.arv.needHelp.desc')}
                </p>
              </div>
            </div>
          </div>
        </section>               {/* Why Choose 3AE Section */}
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
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>
            </div>
            {/* Features */}
            <div className="flex-1 w-full md:w-1/2">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">{t('home.whyChoose.title')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white text-lg">
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaClock /></span> {t('home.whyChoose.features.hours')}</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaUserMd /></span> {t('home.whyChoose.features.testing')}</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaFileAlt /></span> {t('home.whyChoose.features.insurance')}</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaUserFriends /></span> {t('home.whyChoose.features.care')}</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaTruck /></span> {t('home.whyChoose.features.delivery')}</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaUserTie /></span> {t('home.whyChoose.features.expertise')}</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaMicroscope /></span> {t('home.whyChoose.features.technology')}</div>
                <div className="flex items-center gap-3"><span className="text-cyan-200"><FaTransgenderAlt /></span> {t('home.whyChoose.features.community')}</div>
              </div>
            </div>
          </div>
        </section>        {/* Doctors Section */}
        <section className="doctors-section mt-8 py-16 bg-gradient-to-br from-white to-[#3B9AB8]/5 text-center mb-20 max-w-6xl mx-auto rounded-3xl shadow-xl border border-[#3B9AB8]/20">
          <div className="mb-12">
            <div className="inline-flex items-center bg-[#d1e9f3] text-[#3B9AB8] px-6 py-2 rounded-full mb-4">
              <FaUserMd className="mr-2" />
              <span className="font-semibold">{t('home.doctors.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B9AB8] mb-2">
              {t('home.doctors.title')}
            </h2>
            <p className="text-xl text-[#2D7A94] font-semibold">
              {t('home.doctors.subtitle')}
            </p>
          </div>

          <DoctorCarousel />
        </section>        {/* News Section */}
        <section className="max-w-6xl mx-auto mb-20 bg-white/90 backdrop-blur-md border border-[#3B9AB8]/20 p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#d1e9f3] text-[#3B9AB8] px-6 py-2 rounded-full mb-4">
              <FaBookMedical className="mr-2" />
              <span className="font-semibold">{t('home.news.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B9AB8] mb-4">
              {t('home.news.title')}
            </h2>
            <p className="text-xl text-[#2D7A94]">
              {t('home.news.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.slice(0, 3).map((news, index) => (
              <div
                key={`news-${news.id || index}`}
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
                    <span>{t('home.news.readMore')}</span>
                    <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
          </div>
        </section>        {/* Partners Section - Seamless Infinite Scroll */}
        <section className="w-full py-12 bg-white border-t border-[#E63946]/20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1a237e] mb-8 tracking-wide">
            {t('home.partners.title')}
          </h2>          <div className="overflow-hidden relative">
            <div
              className="flex items-center whitespace-nowrap"              style={{
                width: 'max-content',
                animation: `scrollX 30s linear infinite`,
              }}
            >
              {/* Render two sets of logos for seamless looping */}
              {[...partnerLogos, ...partnerLogos].map((src, idx) => (
                <img
                  key={`partner-${idx}-${src.split('/').pop()?.split('.')[0] || idx}`}
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
        <BackToTop/>        {showScrollTop && (
          <button
            onClick={() => window.scrollTo(0, 0)}
            className="bg-[#3B9AB8] hover:bg-[#2D7A94] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-fade-in"
            aria-label={t('home.backToTop')}
          >
            <FaArrowUp className="text-xl" />
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}