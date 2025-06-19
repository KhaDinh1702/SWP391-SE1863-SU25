import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const locations = [
  {
    name: 'Quận 5',
    clinic: 'PHÒNG KHÁM ĐA KHOA 3AE',
    address: 'Số 104 Trần Bình Trọng, P.1, Quận 5',
    hotline: '0943 108 138',
    tel: '028. 7303 1869',
    hours: '7:00 – 20:00 (Thứ 2 – chủ nhật)',
    map: 'https://maps.app.goo.gl/r4HqLmE7puGDJmJp7',
    zalo: '0943108138',
    zaloLink: 'https://zalo.me/0943108138',
    official: '0943108138',
  },
  {
    name: 'Tân Bình',
    clinic: 'PHÒNG KHÁM ĐA KHOA 3AE',
    address: '96 Ngô Thị Thu Minh, P.2, Q.Tân Bình',
    hotline: '0901 386 618',
    tel: '028. 7304 1869',
    hours: '11:00 – 20:00 (Thứ 2 – Thứ 7)',
    map: 'https://maps.app.goo.gl/cpQu7AMMPpxBVRM67',
    zalo: '0901386618',
    zaloLink: 'https://zalo.me/0901386618',
    official: '0901386618',
  },
  {
    name: 'Hà Nội',
    clinic: 'PHÒNG KHÁM ĐA KHOA 3AE',
    address: '15 ngõ 143 Trung Kính, Cầu Giấy, Hà Nội',
    hotline: '0964 269 100',
    tel: '028. 7300 5222',
    hours: '09:00 – 20:00 (Thứ 2 – Chủ nhật)',
    map: 'https://maps.app.goo.gl/bnQLjuPq6pguu5uE8',
    zalo: '0964269100',
    zaloLink: 'https://zalo.me/0964269100',
    official: '0964269100',
  },
];

export default function AdvisoryContact() {
  const [selected, setSelected] = useState(0);
  const loc = locations[selected];
  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Navbar />
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
      </div>
      <main className="flex-1 max-w-6xl mx-auto w-full py-8 px-2 md:px-0">
        <div className="flex gap-4 mb-4">
          {locations.map((l, i) => (
            <button
              key={l.name}
              onClick={() => setSelected(i)}
              className={`px-4 py-2 border rounded-t font-semibold text-base transition-colors ${selected === i ? 'bg-white border-gray-300 text-[#0d2880]' : 'bg-[#f5f7ff] border-transparent text-[#0d2880]/70 hover:bg-white/80'}`}
            >
              {l.name}
            </button>
          ))}
        </div>
        <div className="border border-gray-300 bg-white rounded shadow p-6">
          <div className="font-bold text-lg mb-2">{loc.clinic}</div>
          <div className="mb-1"><span className="font-semibold">Địa chỉ:</span> {loc.address}</div>
          <div className="mb-1"><span className="font-semibold">Hotline/Zalo:</span> <a href={`tel:${loc.hotline.replace(/\s/g, '')}`} className="text-blue-700 font-bold hover:underline">{loc.hotline}</a> <span className="text-gray-500">– Tel: {loc.tel}</span></div>
          <div className="mb-1"><span className="font-semibold">Giờ làm việc:</span> {loc.hours}</div>
          <div className="mb-1"><span className="font-semibold">Tìm đường:</span> <a href={loc.map} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">{loc.map}</a></div>
          <div className="mb-1"><span className="font-semibold">Zalo Official Account:</span> <a href={loc.zaloLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">{loc.official}</a></div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 