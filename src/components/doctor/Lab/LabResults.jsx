import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, message, Space, Tag, Tooltip, DatePicker, Row, Col, Progress } from 'antd';
import { PlusOutlined, EyeOutlined, ReloadOutlined, SearchOutlined, FilterOutlined, FileTextOutlined } from '@ant-design/icons';
import { labResultService } from '../../../services';

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

const LabResults = () => {
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLabResults();
  }, []);

  const fetchLabResults = async () => {
    setLoading(true);
    try {
      const data = await labResultService.getAllLabResults();
      setLabResults(data);
    } catch (error) {
      message.error('Không thể tải danh sách kết quả xét nghiệm');
      console.error('Error fetching lab results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResult = async (values) => {
    try {
      // Chuyển đổi dữ liệu theo đúng format của CreateLabResultRequest (PascalCase)
      const requestData = {
        PatientId: values.patientId,
        TreatmentStageId: values.treatmentStageId || null,
        DoctorId: values.doctorId || null,
        TestName: values.testName,
        TestType: values.testType || '',
        TestDate: values.testDate.toISOString(),
        ResultSummary: values.resultSummary || '',
        Conclusion: values.conclusion || '',
        Notes: values.notes || ''
      };

      console.log('Creating lab result with data:', requestData);
      await labResultService.createLabResult(requestData);
      message.success('Tạo kết quả xét nghiệm thành công');
      setIsModalVisible(false);
      form.resetFields();
      fetchLabResults();
    } catch (error) {
      console.error('Create lab result error:', error);
      message.error(error.message || 'Không thể tạo kết quả xét nghiệm');
    }
  };

  const handleViewResult = async (resultId) => {
    try {
      const result = await labResultService.getLabResultById(resultId);
      setSelectedResult(result);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Không thể xem chi tiết kết quả');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'green';
      case 'Abnormal': return 'red';
      case 'Pending': return 'orange';
      case 'Critical': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Normal': return 'Bình thường';
      case 'Abnormal': return 'Bất thường';
      case 'Pending': return 'Chờ kết quả';
      case 'Critical': return 'Nguy hiểm';
      default: return status;
    }
  };

  const getResultColor = (result, normalRange) => {
    if (!result || !normalRange) return 'default';
    
    // Đơn giản hóa logic - có thể cần điều chỉnh theo yêu cầu cụ thể
    if (result === 'Normal') return 'green';
    if (result === 'Abnormal') return 'red';
    if (result === 'Critical') return 'red';
    return 'default';
  };

  const filteredResults = labResults.filter(result => {
    const matchesSearch = result.patientName?.toLowerCase().includes(searchText.toLowerCase()) ||
                         result.testName?.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filterStatus === 'all' || result.status === filterStatus;
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
      title: 'Loại xét nghiệm',
      dataIndex: 'testName',
      key: 'testName',
    },
    {
      title: 'Kết quả',
      dataIndex: 'resultSummary',
      key: 'resultSummary',
      render: (result, record) => (
        <Tag color={getResultColor(result, record.normalRange)}>
          {result || 'Chưa có kết quả'}
        </Tag>
      ),
    },
    {
      title: 'Ngày xét nghiệm',
      dataIndex: 'testDate',
      key: 'testDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Bác sĩ chỉ định',
      dataIndex: 'doctorName',
      key: 'doctorName',
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
              onClick={() => handleViewResult(record.labResultId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Kết quả xét nghiệm"
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchLabResults}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedResult(null);
                setIsModalVisible(true);
              }}
            >
              Thêm kết quả mới
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Search
              placeholder="Tìm kiếm theo tên bệnh nhân hoặc loại xét nghiệm"
              allowClear
              style={{ width: 350 }}
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
              <Option value="Normal">Bình thường</Option>
              <Option value="Abnormal">Bất thường</Option>
              <Option value="Pending">Chờ kết quả</Option>
              <Option value="Critical">Nguy hiểm</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredResults}
          rowKey="labResultId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} kết quả`,
          }}
        />
      </Card>

      <Modal
        title={selectedResult ? 'Chi tiết kết quả xét nghiệm' : 'Thêm kết quả xét nghiệm mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedResult(null);
          form.resetFields();
        }}
        footer={selectedResult ? [
          <Button key="close" onClick={() => {
            setIsModalVisible(false);
            setSelectedResult(null);
          }}>
            Đóng
          </Button>
        ] : [
          <Button key="cancel" onClick={() => {
            setIsModalVisible(false);
            setSelectedResult(null);
            form.resetFields();
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Tạo kết quả
          </Button>
        ]}
        width={700}
      >
        {selectedResult ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p><strong>Tên bệnh nhân:</strong> {selectedResult.patientName}</p>
                <p><strong>Loại xét nghiệm:</strong> {selectedResult.testName}</p>
                <p><strong>Ngày xét nghiệm:</strong> {selectedResult.testDate ? new Date(selectedResult.testDate).toLocaleDateString('vi-VN') : '-'}</p>
                <p><strong>Bác sĩ chỉ định:</strong> {selectedResult.doctorName}</p>
              </Col>
              <Col span={12}>
                <p><strong>Kết quả:</strong> 
                  <Tag color={getResultColor(selectedResult.resultSummary, selectedResult.normalRange)} style={{ marginLeft: 8 }}>
                    {selectedResult.resultSummary || 'Chưa có kết quả'}
                  </Tag>
                </p>
                <p><strong>Loại xét nghiệm:</strong> {selectedResult.testType || '-'}</p>
                <p><strong>Ngày tạo:</strong> {selectedResult.createdDate ? new Date(selectedResult.createdDate).toLocaleDateString('vi-VN') : '-'}</p>
              </Col>
            </Row>
            
            <div style={{ marginTop: 16 }}>
              <p><strong>Kết luận:</strong></p>
              <p style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {selectedResult.conclusion || 'Không có kết luận'}
              </p>
            </div>

            <div style={{ marginTop: 16 }}>
              <p><strong>Ghi chú:</strong></p>
              <p style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {selectedResult.notes || 'Không có ghi chú'}
              </p>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateResult}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="patientId"
                  label="ID Bệnh nhân"
                  rules={[{ required: true, message: 'Vui lòng nhập ID bệnh nhân' }]}
                >
                  <Input placeholder="Nhập ID bệnh nhân" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="testName"
                  label="Tên xét nghiệm"
                  rules={[{ required: true, message: 'Vui lòng nhập tên xét nghiệm' }]}
                >
                  <Input placeholder="Nhập tên xét nghiệm" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="testType"
                  label="Loại xét nghiệm"
                >
                  <Input placeholder="Nhập loại xét nghiệm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="testDate"
                  label="Ngày xét nghiệm"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày xét nghiệm' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="treatmentStageId"
                  label="ID Giai đoạn điều trị"
                >
                  <Input placeholder="Nhập ID giai đoạn điều trị (tùy chọn)" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="doctorId"
                  label="ID Bác sĩ"
                >
                  <Input placeholder="Nhập ID bác sĩ (tùy chọn)" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="resultSummary"
              label="Tóm tắt kết quả"
            >
              <Input placeholder="Nhập tóm tắt kết quả" />
            </Form.Item>

            <Form.Item
              name="conclusion"
              label="Kết luận"
            >
              <TextArea rows={3} placeholder="Nhập kết luận xét nghiệm" />
            </Form.Item>

            <Form.Item
              name="notes"
              label="Ghi chú"
            >
              <TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default LabResults; 