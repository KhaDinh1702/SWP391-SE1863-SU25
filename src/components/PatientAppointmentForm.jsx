import React, { useEffect, useState } from "react";
import axios from "axios";
import { doctorService } from "../services/api";

const API_BASE_URL = 'http://localhost:5275/api';

const PatientAppointmentForm = ({ patientId }) => {
  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    reason: "",
  });

  const [doctors, setDoctors] = useState([]);

  // Fetch danh sách bác sĩ từ API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsList = await doctorService.getAllDoctors();
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestPayload = {
      patientId,
      doctorId: formData.doctorId,
      appointmentDate: formData.appointmentDate,
      reason: formData.reason,
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/appointment/patient-create-appointment?patientId=${patientId}`,
        requestPayload
      );
      alert("Đặt lịch thành công!");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể đặt lịch"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto bg-white shadow rounded-lg mt-8">
      <h2 className="text-2xl font-semibold mb-4">Đặt lịch hẹn khám bệnh</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Chọn bác sĩ</label>
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">-- Chọn bác sĩ --</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.fullName} - {doctor.specialization}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Ngày giờ hẹn</label>
        <input
          type="datetime-local"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Lý do khám</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Đặt lịch hẹn
      </button>
    </form>
  );
};

export default PatientAppointmentForm;
