import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaShieldAlt, FaUserShield, FaFileContract, FaClock, FaYoutube } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import boYTeLogo from '../assets/bo-y-te.jpg';
import boCongThuongLogo from '../assets/bo-cong-thuong.png';

const Footer = () => {
  const { t } = useTranslation();  const locations = [
    {
      titleKey: "footer.locations.quan5.title",
      addressKey: "footer.locations.quan5.address",
      hoursKey: "footer.locations.quan5.hours",
      map: "https://maps.app.goo.gl/r4HqLmE7puGDJmJp7",
      phone: "0943 108 138 – 028 7303 1869"
    },
    {
      titleKey: "footer.locations.tanBinh.title",
      addressKey: "footer.locations.tanBinh.address",
      hoursKey: "footer.locations.tanBinh.hours",
      map: "https://maps.app.goo.gl/cpQu7AMMPpxBVRM67",
      phone: "0901 386 618 – 028 7304 1869"
    },
    {
      titleKey: "footer.locations.haNoi.title",
      addressKey: "footer.locations.haNoi.address",
      hoursKey: "footer.locations.haNoi.hours",
      map: "https://maps.app.goo.gl/bnQLjuPq6pguu5uE8",
      phone: "0964 269 100 – 028 7300 5222"
    }
  ];
  const menuItems = [
    {
      titleKey: "footer.menu.medicalCenter",
      items: [
        { nameKey: "footer.menu.items.about", path: "/about" },
        { nameKey: "footer.menu.items.services", path: "/services" },
        { nameKey: "footer.menu.items.medicalTeam", path: "/medical-team" }
      ]
    },
    {
      titleKey: "footer.menu.help",
      items: [
        { nameKey: "footer.menu.items.faq", path: "/faq" },
        { nameKey: "footer.menu.items.appointmentGuide", path: "/appointment-guide" },
        { nameKey: "footer.menu.items.termsOfUse", path: "/terms-of-use" }
      ]
    },
    {
      titleKey: "footer.menu.legal",
      items: [
        { nameKey: "footer.menu.items.privacy", path: "/privacy" },
        { nameKey: "footer.menu.items.terms", path: "/terms" },
        { nameKey: "footer.menu.items.licenses", path: "/licenses" },
      ]
    }
  ];
  const certifications = [
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      titleKey: "footer.certifications.iso.title",
      descriptionKey: "footer.certifications.iso.description"
    },
    {
      icon: <FaUserShield className="w-6 h-6" />,
      titleKey: "footer.certifications.privacy.title",
      descriptionKey: "footer.certifications.privacy.description"
    },
    {
      icon: <FaFileContract className="w-6 h-6" />,
      titleKey: "footer.certifications.license.title",
      descriptionKey: "footer.certifications.license.description"
    }
  ];

  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-b from-[#3B9AB8] to-[#2D7A94] text-white">
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">          {/* Locations */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaMapMarkerAlt className="mr-3 text-[#C46547]" />
              <span>{t('footer.systemTitle')}</span>
            </h2>
            <div className="space-y-6">
              {locations.map((loc, index) => (
                <div key={`location-${index}`} className="group">
                  <h3 className="font-bold text-white/90 mb-3">{t(loc.titleKey)}</h3>
                  <div className="space-y-2">
                    <p className="flex items-start text-sm text-white/90">
                      <FaMapMarkerAlt className="flex-shrink-0 w-4 h-4 mr-2 mt-0.5 text-[#C46547]" />
                      <span>{t(loc.addressKey)}</span>
                    </p>
                    <p className="flex items-center text-sm text-white/80">
                      <FaClock className="w-3 h-3 mr-2 text-white/80" />
                      <span>{t(loc.hoursKey)}</span>
                    </p>
                    <p className="flex items-center text-sm text-white/90">
                      <FaPhone className="w-3 h-3 mr-2 text-white/80" />
                      <span>{loc.phone}</span>
                    </p>
                    <a 
                      href={loc.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors duration-200 mt-1"
                    >
                      <FaMapMarkerAlt className="w-3 h-3 mr-1 text-white/80" />
                      {t('footer.viewMap')}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>          {/* Menu Items */}
          {menuItems.map((section, index) => (
            <div key={`menu-${index}`} className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">{t(section.titleKey)}</h2>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={`menu-item-${index}-${i}`}>
                    <button
                      onClick={e => {
                        e.preventDefault();
                        navigate(item.path);
                        window.scrollTo(0, 0);
                      }}
                      className="text-sm text-white/80 hover:text-white flex items-center transition-colors duration-200 group w-full text-left"
                    >
                      <span className="w-2 h-2 bg-white/80 rounded-full mr-3 group-hover:bg-white transition-all duration-200"></span>
                      {t(item.nameKey)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}          {/* Contact & Social */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-6">{t('footer.contact.title')}</h2>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-white/90">
                  <div className="bg-white/10 p-2 rounded-lg mr-3">
                    <FaPhone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{t('footer.contact.hotline')}</p>
                    <p className="text-white/80">0943 108 138</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-white/90">
                  <div className="bg-white/10 p-2 rounded-lg mr-3">
                    <FaEnvelope className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{t('footer.contact.email')}</p>
                    <p className="text-white/80">info@trungtamytetonghop.vn</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{t('footer.contact.connect')}</h3>
              <div className="flex space-x-4">
                {[
                  { icon: <FaFacebook className="w-5 h-5" />, url: "https://facebook.com" },
                  { icon: <FaTwitter className="w-5 h-5" />, url: "https://twitter.com" },
                  { icon: <FaInstagram className="w-5 h-5" />, url: "https://instagram.com" },
                  { icon: <FaYoutube className="w-5 h-5" />, url: "https://www.youtube.com/@GALANTClinic" }
                ].map((social, index) => (
                  <a 
                    key={`social-${index}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>        {/* Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {certifications.map((cert, index) => (
            <div key={`cert-${index}`} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex items-start space-x-4 hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 p-3 rounded-lg text-white">
                {cert.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{t(cert.titleKey)}</h3>
                <p className="text-sm text-white/80">{t(cert.descriptionKey)}</p>
              </div>
            </div>
          ))}
        </div>        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/20">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-sm text-white/80">
              &copy; {new Date().getFullYear()} {t('footer.copyright')}
            </p>
            <p className="text-xs text-white/60 mt-1">
              {t('footer.businessInfo')}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <img src={boYTeLogo} alt="Bộ Y Tế" className="h-8 object-contain opacity-90 hover:opacity-100 transition-opacity" />
            <img src={boCongThuongLogo} alt="Bộ Công Thương" className="h-8 object-contain opacity-90 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;