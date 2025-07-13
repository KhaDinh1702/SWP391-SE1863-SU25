import React, { useEffect, useState } from 'react';
import { labResultService } from '../services/labResultService';
import { patientService } from '../services/patientService';
import { medicalRecordService } from '../services/medicalRecordService';
import { doctorService } from '../services/doctorService';

export default function MedicalRecordPage() {
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctors, setDoctors] = useState({}); // Map doctorId -> doctorName

  useEffect(() => {
    const fetchLabResults = async () => {
      try {
        const patientId = localStorage.getItem('patientId');
        // Lấy thông tin bệnh nhân trước
        if (patientId) {
          try {
            const patientInfo = await patientService.getPatientById(patientId);
            setPatient(patientInfo);
          } catch (err) {
            setPatient(null);
          }
        }
        // Lấy danh sách bác sĩ
        try {
          const doctorList = await doctorService.getAllDoctors();
          const doctorMap = {};
          doctorList.forEach(doc => {
            doctorMap[doc.id] = doc.fullName || doc.name || doc.email || '---';
          });
          setDoctors(doctorMap);
        } catch (err) {
          setDoctors({});
        }
        // Lấy kết quả xét nghiệm
        const allResults = await labResultService.getAllLabResults();
        const filtered = allResults.filter(lr => lr.patientId === patientId);
        setLabResults(filtered);
        // Lấy lịch sử khám bệnh
        try {
          const records = await medicalRecordService.getListMedicalRecord(patientId);
          setMedicalRecords(records || []);
        } catch (err) {
          setMedicalRecords([]);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu hồ sơ y tế.');
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

          {/* Lịch sử khám bệnh */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-[#3B9AB8]">Lịch sử khám bệnh</h2>
            {medicalRecords.length === 0 ? (
              <p className="text-center text-gray-500">Không có lịch sử khám bệnh.</p>
            ) : (
              <ul className="space-y-6">
                {medicalRecords.map(record => (
                  <li key={record.id} className="border p-6 rounded-lg shadow bg-white hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <div className="text-lg font-semibold text-[#3B9AB8]">{record.diagnosis || 'Chẩn đoán'}</div>
                      <div className="text-sm text-gray-500">{new Date(record.examinationDate).toLocaleString()}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-2">
                      <div><b>Bác sĩ khám:</b> {doctors[record.doctorId] || '---'}</div>
                      <div><b>Chẩn đoán:</b> {record.diagnosis}</div>
                      <div><b>Triệu chứng:</b> {record.symptoms || '---'}</div>
                      <div><b>Đơn thuốc:</b> {record.prescription || '---'}</div>
                      <div><b>Ghi chú:</b> {record.notes}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Kết quả xét nghiệm */}
          <h2 className="text-xl font-semibold mb-4 text-[#3B9AB8]">Kết quả xét nghiệm</h2>
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
