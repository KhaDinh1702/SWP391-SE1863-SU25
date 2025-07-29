import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, CalendarOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';

const StatsCards = ({ stats }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Tổng số bác sĩ"
            value={stats.totalDoctors}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Tổng số lịch hẹn"
            value={stats.totalAppointments}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Tổng số bệnh nhân"
            value={stats.totalPatients}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Doanh thu"
            value={stats.totalRevenue}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#fa8c16' }}
            suffix="đ"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards; 