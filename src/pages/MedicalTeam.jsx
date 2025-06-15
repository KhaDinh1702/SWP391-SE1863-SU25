import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';

const teamData = {
  'Bác sĩ': [
    {
      name: 'BS.CKI. Phạm Thanh Hiếu',
      role: 'Trưởng khoa tại GALANT',
      image: 'https://galantclinic.com/wp-content/uploads/2024/08/bac-si-hieu-galant-768x921.jpg',
      description: 'Trưởng khoa tại 3AE',
    },
    {
      name: 'BS.CKI. Nguyễn Minh Nhân',
      role: 'Bác sĩ',
      image: 'https://galantclinic.com/wp-content/uploads/2024/08/bac-si-nhan-galant.jpg',
      description: 'Bác sĩ chuyên khoa',
    },
  ],
  'Dược sĩ': [
    {
      name: 'Bùi Phong Dư',
      role: 'Dược sĩ',
      image: 'https://galantclinic.com/wp-content/uploads/2024/08/dieu-duong-vien.jpg',
      description: 'Dược sĩ',
    },
    {
      name: 'Nguyễn Văn Hiếu',
      role: 'Dược sĩ',
      image: 'https://galantclinic.com/wp-content/uploads/2024/08/duoc-si-hieu.jpg',
      description: 'Dược sĩ',
    },
    {
      name: 'Mai Huỳnh Nhật Xuân',
      role: 'Dược sĩ',
      image: 'https://galantclinic.com/wp-content/uploads/2024/08/duoc-si-xuan.jpg',
      description: 'Dược sĩ',
    },
    {
      name: 'Nguyễn Đình Tuấn Chương',
      role: 'Dược sĩ',
      image: 'https://galantclinic.com/wp-content/uploads/2024/08/duoc-si-chuong.jpg',
      description: 'Dược sĩ',
    },
  ],
  'Kỹ thuật viên xét nghiệm': [
    {
      name: 'Mông Thị Lan',
      role: 'Kỹ thuật viên xét nghiệm',
      image: 'https://galantclinic.com/wp-content/uploads/2024/08/ky-thuat-vien-xet-nghiem-lan.jpg',
      description: 'Kỹ thuật viên xét nghiệm',
    },
  ],
  'Điều dưỡng': [
    {
      name: 'Thạch Hoàng Luân',
      role: 'Điều dưỡng',
      image: 'https://galantclinic.com/wp-content/uploads/2024/08/dieu-duong-luan.jpg',
      description: 'Điều dưỡng',
    },
    {
      name: 'Nguyễn Văn Hùng',
      role: 'Điều dưỡng',
      image: 'https://galantclinic.com/wp-content/uploads/2024/08/dieu-duong-hung1.jpg',
      description: 'Điều dưỡng',
    },
  ],
};

const tabs = [
  'Tất cả',
  'Bác sĩ',
  'Điều dưỡng',
  'Dược sĩ',
  'Kỹ thuật viên xét nghiệm',
];

export default function MedicalTeam() {
  const [activeTab, setActiveTab] = useState('Tất cả');

  const displayedMembers =
    activeTab === 'Tất cả'
      ? Object.values(teamData).flat()
      : teamData[activeTab] || [];

  return (
    <div className="min-h-screen bg-[#f6fafd] flex flex-col">
      <Navbar />
      <div className="bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] py-10 px-4 md:px-0">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">ĐỘI NGŨ Y TẾ<br className="md:hidden" /> TẠI 3AE</h1>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto w-full flex-1 px-4 py-10">
        <div className="mb-8 flex flex-wrap gap-2 md:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-t-lg font-semibold text-sm md:text-base transition-colors duration-200 border-b-2 focus:outline-none ${
                activeTab === tab
                  ? 'bg-white text-[#2D7A94] border-[#3B9AB8] shadow'
                  : 'bg-[#eaf4fa] text-[#3B9AB8] border-transparent hover:bg-white/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayedMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col items-center text-center p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-[#3B9AB8] mb-4 shadow"
              />
              <h3 className="text-lg font-bold text-[#2D7A94] mb-1">{member.name}</h3>
              <p className="text-sm font-semibold text-[#3B9AB8] mb-1">{member.role}</p>
              <p className="text-xs text-gray-500">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
} 