import { Layout, Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';

const { Header } = Layout;

const DoctorHeader = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.warn('No user ID found');
          return;
        }

        const doctors = await doctorService.getAllDoctors();
        const currentDoctor = doctors.find(d => d.userId === userId);
        if (currentDoctor) {
          setDoctor(currentDoctor);
        }
      } catch (error) {
        console.error('Error fetching doctor info:', error);
      }
    };

    fetchDoctorInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const items = [
    {
      key: 'profile',
      label: 'Hồ sơ',
      icon: <UserOutlined />,
      onClick: () => navigate('/doctor/profile')
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px #f0f1f2',
      }}
    >
      <div className="text-lg font-semibold">
        {doctor?.fullName || 'Bác sĩ'}
      </div>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space className="cursor-pointer">
          <Avatar icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </Header>
  );
};

export default DoctorHeader; 