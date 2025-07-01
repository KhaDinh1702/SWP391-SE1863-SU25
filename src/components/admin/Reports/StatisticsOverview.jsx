import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  HeartOutlined
} from '@ant-design/icons';

const StatisticsOverview = ({ overallStats, appointmentStats }) => {
  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Tổng số người dùng"
            value={overallStats.users?.length || 0}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Tổng số cuộc hẹn"
            value={overallStats.appointments?.length || 0}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Tổng số bác sĩ"
            value={overallStats.doctors?.length || 0}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Tổng số bệnh nhân"
            value={overallStats.patients?.length || 0}
            prefix={<HeartOutlined />}
            valueStyle={{ color: '#eb2f96' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Kết quả xét nghiệm"
            value={overallStats.labResults?.length || 0}
            prefix={<ExperimentOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Hồ sơ y tế"
            value={overallStats.medicalRecords?.length || 0}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticsOverview;
