import { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, message } from 'antd';
import { doctorService } from '../../../services/doctorService.js';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          message.error('Không tìm thấy thông tin người dùng');
          return;
        }

        const doctors = await doctorService.getAllDoctors();
        const currentDoctor = doctors.find(d => d.userId === userId);
        
        if (currentDoctor) {
          setDoctor(currentDoctor);
        } else {
          message.error('Không tìm thấy thông tin bác sĩ');
        }
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        message.error('Không thể tải thông tin bác sĩ');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <Card>
        <div className="text-center text-gray-500">
          Không tìm thấy thông tin bác sĩ
        </div>
      </Card>
    );
  }

  return (
    <Card title="Thông tin cá nhân">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Họ và tên">
          {doctor.fullName || 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Chuyên khoa">
          {doctor.specialization || 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Trình độ">
          {doctor.qualifications || 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Kinh nghiệm">
          {doctor.experience || 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Giới thiệu">
          {doctor.bio || 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {doctor.isActive ? 'Đang làm việc' : 'Nghỉ phép'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default DoctorProfile; 