import { Card, Col, Row } from 'antd';

const StatsCards = ({ stats }) => {
  const { totalUsers, newUsers, activeAppointments, completedTreatments } = stats;
  return (
    <Row gutter={16}>
      <Col span={6}><Card title="Total Users">{totalUsers}</Card></Col>
      <Col span={6}><Card title="New Users Today">{newUsers}</Card></Col>
      <Col span={6}><Card title="Active Appointments">{activeAppointments}</Card></Col>
      <Col span={6}><Card title="Completed Treatments">{completedTreatments}</Card></Col>
    </Row>
  );
};

export default StatsCards;
