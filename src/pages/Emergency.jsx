import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  FaPhone, 
  FaAmbulance, 
  FaUserMd, 
  FaHospital, 
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaHeartbeat,
  FaFirstAid,
  FaNotesMedical,
  FaChevronRight,
  FaChevronDown,
  FaShieldAlt,
  FaUserShield,
  FaCheckCircle
} from 'react-icons/fa';

const Emergency = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(null);

  const emergencyContacts = [
    {
      title: "Cấp cứu 24/7",
      number: "0943 108 138",
      description: "Đội ngũ y tế sẵn sàng hỗ trợ 24/7",
      icon: <FaAmbulance className="text-3xl" />,
      color: "from-red-600 to-red-700",
      features: ["Phản hồi nhanh chóng", "Đội ngũ chuyên môn cao", "Xe cứu thương sẵn sàng"]
    },
    {
      title: "Tư vấn khẩn cấp",
      number: "0901 386 618",
      description: "Tư vấn y tế khẩn cấp",
      icon: <FaUserMd className="text-3xl" />,
      color: "from-blue-600 to-blue-700",
      features: ["Tư vấn 24/7", "Hỗ trợ trực tuyến", "Hướng dẫn sơ cứu"]
    },
    {
      title: "Phòng khám gần nhất",
      number: "028 7303 1869",
      description: "Liên hệ phòng khám gần nhất",
      icon: <FaHospital className="text-3xl" />,
      color: "from-green-600 to-green-700",
      features: ["Cơ sở vật chất hiện đại", "Đội ngũ bác sĩ chuyên môn", "Dịch vụ toàn diện"]
    }
  ];

  const emergencySteps = [
    {
      title: "Gọi cấp cứu",
      description: "Gọi ngay số hotline cấp cứu 24/7",
      icon: <FaPhone className="text-2xl" />,
      details: "Khi gặp tình huống khẩn cấp, hãy gọi ngay số hotline của chúng tôi. Đội ngũ y tế sẽ phản hồi và hỗ trợ bạn ngay lập tức."
    },
    {
      title: "Cung cấp thông tin",
      description: "Cung cấp địa chỉ và tình trạng khẩn cấp",
      icon: <FaNotesMedical className="text-2xl" />,
      details: "Cung cấp địa chỉ chính xác và mô tả tình trạng bệnh nhân để đội ngũ y tế có thể chuẩn bị tốt nhất."
    },
    {
      title: "Sơ cứu ban đầu",
      description: "Thực hiện các bước sơ cứu theo hướng dẫn",
      icon: <FaFirstAid className="text-2xl" />,
      details: "Thực hiện các bước sơ cứu cơ bản theo hướng dẫn của nhân viên y tế qua điện thoại."
    },
    {
      title: "Chờ hỗ trợ",
      description: "Giữ bình tĩnh và chờ đội ngũ y tế đến",
      icon: <FaHeartbeat className="text-2xl" />,
      details: "Giữ bình tĩnh và theo dõi tình trạng bệnh nhân trong khi chờ đội ngũ y tế đến."
    }
  ];

  const locations = [
    {
      name: "3AE QUẬN 5",
      address: "Số 104 Trần Bình Trọng, P.1, Quận 5",
      hours: "24/7",
      phone: "0943 108 138",
      map: "https://maps.app.goo.gl/r4HqLmE7puGDJmJp7",
      services: ["Cấp cứu 24/7", "Khám bệnh", "Xét nghiệm", "Cấp phát thuốc"]
    },
    {
      name: "3AE TÂN BÌNH",
      address: "96 Ngô Thị Thu Minh, P.2, Q.Tân Bình",
      hours: "24/7",
      phone: "0901 386 618",
      map: "https://maps.app.goo.gl/cpQu7AMMPpxBVRM67",
      services: ["Cấp cứu 24/7", "Khám bệnh", "Xét nghiệm", "Cấp phát thuốc"]
    },
    {
      name: "3AE HÀ NỘI",
      address: "15 ngõ 143 Trung Kính, Cầu Giấy, Hà Nội",
      hours: "24/7",
      phone: "0964 269 100",
      map: "https://maps.app.goo.gl/bnQLjuPq6pguu5uE8",
      services: ["Cấp cứu 24/7", "Khám bệnh", "Xét nghiệm", "Cấp phát thuốc"]
    }
  ];

  const handleEmergencyCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Emergency Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl shadow-xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold"
              >
                Cấp cứu 24/7
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl"
              >
                Đội ngũ y tế của chúng tôi luôn sẵn sàng hỗ trợ bạn
              </motion.p>
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEmergencyCall("0943108138")}
                className="bg-white text-red-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-red-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaPhone className="text-xl" />
                Gọi ngay: 0943 108 138
              </motion.button>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <FaExclamationTriangle className="text-8xl opacity-50" />
              <div className="absolute inset-0 animate-ping">
                <FaExclamationTriangle className="text-8xl opacity-20" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {emergencyContacts.map((contact, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${contact.color} text-white flex items-center justify-center mb-4 shadow-lg`}>
                {contact.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{contact.title}</h3>
              <p className="text-gray-600 mb-4">{contact.description}</p>
              <ul className="space-y-2 mb-4">
                {contact.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleEmergencyCall(contact.number.replace(/\s/g, ''))}
                className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-300 flex items-center gap-2 group"
              >
                {contact.number}
                <FaArrowRight className="text-sm transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Emergency Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Các bước xử lý khẩn cấp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencySteps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setActiveStep(activeStep === index ? null : index)}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="flex justify-center">
                  {activeStep === index ? (
                    <FaChevronDown className="text-blue-600 transform transition-transform duration-300" />
                  ) : (
                    <FaChevronRight className="text-blue-600 transform transition-transform duration-300" />
                  )}
                </div>
                {activeStep === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 text-sm text-gray-600"
                  >
                    {step.details}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Locations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Địa điểm cấp cứu gần nhất</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <FaHospital />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">{location.name}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-blue-600 mt-1" />
                    <p className="text-gray-700">{location.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-600" />
                    <p className="text-gray-700">Giờ làm việc: {location.hours}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-blue-600" />
                    <p className="text-gray-700">{location.phone}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Dịch vụ:</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.services.map((service, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a 
                    href={location.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 mt-4"
                  >
                    <FaMapMarkerAlt />
                    Xem bản đồ
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Emergency; 