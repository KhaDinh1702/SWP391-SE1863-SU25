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
  Tag,
  Modal,
  Descriptions
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
  Line,
  Legend
} from 'recharts';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  HeartOutlined,
  BookOutlined,
  DollarOutlined,
  EyeOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { reportService } from '../../services/reportService';
import { paymentTransactionService } from '../../services/paymentTransactionService';
import { API_BASE_URL, getAuthHeaders } from '../../services/config';
import StatisticsOverview from './Reports/StatisticsOverview';
import MonthlyActivityChart from './Reports/MonthlyActivityChart';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Map user role numbers to names based on UserRole.cs enum
const USER_ROLE_NAMES = {
  0: 'Bệnh nhân',
  1: 'Nhân viên', 
  2: 'Bác sĩ',
  3: 'Quản lý',
  4: 'Admin'
};

const ReportsAndStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [overallStats, setOverallStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [appointmentStats, setAppointmentStats] = useState({});
  const [doctorStats, setDoctorStats] = useState({});
  const [patientStats, setPatientStats] = useState({});
  const [medicalRecordStats, setMedicalRecordStats] = useState({});
  const [revenueStats, setRevenueStats] = useState({});
  const [paymentTransactions, setPaymentTransactions] = useState([]);
  const [paymentStats, setPaymentStats] = useState({});
  const [dateRange, setDateRange] = useState([]);
  
  // Payment transaction modal states
  const [paymentDetailModalVisible, setPaymentDetailModalVisible] = useState(false);
  const [selectedPaymentTransaction, setSelectedPaymentTransaction] = useState(null);

  useEffect(() => {
    fetchAllStatistics();
  }, []);

  const fetchAllStatistics = async () => {
    setLoading(true);
    try {
      // Prepare date range for payment transactions
      let fromDate = null;
      let toDate = null;
      
      if (dateRange && dateRange.length === 2) {
        fromDate = dateRange[0].startOf('day').toISOString();
        toDate = dateRange[1].endOf('day').toISOString();
      }

      // Fetch statistics with individual error handling (removed blog and lab result services)
      const results = await Promise.allSettled([
        reportService.getOverallStatistics(),
        reportService.getUserStatistics(),
        reportService.getAppointmentStatistics(),
        reportService.getDoctorStatistics(),
        reportService.getPatientStatistics(),
        reportService.getMedicalRecordStatistics(),
        reportService.getRevenueStatistics(),
        paymentTransactionService.getAllPaymentTransactions(fromDate, toDate)
      ]);

      // Extract successful results and handle failures gracefully
      const [
        overall,
        users,
        appointments,
        doctors,
        patients,
        medicalRecords,
        revenue,
        payments
      ] = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          const apiNames = [
            'Overall Statistics',
            'User Statistics', 
            'Appointment Statistics',
            'Doctor Statistics',
            'Patient Statistics',
            'Medical Record Statistics',
            'Revenue Statistics',
            'Payment Transactions'
          ];
          console.warn(`Failed to fetch ${apiNames[index]}:`, result.reason);
          return {}; // Return empty object for failed requests
        }
      });

      setOverallStats(overall || {});
      setUserStats(users || {});
      setAppointmentStats(appointments || {});
      setDoctorStats(doctors || {});
      setPatientStats(patients || {});
      setMedicalRecordStats(medicalRecords || {});
      setRevenueStats(revenue || {});
      setPaymentTransactions(Array.isArray(payments) ? payments : []);
      
      // Calculate payment statistics
      calculatePaymentStatistics(Array.isArray(payments) ? payments : []);

      // Show warning if some APIs failed
      const failedApis = results.filter(result => result.status === 'rejected').length;
      if (failedApis > 0) {
        message.warning(`Đã tải được dữ liệu nhưng ${failedApis} API gặp lỗi. Một số thống kê có thể không đầy đủ.`);
      } else {
        message.success('Đã tải thành công tất cả dữ liệu thống kê');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      message.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const calculatePaymentStatistics = (transactions) => {
    if (!transactions || transactions.length === 0) {
      setPaymentStats({});
      return;
    }

    const stats = {
      total: transactions.length,
      successful: transactions.filter(t => t.paymentStatus === 'Success' || t.paymentStatus === 1).length,
      pending: transactions.filter(t => t.paymentStatus === 'Pending' || t.paymentStatus === 0).length,
      failed: transactions.filter(t => t.paymentStatus === 'Failed' || t.paymentStatus === 2).length,
      totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      byMethod: {},
      byMonth: {},
      byStatus: {}
    };

    // Group by payment method
    transactions.forEach(transaction => {
      const method = transaction.paymentMethod || 'Unknown';
      stats.byMethod[method] = (stats.byMethod[method] || 0) + 1;
    });

    // Group by month
    transactions.forEach(transaction => {
      const month = dayjs(transaction.createdDate || transaction.paymentDate).format('MM/YYYY');
      stats.byMonth[month] = (stats.byMonth[month] || 0) + (transaction.amount || 0);
    });

    // Group by status
    transactions.forEach(transaction => {
      const status = getPaymentStatusLabel(transaction.paymentStatus);
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    });

    setPaymentStats(stats);
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 0:
      case 'Pending':
        return 'Đang xử lý';
      case 1:
      case 'Success':
        return 'Thành công';
      case 2:
      case 'Failed':
        return 'Thất bại';
      default:
        return 'Không xác định';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 0:
      case 'Pending':
        return 'orange';
      case 1:
      case 'Success':
        return 'green';
      case 2:
      case 'Failed':
        return 'red';
      default:
        return 'default';
    }
  };

  const getGenderLabel = (gender) => {
    // Convert string to lowercase for comparison
    const genderStr = String(gender).toLowerCase();
    
    switch (genderStr) {
      case 'male':
      case '0':
        return 'Nam';
      case 'female':
      case '1':
        return 'Nữ';
      case 'other':
      case '2':
        return 'Khác';
      default:
        console.log('Unknown gender value:', gender); // Debug log
        return 'Không xác định';
    }
  };

  const handleViewPaymentDetail = (transaction) => {
    setSelectedPaymentTransaction(transaction);
    setPaymentDetailModalVisible(true);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return dayjs(dateTime).format('DD/MM/YYYY HH:mm:ss');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 đ';
    return `${amount.toLocaleString('vi-VN')} đ`;
  };

  const refreshPaymentTransactions = async () => {
    try {
      let fromDate = null;
      let toDate = null;
      
      if (dateRange && dateRange.length === 2) {
        fromDate = dateRange[0].startOf('day').toISOString();
        toDate = dateRange[1].endOf('day').toISOString();
        message.info(`Tải dữ liệu từ ${dateRange[0].format('DD/MM/YYYY')} đến ${dateRange[1].format('DD/MM/YYYY')}`);
      }
      
      const result = await paymentTransactionService.getAllPaymentTransactions(fromDate, toDate);
      setPaymentTransactions(Array.isArray(result) ? result : []);
      calculatePaymentStatistics(Array.isArray(result) ? result : []);
      message.success('Đã cập nhật dữ liệu giao dịch thanh toán');
    } catch (error) {
      console.error('Error refreshing payment transactions:', error);
      message.error('Không thể tải dữ liệu giao dịch thanh toán');
    }
  };

  const OverviewTab = () => (
    <div>
      <StatisticsOverview 
        overallStats={overallStats}
        appointmentStats={appointmentStats}
        revenueStats={revenueStats}
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
                    name: USER_ROLE_NAMES[role] || `Role ${role}`,
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(userStats.byRole || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
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

  const AppointmentStatisticsTab = () => {
    // Tính số lượng cuộc hẹn đã thanh toán
    const appointments = appointmentStats.list || [];
    const paidAppointments = appointments.filter(
      apt => apt.status === 1 || apt.status === 'Confirmed' || apt.isPaid === true || apt.paymentStatus === 'Paid'
    );
    const paidCount = paidAppointments.length;

    return (
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
                title="Tổng doanh thu"
                value={revenueStats.totalRevenue || 0}
                prefix={<DollarOutlined />}
                suffix="đ"
                valueStyle={{ color: '#fa541c' }}
                formatter={(value) => value.toLocaleString('vi-VN')}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Trạng thái cuộc hẹn">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={Object.entries(appointmentStats.byStatus || {}).map(([status, count]) => ({
                  name: getAppointmentStatusLabel(Number(status)),
                  value: count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1890ff" >
                    {Object.entries(appointmentStats.byStatus || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getAppointmentStatusColor(entry[0])} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

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
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(doctorStats.bySpecialization || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
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
                    name: getGenderLabel(gender),
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
                <Legend />
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

  const RevenueAndPaymentTab = () => (
    <div>
      {/* Phần thống kê doanh thu */}
      <Card title="Thống kê doanh thu" className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={revenueStats.totalRevenue || 0}
                prefix={<DollarOutlined />}
                suffix="đ"
                valueStyle={{ color: '#3f8600' }}
                formatter={(value) => value.toLocaleString('vi-VN')}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Lịch hẹn đã thanh toán"
                value={revenueStats.totalPaidAppointments || 0}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Doanh thu trung bình/lịch hẹn"
                value={Math.round(revenueStats.averageRevenuePerAppointment || 0)}
                suffix="đ"
                valueStyle={{ color: '#fa541c' }}
                formatter={(value) => value.toLocaleString('vi-VN')}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Tăng trưởng tháng"
                value={revenueStats.monthlyGrowth || 0}
                suffix="%"
                valueStyle={{ 
                  color: (revenueStats.monthlyGrowth || 0) >= 0 ? '#3f8600' : '#cf1322'
                }}
                prefix={
                  (revenueStats.monthlyGrowth || 0) >= 0 ? '↑' : '↓'
                }
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Phần thống kê giao dịch thanh toán */}
      <Card title="Thống kê giao dịch thanh toán" className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Tổng giao dịch"
                value={paymentStats.total || 0}
                prefix={<CreditCardOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Thành công"
                value={paymentStats.successful || 0}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Đang xử lý"
                value={paymentStats.pending || 0}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Thất bại"
                value={paymentStats.failed || 0}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Phần biểu đồ phân bố giao dịch */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Phân bố theo trạng thái">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(paymentStats.byStatus || {}).map(([status, count]) => ({
                    name: status,
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(paymentStats.byStatus || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân bố theo phương thức">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData(paymentStats.byMethod)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#13c2c2" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Phần danh sách giao dịch */}
      <PaymentTransactionTable />
    </div>
  );

  const PaymentTransactionTable = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
      },
      {
        title: 'Mã giao dịch',
        dataIndex: 'transactionId',
        key: 'transactionId',
        render: (text) => text || 'N/A',
      },
      {
        title: 'Số tiền',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount) => formatCurrency(amount),
        sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        render: (status) => (
          <Tag color={getPaymentStatusColor(status)}>
            {getPaymentStatusLabel(status)}
          </Tag>
        ),
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (date) => formatDateTime(date),
        sorter: (a, b) => dayjs(a.createdDate).isBefore(dayjs(b.createdDate)) ? -1 : 1,
      },
      {
        title: 'Ngày thanh toán',
        dataIndex: 'paymentDate',
        key: 'paymentDate',
        render: (date) => formatDateTime(date),
      },
      {
        title: 'Hành động',
        key: 'action',
        render: (_, record) => (
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewPaymentDetail(record)}
            size="small"
          >
            Xem chi tiết
          </Button>
        ),
        width: 120,
      },
    ];

    return (
      <Card 
        title="Danh sách giao dịch đã thanh toán"
        extra={
          <Button 
            onClick={refreshPaymentTransactions}
          >
            Áp dụng bộ lọc thời gian
          </Button>
        }
      >
        {paymentTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <CreditCardOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
            <p style={{ color: '#999', fontSize: '16px' }}>Chưa có dữ liệu giao dịch thanh toán</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={paymentTransactions}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} giao dịch`,
            }}
            scroll={{ x: 1000 }}
          />
        )}
      </Card>
    );
  };

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

  const getAppointmentStatusLabel = (status) => {
    switch (status) {
      case 0:
      case 'Pending':
        return 'Đợi duyệt';
      case 1:
      case 'Confirmed':
        return 'Đã xác nhận & thanh toán';
      case 2:
      case 'Cancelled':
        return 'Đã hủy';
      case 3:
      case 'Completed':
        return 'Hoàn thành';
      case 4:
      case 'ReArranged':
        return 'Dời lịch';
      case 5:
      case 'CheckedIn':
        return 'Đã check-in';
      default:
        return 'Không xác định';
    }
  };

  const getAppointmentStatusColor = (status) => {
    switch (Number(status)) {
      case 0: // Pending
        return '#faad14'; // vàng
      case 1: // Confirmed
        return '#1890ff'; // xanh dương
      case 2: // Cancelled
        return '#ff4d4f'; // đỏ
      case 3: // Completed
        return '#52c41a'; // xanh lá
      case 4: // ReArranged
        return '#722ed1'; // tím
      case 5: // CheckedIn
        return '#13c2c2'; // xanh ngọc
      default:
        return '#bfbfbf'; // xám
    }
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
          <Button type="primary" onClick={fetchAllStatistics} loading={loading}>
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
            key: 'revenue-payments',
            label: 'Doanh thu & Giao dịch',
            children: <RevenueAndPaymentTab />
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
          }
        ]}
      />

      {/* Payment Transaction Detail Modal */}
      <Modal
        title="Chi tiết giao dịch thanh toán"
        open={paymentDetailModalVisible}
        onCancel={() => setPaymentDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPaymentDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedPaymentTransaction && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="ID" span={1}>
              {selectedPaymentTransaction.id}
            </Descriptions.Item>
            <Descriptions.Item label="Mã giao dịch" span={1}>
              {selectedPaymentTransaction.transactionId || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền" span={1}>
              {formatCurrency(selectedPaymentTransaction.amount)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={1}>
              <Tag color={getPaymentStatusColor(selectedPaymentTransaction.paymentStatus)}>
                {getPaymentStatusLabel(selectedPaymentTransaction.paymentStatus)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="ID Cuộc hẹn" span={1}>
              {selectedPaymentTransaction.appointmentId || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo" span={1}>
              {formatDateTime(selectedPaymentTransaction.createdDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày thanh toán" span={1}>
              {formatDateTime(selectedPaymentTransaction.paymentDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>
              {selectedPaymentTransaction.description || 'Không có mô tả'}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2}>
              {selectedPaymentTransaction.notes || 'Không có ghi chú'}
            </Descriptions.Item>
            {selectedPaymentTransaction.paymentUrl && (
              <Descriptions.Item label="Link thanh toán" span={2}>
                <a 
                  href={selectedPaymentTransaction.paymentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {selectedPaymentTransaction.paymentUrl}
                </a>
              </Descriptions.Item>
            )}
            {selectedPaymentTransaction.momoTransactionId && (
              <Descriptions.Item label="Momo Transaction ID" span={2}>
                {selectedPaymentTransaction.momoTransactionId}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ReportsAndStatistics;
