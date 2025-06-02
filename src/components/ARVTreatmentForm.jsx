import React from "react";

const ARVTreatmentForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("Form submitted", formData);
      // Add your submission logic here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-blue-50 p-8 rounded-lg"> {/* Blue background container */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8"> {/* Responsive row layout */}
        
        {/* Left Column - Information Section */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-4">
            ĐIỀU TRỊ ARV
          </h1>
          <h2 className="text-xl font-semibold text-center text-blue-700 mb-6">
            THANH TOÁN BẢO HIỂM Y TẾ
          </h2>

          <ul className="space-y-3 mb-6">
            {[
              "Miễn phí khám bệnh (100.000đ)",
              "Miễn phí 12 xét nghiệm ban đầu",
              "Tư nhân, bảo mật cao",
              "Nhận thuốc trong 15 phút",
              "Khám ngoài giờ hành chính (T7, CN)"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Form Section */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <div className="border-b-2 border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-center text-blue-700">
              TƯ VẤN ONLINE MIỄN PHÍ
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Số điện thoại (*)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10,11}"
                title="Số điện thoại phải có 10-11 chữ số"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đặt lịch xét nghiệm
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Gửi thông tin đăng ký"
              >
                {isSubmitting ? 'Đang gửi...' : 'GỬI THÔNG TIN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ARVTreatmentForm;