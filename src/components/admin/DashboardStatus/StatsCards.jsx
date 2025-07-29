import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';

const StatsCards = ({ stats }) => {
  const { totalUsers, activeUsers, inactiveUsers } = stats;
  
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card className="shadow-sm">
          <Statistic
            title="Tổng số người dùng"
            value={totalUsers}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="shadow-sm">
          <Statistic
            title="Đang hoạt động"
            value={activeUsers}
            valueStyle={{ color: '#3f8600' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="shadow-sm">
          <Statistic
            title="Đã vô hiệu hóa"
            value={inactiveUsers}
            valueStyle={{ color: '#cf1322' }}
            prefix={<StopOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;
