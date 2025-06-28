import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Spin, message, Tag, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, CalendarOutlined, ContactsOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';

const PatientInfo = () => {
  const [patientData, setPatientData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientInfo();
  }, []);

  const fetchPatientInfo = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      // Lấy thông tin User trước
      const userResponse = await fetch(`http://localhost:5275/api/User/get-by-id?userId=${currentUser.userId}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserData(userData);

        // Sau đó lấy thông tin Patient
        const patientResponse = await fetch(`http://localhost:5275/api/Patient/get-by-user-id?userId=${currentUser.userId}`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (patientResponse.ok) {
          const patientData = await patientResponse.json();
          setPatientData(patientData);
        } else {
          console.error('Failed to fetch patient data');
          message.error('Không thể lấy thông tin bệnh nhân');
        }
      } else {
        console.error('Failed to fetch user data');
        message.error('Không thể lấy thông tin người dùng');
      }
    } catch (error) {
      console.error('Error fetching patient info:', error);
      message.error('Có lỗi xảy ra khi tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case 0:
        return 'Nam';
      case 1:
        return 'Nữ';
      case 2:
        return 'Khác';
      default:
        return 'Chưa xác định';
    }
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case 0:
        return 'blue';
      case 1:
        return 'pink';
      case 2:
        return 'purple';
      default:
        return 'default';
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Chưa xác định';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return `${age} tuổi`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!patientData || !userData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin bệnh nhân</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card
        title={
          <div className="flex items-center gap-4">
            <Avatar 
              size={64} 
              src={userData.profilePictureURL} 
              icon={<UserOutlined />}
              className="shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {patientData.fullName || userData.fullName || 'Chưa cập nhật'}
              </h2>
              <div className="flex items-center gap-2">
                <Tag color={getGenderColor(patientData.gender)} icon={<UserOutlined />}>
                  {getGenderText(patientData.gender)}
                </Tag>
                <Tag color="gold" icon={<CalendarOutlined />}>
                  {calculateAge(patientData.dateOfBirth)}
                </Tag>
                <Tag color={patientData.isActive ? 'green' : 'red'}>
                  {patientData.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                </Tag>
              </div>
            </div>
          </div>
        }
        className="shadow-lg"
      >
        <Descriptions 
          bordered 
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          size="middle"
        >
          {/* Thông tin cá nhân */}
          <Descriptions.Item label={<><UserOutlined className="mr-2" />Họ và tên</>} span={2}>
            <span className="font-medium text-lg">
              {patientData.fullName || userData.fullName || 'Chưa cập nhật'}
            </span>
          </Descriptions.Item>
          
          <Descriptions.Item label={<><CalendarOutlined className="mr-2" />Ngày sinh</>}>
            {formatDate(patientData.dateOfBirth)}
          </Descriptions.Item>
          
          <Descriptions.Item label={<><UserOutlined className="mr-2" />Giới tính</>}>
            <Tag color={getGenderColor(patientData.gender)}>
              {getGenderText(patientData.gender)}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label={<><MailOutlined className="mr-2" />Email</>}>
            {userData.email || 'Chưa cập nhật'}
          </Descriptions.Item>
          
          <Descriptions.Item label={<><PhoneOutlined className="mr-2" />Số điện thoại</>}>
            {userData.phoneNumber || 'Chưa cập nhật'}
          </Descriptions.Item>
          
          <Descriptions.Item label={<><HomeOutlined className="mr-2" />Địa chỉ</>} span={2}>
            {patientData.address || 'Chưa cập nhật'}
          </Descriptions.Item>
        </Descriptions>

        {/* Thông tin người liên hệ khẩn cấp */}
        {(patientData.contactPersonName || patientData.contactPersonPhone) && (
          <>
            <Divider orientation="left">
              <ContactsOutlined className="mr-2" />
              Thông tin người liên hệ khẩn cấp
            </Divider>
            <Descriptions 
              bordered 
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              size="middle"
            >
              <Descriptions.Item label="Tên người liên hệ">
                {patientData.contactPersonName || 'Chưa cập nhật'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Số điện thoại liên hệ">
                {patientData.contactPersonPhone || 'Chưa cập nhật'}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}

        {/* Thông tin hệ thống */}
        <Divider orientation="left">Thông tin hệ thống</Divider>
        <Descriptions 
          bordered 
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          size="small"
        >
          <Descriptions.Item label="ID bệnh nhân">
            <code className="bg-gray-100 px-2 py-1 rounded">
              {patientData.id}
            </code>
          </Descriptions.Item>
          
          <Descriptions.Item label="ID người dùng">
            <code className="bg-gray-100 px-2 py-1 rounded">
              {patientData.userId}
            </code>
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái ẩn danh">
            <Tag color={patientData.isAnonymous ? 'orange' : 'blue'}>
              {patientData.isAnonymous ? 'Ẩn danh' : 'Công khai'}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái hoạt động">
            <Tag color={patientData.isActive ? 'green' : 'red'}>
              {patientData.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default PatientInfo;
