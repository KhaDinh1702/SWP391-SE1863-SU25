import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Space, Tag, Tooltip, Input, Select, DatePicker, message } from 'antd';
import { EyeOutlined, ReloadOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { medicalRecordService } from '../../../services';

const { Option } = Select;
const { Search } = Input;

const MedicalHistory = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      const data = await medicalRecordService.getAllMedicalRecords();
      setMedicalRecords(data);
    } catch (error) {
      message.error('Không thể tải danh sách hồ sơ bệnh án');
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = async (recordId) => {
    try {
      const record = await medicalRecordService.getMedicalRecordById(recordId);
      setSelectedRecord(record);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Không thể xem chi tiết hồ sơ');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Inactive': return 'red';
      case 'Pending': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Active': return 'Hoạt động';
      case 'Inactive': return 'Không hoạt động';
      case 'Pending': return 'Chờ xử lý';
      default: return status;
    }
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.patientName?.toLowerCase().includes(searchText.toLowerCase()) ||
                         record.diagnosis?.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày khám',
      dataIndex: 'examinationDate',
      key: 'examinationDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Bác sĩ điều trị',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewRecord(record.medicalRecordId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Lịch sử khám bệnh"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchMedicalRecords}
            loading={loading}
          >
            Làm mới
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Search
              placeholder="Tìm kiếm theo tên bệnh nhân hoặc chẩn đoán"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: 150 }}
              value={filterStatus}
              onChange={setFilterStatus}
              prefix={<FilterOutlined />}
            >
              <Option value="all">Tất cả</Option>
              <Option value="Active">Hoạt động</Option>
              <Option value="Inactive">Không hoạt động</Option>
              <Option value="Pending">Chờ xử lý</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowKey="medicalRecordId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hồ sơ`,
          }}
        />
      </Card>

      <Modal
        title="Chi tiết hồ sơ bệnh án"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedRecord(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsModalVisible(false);
            setSelectedRecord(null);
          }}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedRecord && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p><strong>Tên bệnh nhân:</strong> {selectedRecord.patientName}</p>
                <p><strong>Ngày sinh:</strong> {selectedRecord.dateOfBirth ? new Date(selectedRecord.dateOfBirth).toLocaleDateString('vi-VN') : '-'}</p>
                <p><strong>Giới tính:</strong> {selectedRecord.gender}</p>
                <p><strong>Số điện thoại:</strong> {selectedRecord.phoneNumber}</p>
                <p><strong>Địa chỉ:</strong> {selectedRecord.address}</p>
              </div>
              <div>
                <p><strong>Bác sĩ điều trị:</strong> {selectedRecord.doctorName}</p>
                <p><strong>Ngày khám:</strong> {selectedRecord.examinationDate ? new Date(selectedRecord.examinationDate).toLocaleDateString('vi-VN') : '-'}</p>
                <p><strong>Trạng thái:</strong> 
                  <Tag color={getStatusColor(selectedRecord.status)} style={{ marginLeft: 8 }}>
                    {getStatusText(selectedRecord.status)}
                  </Tag>
                </p>
                <p><strong>Ngày tạo:</strong> {selectedRecord.createdDate ? new Date(selectedRecord.createdDate).toLocaleDateString('vi-VN') : '-'}</p>
              </div>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <p><strong>Chẩn đoán:</strong></p>
              <p style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {selectedRecord.diagnosis || 'Chưa có chẩn đoán'}
              </p>
            </div>

            <div style={{ marginTop: 16 }}>
              <p><strong>Ghi chú:</strong></p>
              <p style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {selectedRecord.notes || 'Không có ghi chú'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicalHistory; 