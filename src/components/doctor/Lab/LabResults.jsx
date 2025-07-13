import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, message, Space, Tag, Tooltip, DatePicker, Row, Col, Image } from 'antd';
import { PlusOutlined, EyeOutlined, ReloadOutlined, SearchOutlined, FilterOutlined, PictureOutlined } from '@ant-design/icons';
import { labResultService } from '../../../services';
import { patientService } from '../../../services/patientService';
import { treatmentStageService } from '../../../services/treatmentStageService';
import { userService } from '../../../services/userService';
import { doctorService } from '../../../services/doctorService';
import { patientTreatmentProtocolService } from '../../../services/patientTreatmentProtocolService';

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

const LabResults = () => {
  const [labResults, setLabResults] = useState([]);
  const [patients, setPatients] = useState([]);
  const [treatmentStages, setTreatmentStages] = useState([]);
  const [treatmentProtocols, setTreatmentProtocols] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLabResults();
    fetchPatients();
    fetchTreatmentStages();
    fetchTreatmentProtocols();
    fetchDoctors();
  }, []);

  // Separate useEffect to fetch current doctor after doctors are loaded
  useEffect(() => {
    if (doctors.length > 0) {
      fetchCurrentDoctor();
    }
  }, [doctors]);

  // Update form field when currentDoctor changes
  useEffect(() => {
    if (currentDoctor?.id && form) {
      form.setFieldsValue({ doctorId: currentDoctor.id });
      console.log('Setting form doctorId to:', currentDoctor.id);
    }
  }, [currentDoctor, form]);

  // Also set doctorId when opening the modal
  useEffect(() => {
    if (isModalVisible && currentDoctor?.id && form) {
      form.setFieldsValue({ doctorId: currentDoctor.id });
      console.log('Setting form doctorId in modal to:', currentDoctor.id);
    }
  }, [isModalVisible, currentDoctor, form]);

  const fetchLabResults = async () => {
    setLoading(true);
    try {
      const data = await labResultService.getAllLabResults();
      // Map lại để luôn có labResultId và labPictures
      const mapped = (data || []).map(r => ({
        ...r,
        labResultId: r.labResultId || r.id || r._id || null,
        labPictures: r.labPictures || r.LabPictures || [] // Đảm bảo có array labPictures
      }));
      setLabResults(mapped);
    } catch (error) {
      message.error('Không thể tải danh sách kết quả xét nghiệm');
      console.error('Error fetching lab results:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await patientService.getAllPatients();
      console.log('Fetched patients data:', data);
      // Log each patient in detail
      data.forEach((patient, index) => {
        console.log(`Patient ${index}:`, {
          id: patient.id,
          patientId: patient.patientId,
          PatientId: patient.PatientId, // Check if it's capitalized
          fullName: patient.fullName,
          FullName: patient.FullName // Check if it's capitalized
        });
      });
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      message.error('Không thể tải danh sách bệnh nhân');
    }
  };

  const fetchTreatmentProtocols = async () => {
    try {
      const data = await patientTreatmentProtocolService.getAllPatientTreatmentProtocols();
      console.log('Fetched treatment protocols data:', data);
      // Log each protocol in detail with ALL properties
      data.forEach((protocol, index) => {
        console.log(`Treatment protocol ${index} - ALL PROPERTIES:`, protocol);
      });
      setTreatmentProtocols(data);
    } catch (error) {
      console.error('Error fetching treatment protocols:', error);
      message.error('Không thể tải danh sách phác đồ điều trị');
    }
  };

  const fetchTreatmentStages = async () => {
    try {
      const data = await treatmentStageService.getAllTreatmentStages();
      console.log('Fetched treatment stages data:', data);
      // Log each stage in detail with ALL properties
      data.forEach((stage, index) => {
        console.log(`Treatment stage ${index} - ALL PROPERTIES:`, stage);
        console.log(`Treatment stage ${index} - Object.keys:`, Object.keys(stage));
      });
      setTreatmentStages(data);
    } catch (error) {
      console.error('Error fetching treatment stages:', error);
      message.error('Không thể tải danh sách giai đoạn điều trị');
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      console.log('Fetched doctors data:', data);
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      message.error('Không thể tải danh sách bác sĩ');
    }
  };

  const fetchCurrentDoctor = async () => {
    try {
      // Lấy userId từ token hoặc localStorage
      const userId = localStorage.getItem('userId');
      console.log('Looking for doctor with userId:', userId);
      console.log('Available doctors:', doctors);
      
      if (!userId) {
        console.log('No userId found in localStorage');
        return;
      }
      
      // Tìm doctor từ danh sách doctors theo userId (giống TreatmentProtocol)
      const doctor = doctors.find(d => d.userId === userId);
      console.log('Found doctor:', doctor);
      
      if (doctor) {
        setCurrentDoctor(doctor);
        console.log('Current doctor set to:', doctor);
      } else {
        console.log('No doctor found for userId:', userId);
        console.log('Available doctor userIds:', doctors.map(d => d.userId));
      }
    } catch (error) {
      console.error('Error fetching current doctor:', error);
    }
  };

  // Function to ensure doctorId is set before form submission
  const handleFormSubmit = async () => {
    try {
      // Ensure doctorId is set before validation
      if (currentDoctor?.id) {
        form.setFieldsValue({ doctorId: currentDoctor.id });
      }
      
      // Validate and submit form
      const values = await form.validateFields();
      console.log('Form values before submit:', values);
      
      // Double-check doctorId is set
      if (!values.doctorId && currentDoctor?.id) {
        values.doctorId = currentDoctor.id;
      }
      
      await handleCreateResult(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Sửa lại hàm handleCreateResult để lấy file đúng chuẩn cho FormData
  const handleCreateResult = async (values) => {
    try {
      // Kiểm tra currentDoctor có tồn tại không
      if (!currentDoctor?.id) {
        message.error('Không thể xác định bác sĩ hiện tại. Vui lòng thử lại.');
        return;
      }

      // Chuẩn hóa dữ liệu gửi lên
      const requestData = {
        PatientId: values.patientId,
        TreatmentStageId: values.treatmentStageId || null,
        DoctorId: values.doctorId || currentDoctor.id || null,
        TestName: values.testName,
        TestType: values.testType || '',
        TestDate: values.testDate.toISOString(),
        ResultSummary: values.resultSummary || '',
        Conclusion: values.conclusion || '',
        Notes: values.notes || ''
      };

      // Lấy file từ input (nếu có)
      const fileInput = document.querySelector('input[type="file"][name="labPictures"]');
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        requestData.LabResultPictures = Array.from(fileInput.files);
      }

      await labResultService.createLabResult(requestData);
      message.success('Tạo kết quả xét nghiệm thành công');
      setIsModalVisible(false);
      form.resetFields();
      fetchLabResults();
    } catch (error) {
      // Nếu lỗi liên quan đến không khớp PatientId, chỉ hiển thị thông báo chung
      if (error?.message && error.message.includes('does not match the TreatmentStage')) {
        message.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin bệnh nhân và giai đoạn điều trị.');
      } else {
        message.error('Không thể tạo kết quả xét nghiệm. Vui lòng thử lại hoặc liên hệ quản trị viên.');
      }
    }
  };

  const handleViewResult = async (resultId) => {
    if (!resultId) return;
    try {
      setLoading(true);
      // Lấy chi tiết bằng API getLabResultById thay vì getAllLabResults
      const result = await labResultService.getLabResultById(resultId);
      if (result) {
        setSelectedResult(result);
        setIsModalVisible(true);
      } else {
        message.error('Không tìm thấy kết quả xét nghiệm');
      }
    } catch (error) {
      message.error('Không thể tải chi tiết kết quả');
    } finally {
      setLoading(false);
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
      render: (_text, record) => {
        // Luôn lấy tên từ danh sách bệnh nhân theo patientId
        const patient = patients.find(p => p.id === record.patientId);
        return <strong>{patient ? patient.fullName : ''}</strong>;
      },
    },
    {
      title: 'Loại xét nghiệm',
      dataIndex: 'testName',
      key: 'testName',
    },
    {
      title: 'Hình ảnh xét nghiệm',
      dataIndex: 'labPictures',
      key: 'labPictures',
      width: 120,
      render: (_, record) => {
        if (record.labPictures && record.labPictures.length > 0) {
          return (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <Image
                width={40}
                height={40}
                src={record.labPictures[0].labPictureUrl}
                alt={record.labPictures[0].labPictureName || 'Lab image'}
                style={{ objectFit: 'cover', borderRadius: 4 }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxYQbDrIocYuwRXRQExLtJEDjKRQwwxLjGUIocYdxHrYNbBuMs7d09Xn+mXt95++9fPs89M21M9VfN39/+87z2nDj/++9/w8/PzbQe//va38/Ly8vPt/NKLZ2dnP74/5Vn/HH6qy4/fP0/4l1++/fJy8daTj3c/+eSTk9c6qLttO9fHjx8/1sfn5wAAAAA="
                preview={{
                  mask: <div style={{ fontSize: 12, color: 'white' }}><PictureOutlined /> Xem</div>
                }}
              />
              {record.labPictures.length > 1 && (
                <span style={{ fontSize: 12, color: '#1890ff' }}>
                  +{record.labPictures.length - 1} ảnh
                </span>
              )}
            </div>
          );
        }
        return (
          <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
            <PictureOutlined />
            <div>Không có ảnh</div>
          </div>
        );
      },
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
      title: 'Chi tiết',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title={record.labResultId ? 'Xem chi tiết' : 'Không có ID kết quả'}>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              disabled={!record.labResultId}
              onClick={() => record.labResultId && handleViewResult(record.labResultId)}
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
                // Set doctorId immediately when opening modal
                if (currentDoctor?.id) {
                  setTimeout(() => {
                    form.setFieldsValue({ doctorId: currentDoctor.id });
                    console.log('Setting doctorId in modal open handler:', currentDoctor.id);
                  }, 100);
                }
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
          rowKey={record => record.labResultId || record.id || record._id || Math.random()}
          loading={loading}
          scroll={{ x: 1000 }}
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
          <Button key="submit" type="primary" onClick={handleFormSubmit}>
            Tạo kết quả
          </Button>
        ]}
        width={900}
      >
        {selectedResult ? (
          <div style={{ fontSize: 18, padding: 12 }}>
            <Row gutter={[32, 24]}>
              <Col span={12}>
                <p><strong>Tên bệnh nhân:</strong> {(() => {
                  const patient = patients.find(p => p.patientId === selectedResult.patientId || p.id === selectedResult.patientId);
                  return patient ? patient.fullName : selectedResult.patientName || '-';
                })()}</p>
                <p><strong>Bác sĩ:</strong> {(() => {
                  const doctor = doctors.find(d => d.doctorId === selectedResult.doctorId || d.id === selectedResult.doctorId);
                  return doctor ? doctor.fullName : selectedResult.doctorName || '-';
                })()}</p>
                <p><strong>Giai đoạn điều trị:</strong> {(() => {
                  const stage = treatmentStages.find(s => s.treatmentStageId === selectedResult.treatmentStageId || s.id === selectedResult.treatmentStageId);
                  return stage ? `${stage.stageName} (${stage.treatmentStageId || stage.id})` : selectedResult.treatmentStageId || '-';
                })()}</p>
                <p><strong>Loại xét nghiệm:</strong> {selectedResult.testType || '-'}</p>
                <p><strong>Tên xét nghiệm:</strong> {selectedResult.testName || '-'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Kết quả:</strong> <Tag color={getResultColor(selectedResult.resultSummary, selectedResult.normalRange)} style={{ fontSize: 18, padding: '4px 16px' }}>{selectedResult.resultSummary || 'Chưa có kết quả'}</Tag></p>
                <p><strong>Kết luận:</strong> <span style={{ fontSize: 17 }}>{selectedResult.conclusion || '-'}</span></p>
                <p><strong>Ghi chú:</strong> <span style={{ fontSize: 17 }}>{selectedResult.notes || '-'}</span></p>
                <p><strong>Ngày xét nghiệm:</strong> <span style={{ fontSize: 17 }}>{selectedResult.testDate ? new Date(selectedResult.testDate).toLocaleDateString('vi-VN') : '-'}</span></p>
              </Col>
            </Row>

            {(selectedResult.LabPictures && selectedResult.LabPictures.length > 0) || 
             (selectedResult.labPictures && selectedResult.labPictures.length > 0) ? (
              <div>
                <strong>Hình ảnh xét nghiệm:</strong>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                  {(selectedResult.LabPictures || selectedResult.labPictures || []).map(pic => (
                    <Image
                      key={pic.id || pic.labPictureId}
                      src={pic.labPictureUrl}
                      alt={pic.labPictureName}
                      width={120}
                      height={120}
                      style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxYQbDrIocYuwRXRQExLtJEDjKRQwwxLjGUIocYdxHrYNbBuMs7d09Xn+mXt95++9fPs89M21M9VfN39/+87z2nDj/++9/w8/PzbQe//va38/Ly8vPt/NKLZ2dnP74/5Vn/HH6qy4/fP0/4l1++/fJy8daTj3c/+eSTk9c6qLttO9fHjx8/1sfn5wAAAAA="
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateResult}
            initialValues={{
              doctorId: currentDoctor?.id
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="patientId"
                  label="Bệnh nhân"
                  rules={[{ required: true, message: 'Vui lòng chọn bệnh nhân' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn bệnh nhân"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={fetchTreatmentStages}
                  >
                    {patients.map((p) => {
                      // Sử dụng patientId hoặc id làm key, fallback random chỉ khi không có id (rất hiếm)
                      const key = p.patientId || p.id || `patient-${p.fullName}`;
                      return (
                        <Option key={key} value={p.patientId || p.id}>
                          {p.fullName} {p.patientId ? `(${p.patientId})` : ''}
                        </Option>
                      );
                    })}
                  </Select>
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

            {/* Thêm upload hình ảnh lab */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="labPictures"
                  label="Hình ảnh xét nghiệm (bắt buộc)"
                  rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 hình ảnh xét nghiệm' }]}
                >
                  <input type="file" name="labPictures" multiple accept="image/*" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="treatmentStageId"
                  label="Giai đoạn điều trị"
                  rules={[{ required: true, message: 'Vui lòng chọn giai đoạn điều trị' }]}
                >
                  <Select
                    placeholder="Chọn giai đoạn điều trị"
                    disabled={!form.getFieldValue('patientId')}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    notFoundContent={!form.getFieldValue('patientId') ? 'Vui lòng chọn bệnh nhân trước' : 'Không có giai đoạn phù hợp'}
                  >
                    {treatmentStages
                      .filter(stage => {
                        // Only show stages for the selected patient
                        const selectedPatientId = form.getFieldValue('patientId');
                        if (!selectedPatientId) return true; // Show all if no patient selected
                        
                        // Find the patient through treatment protocol
                        if (stage.patientTreatmentProtocolId) {
                          const protocol = treatmentProtocols.find(p => 
                            (p.id === stage.patientTreatmentProtocolId || p.patientTreatmentProtocolId === stage.patientTreatmentProtocolId)
                          );
                          if (protocol && (protocol.patientId === selectedPatientId || protocol.PatientId === selectedPatientId)) {
                            return true;
                          }
                        }
                        
                        return false;
                      })
                      .map((stage) => {
                        // Sử dụng treatmentStageId làm key
                        const key = stage.treatmentStageId || stage.id || `stage-${stage.stageName}`;
                        
                        // Find patient name through treatment protocol
                        let patientName = 'Không rõ bệnh nhân';
                        if (stage.patientTreatmentProtocolId) {
                          const protocol = treatmentProtocols.find(p => 
                            (p.id === stage.patientTreatmentProtocolId || p.patientTreatmentProtocolId === stage.patientTreatmentProtocolId)
                          );
                          if (protocol) {
                            const protocolPatientId = protocol.patientId || protocol.PatientId;
                            const patient = patients.find(p => (p.id === protocolPatientId || p.patientId === protocolPatientId));
                            if (patient) {
                              patientName = patient.fullName || patient.FullName || 'Tên không rõ';
                            }
                          }
                        }
                        
                        const displayName = `${stage.stageName || 'Giai đoạn không rõ'} - ${patientName}`;
                        
                        return (
                          <Option key={key} value={stage.treatmentStageId || stage.id}>
                            {displayName}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              {/* Bỏ chọn bác sĩ, tự động set doctorId */}
            </Row>
            <Form.Item name="doctorId" hidden>
              <Input type="hidden" />
            </Form.Item>

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