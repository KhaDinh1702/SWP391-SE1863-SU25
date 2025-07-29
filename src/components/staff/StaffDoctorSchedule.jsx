import React, { useEffect, useState } from 'react';
import { Table, Tag, message, Card, Row, Col, Select, DatePicker, Button, Space, Tooltip } from 'antd';
import { ReloadOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { doctorScheduleService } from '../../services/doctorScheduleService';
import { doctorService } from '../../services/doctorService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const StaffDoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSchedules();
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [schedules, selectedDoctor, dateRange, statusFilter]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await doctorScheduleService.getAllDoctorSchedules();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      message.error('Không thể tải lịch làm việc bác sĩ');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      message.error('Không thể tải danh sách bác sĩ');
    }
  };

  const applyFilters = () => {
    let filtered = [...schedules];

    // Filter by doctor
    if (selectedDoctor) {
      filtered = filtered.filter(schedule => 
        schedule.doctorId === selectedDoctor || 
        schedule.DoctorId === selectedDoctor
      );
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filtered = filtered.filter(schedule => {
        const scheduleDate = dayjs(schedule.startTime || schedule.StartTime);
        return scheduleDate.isAfter(startDate.startOf('day')) && 
               scheduleDate.isBefore(endDate.endOf('day'));
      });
    }

    // Filter by availability status
    if (statusFilter !== 'all') {
      const isAvailable = statusFilter === 'available';
      filtered = filtered.filter(schedule => 
        schedule.isAvailable === isAvailable
      );
    }

    setFilteredSchedules(filtered);
  };

  const handleRefresh = () => {
    fetchSchedules();
    message.success('Đã làm mới dữ liệu');
  };

  const clearFilters = () => {
    setSelectedDoctor(null);
    setDateRange(null);
    setStatusFilter('all');
    message.info('Đã xóa tất cả bộ lọc');
  };

  const getDoctorName = (schedule) => {
    const doctorId = schedule.doctorId || schedule.DoctorId;
    const doctor = doctors.find(d => d.doctorId === doctorId || d.id === doctorId);
    return doctor?.fullName || schedule.doctorName || schedule.Doctor?.fullName || 'N/A';
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
  };

  const getStatusColor = (isAvailable) => {
    return isAvailable ? 'green' : 'red';
  };

  const getStatusText = (isAvailable) => {
    return isAvailable ? 'Có sẵn' : 'Đã đặt';
  };

  const columns = [
    {
      title: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Bác sĩ
        </span>
      ),
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>
          {getDoctorName(record)}
        </span>
      ),
      sorter: (a, b) => getDoctorName(a).localeCompare(getDoctorName(b)),
      width: 200,
    },
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Thời gian bắt đầu
        </span>
      ),
      dataIndex: 'startTime',
      key: 'startTime',
      render: (_, record) => formatDateTime(record.startTime || record.StartTime),
      sorter: (a, b) => {
        const dateA = dayjs(a.startTime || a.StartTime);
        const dateB = dayjs(b.startTime || b.StartTime);
        return dateA.isBefore(dateB) ? -1 : 1;
      },
      width: 180,
    },
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Thời gian kết thúc
        </span>
      ),
      dataIndex: 'endTime',
      key: 'endTime',
      render: (_, record) => formatDateTime(record.endTime || record.EndTime),
      width: 180,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      render: (text, record) => (
        <Tooltip title={text || record.Notes || 'Không có ghi chú'}>
          <span style={{ 
            display: 'block', 
            maxWidth: 150, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || record.Notes || 'Không có ghi chú'}
          </span>
        </Tooltip>
      ),
      width: 180,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable) => (
        <Tag color={getStatusColor(isAvailable)}>
          {getStatusText(isAvailable)}
        </Tag>
      ),
      filters: [
        { text: 'Có sẵn', value: true },
        { text: 'Đã đặt', value: false },
      ],
      onFilter: (value, record) => record.isAvailable === value,
      width: 120,
    },
   
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="Lịch làm việc bác sĩ" 
        style={{ marginBottom: 24 }}
        extra={
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn bác sĩ"
              style={{ width: '100%' }}
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {doctors.map(doctor => (
                <Option key={doctor.doctorId || doctor.id} value={doctor.doctorId || doctor.id}>
                  {doctor.fullName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Trạng thái"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="available">Có sẵn</Option>
              <Option value="booked">Đã đặt</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Space>
              <Button onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredSchedules}
          rowKey={record => record.id || record.Id || record.scheduleId}
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} lịch làm việc`,
          }}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default StaffDoctorSchedule;