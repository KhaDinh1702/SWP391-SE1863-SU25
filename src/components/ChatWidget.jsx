import { useState, useEffect, useRef } from "react";

const ChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Tôi có thể giúp gì cho bạn về dịch vụ HIV/ARV?",
      sender: "bot",
      options: [
        "Thông tin về điều trị ARV",
        "Đăng ký khám bệnh",
        "Chi phí điều trị",
        "Chính sách bảo hiểm y tế"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const botResponses = {
  "Thông tin về điều trị ARV": {
    text: "Điều trị ARV giúp kiểm soát HIV:\n- Giảm tải lượng virus\n- Tăng CD4\n- Ngăn ngừa lây nhiễm",
    options: ["Quy trình điều trị", "Tác dụng phụ", "Hiệu quả", "Quay lại"]
  },
  "Quy trình điều trị": {
    text: "Quy trình điều trị ARV gồm:\n1. Khám đánh giá ban đầu\n2. Xét nghiệm cần thiết\n3. Bắt đầu dùng thuốc hàng ngày\n4. Tái khám định kỳ để theo dõi",
    options: ["Tác dụng phụ", "Hiệu quả", "Quay lại"]
  },
  "Tác dụng phụ": {
    text: "Một số tác dụng phụ nhẹ có thể gặp:\n- Buồn nôn\n- Mệt mỏi\n- Khó ngủ\nTuy nhiên đa phần sẽ giảm sau vài tuần đầu dùng thuốc.",
    options: ["Quy trình điều trị", "Hiệu quả", "Quay lại"]
  },
  "Hiệu quả": {
    text: "ARV rất hiệu quả nếu uống đúng:\n- Ổn định tải lượng virus (U=U)\n- Giúp sống khỏe mạnh, bình thường\n- Giảm lây truyền gần như bằng 0",
    options: ["Tác dụng phụ", "Quy trình điều trị", "Quay lại"]
  },

  "Đăng ký khám bệnh": {
    text: "Bạn có thể đăng ký khám theo 3 cách:\n1. Đến trực tiếp phòng khám\n2. Gọi hotline: 0123 456 789\n3. Đăng ký online tại website 4AE.vn",
    options: ["Đăng ký ngay", "Hướng dẫn", "Quay lại"]
  },
  "Đăng ký ngay": {
    text: "Vui lòng truy cập 4AE.vn hoặc gọi 0123 456 789 để được hướng dẫn đăng ký trực tiếp hoặc qua Zalo.",
    options: ["Hướng dẫn", "Quay lại"]
  },
  "Hướng dẫn": {
    text: "Hướng dẫn đăng ký:\n- Bước 1: Chuẩn bị CCCD và thẻ BHYT (nếu có)\n- Bước 2: Chọn thời gian phù hợp\n- Bước 3: Nhận xác nhận lịch hẹn",
    options: ["Đăng ký ngay", "Quay lại"]
  },

  "Chi phí điều trị": {
    text: "Chi phí phụ thuộc vào:\n- Bạn có BHYT hay không\n- Phác đồ sử dụng\n- Dịch vụ đi kèm (xét nghiệm, tư vấn)",
    options: ["Có BHYT", "Không BHYT", "Quay lại"]
  },
  "Có BHYT": {
    text: "Nếu có BHYT:\n✅ Hầu hết chi phí thuốc ARV và xét nghiệm định kỳ được chi trả\n✅ Đồng chi trả thấp hoặc 0 đồng\n✅ Đăng ký nơi khám ban đầu đúng tuyến",
    options: ["Thủ tục", "Danh mục", "Mức hưởng", "Quay lại"]
  },
  "Không BHYT": {
    text: "Nếu không có BHYT:\n- Bạn sẽ phải tự chi trả hoàn toàn\n- Có thể đăng ký mua BHYT tự nguyện để giảm chi phí\n- Đừng ngần ngại hỏi hỗ trợ xã hội",
    options: ["Mua BHYT", "Quay lại"]
  },
  "Mua BHYT": {
    text: "Bạn có thể mua BHYT tự nguyện tại:\n- UBND phường/xã\n- Đại lý BHXH hoặc qua cổng dịch vụ công\nGọi 1900 9068 để biết thêm chi tiết.",
    options: ["Có BHYT", "Quay lại"]
  },

  "Chính sách bảo hiểm y tế": {
    text: "BHYT hỗ trợ:\n✅ Thuốc ARV\n✅ Xét nghiệm tải lượng virus & CD4\n✅ Khám bệnh định kỳ",
    options: ["Thủ tục", "Danh mục", "Mức hưởng", "Quay lại"]
  },
  "Thủ tục": {
    text: "Thủ tục BHYT gồm:\n- Thẻ BHYT còn hạn\n- Giấy chuyển tuyến (nếu cần)\n- CCCD/CMND",
    options: ["Danh mục", "Mức hưởng", "Quay lại"]
  },
  "Danh mục": {
    text: "Danh mục chi trả gồm:\n- Thuốc ARV\n- Xét nghiệm HIV, CD4, tải lượng virus\n- Một số thuốc điều trị hỗ trợ khác",
    options: ["Thủ tục", "Mức hưởng", "Quay lại"]
  },
  "Mức hưởng": {
    text: "Người tham gia BHYT được hưởng:\n- 80% đến 100% chi phí tùy đối tượng\n- Người có công và trẻ em dưới 6 tuổi: 100%\n- Đa số khác: 80% hoặc 95%",
    options: ["Thủ tục", "Danh mục", "Quay lại"]
  },

  // Generic fallbacks
  "Quay lại": {
    text: "Bạn cần thông tin gì khác?",
    options: [
      "Thông tin về điều trị ARV",
      "Đăng ký khám bệnh",
      "Chi phí điều trị",
      "Chính sách bảo hiểm y tế"
    ]
  },
  "Quay lại menu chính": {
    text: "Tôi có thể giúp gì cho bạn?",
    options: [
      "Thông tin về điều trị ARV",
      "Đăng ký khám bệnh",
      "Chi phí điều trị",
      "Chính sách bảo hiểm y tế"
    ]
  },

  // Fallback for anything unrecognized
  default: {
    text: "Cảm ơn câu hỏi của bạn. Vui lòng liên hệ hotline 0123 456 789 hoặc truy cập 4AE.vn để được tư vấn chi tiết hơn.",
    options: ["Quay lại menu chính"]
  }
};


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);
    setInputValue("");

    setTimeout(() => {
      const response = botResponses[inputValue] || botResponses["default"];
      setMessages((prev) => [
        ...prev,
        {
          text: response.text,
          sender: "bot",
          options: response.options
        }
      ]);
    }, 800);
  };

  const handleQuickReply = (option) => {
    setMessages((prev) => [...prev, { text: option, sender: "user" }]);

    setTimeout(() => {
      const response = botResponses[option] || botResponses["default"];
      setMessages((prev) => [
        ...prev,
        {
          text: response.text,
          sender: "bot",
          options: response.options
        }
      ]);
    }, 800);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isChatOpen ? (
        <div className="w-[28rem] bg-white rounded-lg shadow-lg flex flex-col" style={{ height: "480px" }}>
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Hỗ trợ trực tuyến</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 text-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-lg text-sm whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {messages[messages.length - 1]?.options && (
              <div className="flex flex-wrap gap-2 mt-2">
                {messages[messages.length - 1].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(option)}
                    className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded hover:bg-blue-200"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
          aria-label="Mở chat hỗ trợ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
