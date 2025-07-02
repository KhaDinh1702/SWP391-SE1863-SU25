import React, { useEffect, useState } from 'react';
import { labResultService } from '../services/labResultService';
import { patientService } from '../services/patientService';

export default function MedicalRecordPage() {
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchLabResults = async () => {
      try {
        const allResults = await labResultService.getAllLabResults();
        const patientId = localStorage.getItem('patientId');
        const filtered = allResults.filter(lr => lr.patientId === patientId);
        setLabResults(filtered);
        // Lấy thông tin bệnh nhân nếu có kết quả
        if (filtered.length > 0) {
          try {
            const patientInfo = await patientService.getPatientById(patientId);
            setPatient(patientInfo);
          } catch (err) {
            setPatient(null); // Không lấy được thông tin bệnh nhân
          }
        }
      } catch (err) {
        setError('Không thể tải kết quả xét nghiệm.');
      } finally {
        setLoading(false);
      }
    };
    fetchLabResults();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#3B9AB8] text-center drop-shadow">Hồ sơ y tế của bạn</h1>
      {loading && <div className="flex justify-center items-center h-32"><span className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></span>Đang tải dữ liệu...</div>}
      {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
      {!loading && !error && (
        <div>
          {patient && (
            <div className="mb-8 p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow">
              <h2 className="text-xl font-semibold mb-4 text-[#3B9AB8]">Thông tin bệnh nhân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div><b>Họ tên:</b> {patient.fullName}</div>
                <div><b>Email:</b> {patient.email}</div>
                <div><b>Số điện thoại:</b> {patient.phoneNumber}</div>
                <div><b>Ngày sinh:</b> {patient.dateOfBirth}</div>
                <div><b>Giới tính:</b> {patient.gender === 0 ? 'Nam' : patient.gender === 1 ? 'Nữ' : 'Khác'}</div>
                <div><b>Địa chỉ:</b> {patient.address}</div>
              </div>
            </div>
          )}
          {labResults.length === 0 ? (
            <p className="text-center text-gray-500">Không có kết quả xét nghiệm nào.</p>
          ) : (
            <ul className="space-y-6">
              {labResults.map(lr => (
                <li key={lr.id} className="border p-6 rounded-lg shadow bg-white hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div className="text-lg font-semibold text-[#3B9AB8]">{lr.testName}</div>
                    <div className="text-sm text-gray-500">{new Date(lr.testDate).toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-2">
                    <div><b>Loại xét nghiệm:</b> {lr.testType}</div>
                    <div><b>Kết luận:</b> <span className="text-green-700 font-medium">{lr.conclusion}</span></div>
                    <div><b>Tóm tắt kết quả:</b> {lr.resultSummary}</div>
                    <div><b>Ghi chú:</b> {lr.notes}</div>
                  </div>
                  {lr.labPictures && lr.labPictures.length > 0 && (
                    <div className="mt-3">
                      <b>Ảnh phòng lab:</b>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {lr.labPictures.map(pic => (
                          <a key={pic.id} href={pic.labPictureUrl} target="_blank" rel="noopener noreferrer">
                            <img src={pic.labPictureUrl} alt={pic.labPictureName} className="w-28 h-28 object-cover border rounded-lg shadow hover:scale-105 transition-transform" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
