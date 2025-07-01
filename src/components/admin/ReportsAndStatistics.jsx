import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Tabs, 
  Select, 
  DatePicker, 
  Button, 
  message, 
  Spin,
  Progress,
  Tag
} from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  HeartOutlined,
  BookOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { reportService } from '../../services/reportService';
import StatisticsOverview from './Reports/StatisticsOverview';
import MonthlyActivityChart from './Reports/MonthlyActivityChart';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsAndStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [overallStats, setOverallStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [appointmentStats, setAppointmentStats] = useState({});
  const [doctorStats, setDoctorStats] = useState({});
  const [patientStats, setPatientStats] = useState({});
  const [labResultStats, setLabResultStats] = useState({});
  const [medicalRecordStats, setMedicalRecordStats] = useState({});
  const [blogStats, setBlogStats] = useState({});
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    fetchAllStatistics();
  }, []);

  const fetchAllStatistics = async () => {
    setLoading(true);
    try {
      const [
        overall,
        users,
        appointments,
        doctors,
        patients,
        labResults,
        medicalRecords,
        blogs
      ] = await Promise.all([
        reportService.getOverallStatistics(),
        reportService.getUserStatistics(),
        reportService.getAppointmentStatistics(),
        reportService.getDoctorStatistics(),
        reportService.getPatientStatistics(),
        reportService.getLabResultStatistics(),
        reportService.getMedicalRecordStatistics(),
        reportService.getBlogStatistics()
      ]);

      setOverallStats(overall);
      setUserStats(users);
      setAppointmentStats(appointments);
      setDoctorStats(doctors);
      setPatientStats(patients);
      setLabResultStats(labResults);
      setMedicalRecordStats(medicalRecords);
      setBlogStats(blogs);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      message.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const OverviewTab = () => (
    <div>
      <StatisticsOverview 
        overallStats={overallStats}
        appointmentStats={appointmentStats}
      />
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <MonthlyActivityChart
            userStats={userStats}
            appointmentStats={appointmentStats}
            patientStats={patientStats}
          />
        </Col>
      </Row>
    </div>
  );

  const UserStatisticsTab = () => (
    <div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={userStats.total || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={userStats.active || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã vô hiệu hóa"
              value={userStats.inactive || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Phân bố theo vai trò">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(userStats.byRole || {}).map(([role, count]) => ({
                    name: role,
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(userStats.byRole || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Người dùng đăng ký theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData(userStats.byMonth)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const AppointmentStatisticsTab = () => (
    <div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng số cuộc hẹn"
              value={appointmentStats.total || 0}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã thanh toán"
              value={appointmentStats.paid || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Chưa thanh toán"
              value={appointmentStats.unpaid || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={appointmentStats.revenue || 0}
              prefix={<DollarOutlined />}
              suffix="đ"
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Trạng thái cuộc hẹn">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData(appointmentStats.byStatus)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Cuộc hẹn theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData(appointmentStats.byMonth)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1890ff" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const DoctorStatisticsTab = () => (
    <div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số bác sĩ"
              value={doctorStats.total || 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={doctorStats.active || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Ngừng hoạt động"
              value={doctorStats.inactive || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Phân bố theo chuyên khoa">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(doctorStats.bySpecialization || {}).map(([spec, count]) => ({
                    name: spec,
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(doctorStats.bySpecialization || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân bố theo kinh nghiệm">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData(doctorStats.byExperience)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#722ed1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const PatientStatisticsTab = () => (
    <div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Tổng số bệnh nhân"
              value={patientStats.total || 0}
              prefix={<HeartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Phân bố theo giới tính">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(patientStats.byGender || {}).map(([gender, count]) => ({
                    name: gender === 'Male' ? 'Nam' : 'Nữ',
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(patientStats.byGender || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố theo độ tuổi">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData(patientStats.byAgeGroup)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#eb2f96" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Bệnh nhân mới theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData(patientStats.byMonth)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#eb2f96" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const LabResultStatisticsTab = () => (
    <div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số xét nghiệm"
              value={labResultStats.total || 0}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={labResultStats.completed || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đang chờ"
              value={labResultStats.pending || 0}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Loại xét nghiệm">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(labResultStats.byTestType || {}).map(([type, count]) => ({
                    name: type,
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(labResultStats.byTestType || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Xét nghiệm theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData(labResultStats.byMonth)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#fa8c16" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Helper functions
  const getChartData = (data) => {
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value: value,
      month: key,
      count: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Báo cáo & Thống kê</h1>
        <p className="text-gray-600">Tổng quan về các hoạt động và dữ liệu hệ thống</p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder={['Từ ngày', 'Đến ngày']}
          />
          <Button type="primary" onClick={fetchAllStatistics}>
            Làm mới dữ liệu
          </Button>
        </div>
      </div>

      <Tabs 
        defaultActiveKey="overview" 
        size="large"
        items={[
          {
            key: 'overview',
            label: 'Tổng quan',
            children: <OverviewTab />
          },
          {
            key: 'users',
            label: 'Người dùng', 
            children: <UserStatisticsTab />
          },
          {
            key: 'appointments',
            label: 'Cuộc hẹn',
            children: <AppointmentStatisticsTab />
          },
          {
            key: 'doctors',
            label: 'Bác sĩ',
            children: <DoctorStatisticsTab />
          },
          {
            key: 'patients',
            label: 'Bệnh nhân',
            children: <PatientStatisticsTab />
          },
          {
            key: 'labResults',
            label: 'Xét nghiệm',
            children: <LabResultStatisticsTab />
          }
        ]}
      />
    </div>
  );
};

export default ReportsAndStatistics;
