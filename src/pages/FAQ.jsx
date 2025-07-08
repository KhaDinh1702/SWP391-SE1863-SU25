import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import FullNavbar from '../components/NavBar';
import Footer from '../components/Footer';

const FAQ = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqData = {
    "Kiến thức cơ bản về HIV/AIDS": [
      {
        question: "HIV/AIDS - những điều bạn cần biết",
        answer: "HIV là virus gây suy giảm miễn dịch ở người, có thể dẫn đến AIDS nếu không được điều trị. Hiểu biết về HIV/AIDS giúp phòng tránh và điều trị hiệu quả."
      },
      {
        question: "Sống khỏe mạnh khi có H",
        answer: "Với điều trị ARV đúng cách, người nhiễm HIV có thể sống khỏe mạnh và có tuổi thọ gần như người bình thường. Điều quan trọng là tuân thủ điều trị và duy trì lối sống lành mạnh."
      },
      {
        question: "Hướng dẫn đặt lịch",
        answer: "Để đặt lịch khám, vui lòng tham khảo hướng dẫn chi tiết tại đây.",
        link: "/appointment-guide"
      }
    ],
    "Quan hệ tình dục an toàn": [
      {
        question: "Sử dụng chất khi quan hệ tình dục",
        answer: "Việc sử dụng chất kích thích khi quan hệ tình dục có thể làm tăng nguy cơ lây nhiễm HIV do giảm khả năng nhận thức và bảo vệ bản thân."
      },
      {
        question: '"Bệnh tình dục đồng giới" đúng hay sai?',
        answer: "Không có 'bệnh tình dục đồng giới'. HIV/AIDS có thể lây nhiễm cho bất kỳ ai, không phân biệt xu hướng tính dục. Đây là quan niệm sai lầm cần được loại bỏ."
      },
      {
        question: "Nam quan hệ tình dục đồng giới - những điều chưa biết",
        answer: "Cần hiểu rõ về các biện pháp phòng tránh, xét nghiệm định kỳ và các dịch vụ hỗ trợ dành cho cộng đồng MSM."
      }
    ],
    "Điều trị và Phòng ngừa": [
      {
        question: "SỬ DỤNG PREP HÀNG NGÀY LÀM GIẢM NGUY CƠ NHIỄM HIV QUA ĐƯỜNG TÌNH DỤC TRÊN 90%",
        answer: "PrEP là phương pháp dự phòng trước phơi nhiễm, sử dụng thuốc ARV để ngăn ngừa lây nhiễm HIV. Khi sử dụng đúng cách, hiệu quả bảo vệ có thể lên đến trên 90%."
      },
      {
        question: "Không phát hiện = Không lây truyền (K=K)",
        answer: "Khi người nhiễm HIV được điều trị ARV hiệu quả và tải lượng virus dưới ngưỡng phát hiện, họ không thể lây truyền HIV cho bạn tình qua đường tình dục."
      },
      {
        question: "Phương pháp điều trị HIV mới và thử nghiệm",
        answer: "Các phương pháp điều trị mới như islatravir đang được nghiên cứu và cho thấy nhiều hứa hẹn. Các thử nghiệm lâm sàng cho thấy sự thay đổi tế bào bạch cầu không làm tăng nguy cơ nhiễm trùng."
      }
    ],
    "Tin tức và Nghiên cứu": [
      {
        question: "Tin tốt cho phụ nữ và PrEP: liều lượng hàng quý có thể hiệu quả",
        answer: "Nghiên cứu mới cho thấy PrEP dạng tiêm hàng quý có thể là lựa chọn hiệu quả cho phụ nữ, giúp tăng khả năng tuân thủ điều trị."
      },
      {
        question: "Phong trào Không phát hiện = Không lây truyền ở Đài Loan",
        answer: "Đài Loan đã triển khai thành công chiến dịch K=K, giúp giảm kỳ thị và tăng cường tiếp cận điều trị HIV."
      }
    ]
  };

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
    setOpenQuestion(null);
  };

  const toggleQuestion = (question) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3B9AB8]/10 to-white font-sans">
      {/* NavBar */}
      <FullNavbar />
      
      {/* Main Content */}
      <div className="px-4 py-8 max-w-6xl mx-auto text-gray-800 md:px-8 md:py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#3B9AB8] mb-4">Câu Hỏi Thường Gặp</h1>
          <p className="text-xl md:text-2xl font-medium text-[#3B9AB8]">Tìm hiểu thông tin quan trọng về HIV/AIDS</p>
        </div>

      <div className="space-y-8">
        {Object.entries(faqData).map(([category, questions]) => (
          <div
            key={category}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#3B9AB8]/10"
          >
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-[#3B9AB8]/5 transition-colors duration-300"
            >
              <h2 className="text-xl font-bold text-[#3B9AB8]">{category}</h2>
              {openCategory === category ? (
                <FaChevronUp className="text-[#3B9AB8] text-lg" />
              ) : (
                <FaChevronDown className="text-[#3B9AB8] text-lg" />
              )}
            </button>

            <AnimatePresence>
              {openCategory === category && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 space-y-4">
                    {questions.map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-[#3B9AB8]/10 last:border-0 pb-4 last:pb-0"
                      >
                        <button
                          onClick={() => toggleQuestion(item.question)}
                          className="w-full text-left flex justify-between items-center group"
                        >
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#3B9AB8] transition-colors">
                            {item.question}
                          </h3>
                          {openQuestion === item.question ? (
                            <FaChevronUp className="text-[#3B9AB8]" />
                          ) : (
                            <FaChevronDown className="text-[#3B9AB8]" />
                          )}
                        </button>
                        <AnimatePresence>
                          {openQuestion === item.question && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-3 text-gray-700 pl-2 pr-4"
                            >
                              {item.answer}
                              {item.link && (
                                <>
                                  {' '}
                                  <Link to={item.link} className="text-[#3B9AB8] underline hover:text-[#2D7A94] transition-colors ml-2">Xem hướng dẫn đặt lịch</Link>
                                </>
                              )}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQ;