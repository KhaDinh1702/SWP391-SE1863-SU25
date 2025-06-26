import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, message, Space, Tag, Tooltip, DatePicker, Row, Col } from 'antd';
import { PlusOutlined, EyeOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import { patientTreatmentProtocolService } from '../../../services/patientTreatmentProtocolService';
import { treatmentStageService } from '../../../services/treatmentStageService';
import { appointmentService } from '../../../services/appointmentService';
import { arvProtocolService } from '../../../services/arvProtocolService';
import { doctorService } from '../../../services/doctorService';
import { patientService } from '../../../services/patientService';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const TreatmentProtocol = () => {
  const [patientProtocols, setPatientProtocols] = useState([]);
  const [treatmentStages, setTreatmentStages] = useState([]);
  const [patients, setPatients] = useState([]);
  const [arvProtocols, setArvProtocols] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStageModalVisible, setIsStageModalVisible] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [form] = Form.useForm();
  const [stageForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
          message.error('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
      }

      const [protocolsData, stagesData, appointmentsData, arvData, allDoctors, allPatients] = await Promise.all([
        patientTreatmentProtocolService.getAllPatientTreatmentProtocols(),
        treatmentStageService.getAllTreatmentStages(),
        appointmentService.getAllAppointments(),
        arvProtocolService.getAllARVProtocols(),
        doctorService.getAllDoctors(),
        patientService.getAllPatients()
      ]);

      const doctor = allDoctors.find(d => d.userId === userId);
      setCurrentDoctor(doctor);

      // Map patientName and patientStatus (from backend status) to each protocol
      const protocolsWithPatientInfo = protocolsData.map(protocol => {
        const patient = allPatients.find(p => p.id === protocol.patientId);
        return {
          ...protocol,
          patientName: patient ? patient.fullName : 'Không rõ',
          patientStatus: protocol.status, // lấy đúng trạng thái từ backend
        };
      });
      setPatientProtocols(protocolsWithPatientInfo);
      // Map patientName to each treatment stage
      const stagesWithPatientName = stagesData.map(stage => {
        const patient = allPatients.find(p => p.id === stage.patientId);
        return {
          ...stage,
          patientName: patient ? patient.fullName : 'Không rõ',
        };
      });
      setTreatmentStages(stagesWithPatientName);
      
      // Derive unique patients from the appointments list
      const patientMap = new Map();
      appointmentsData.forEach(app => {
        if (app.patient && !patientMap.has(app.patient.id)) {
          patientMap.set(app.patient.id, app.patient);
        }
      });
      setPatients(allPatients);

      // Map protocolId to id for ARV protocols
      const mappedArvData = arvData.map(p => ({ ...p, id: p.protocolId }));
      setArvProtocols(mappedArvData);
      setAppointmentsData(appointmentsData);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    'Pending': 0,
    'Active': 1,
    'Completed': 2,
    'Inactive': 3
  };

  const handleCreateProtocol = async (values) => {
    try {
      const requestData = {
        patientId: values.patientId,
        doctorId: currentDoctor?.id,
        arvProtocolId: values.arvProtocolId,
        appointmentId: values.appointmentId,
        startDate: values.dateRange ? values.dateRange[0].toISOString() : null,
        endDate: values.dateRange ? values.dateRange[1].toISOString() : null,
        status: statusMap[values.status] ?? 0
      };

      console.log('Creating patient treatment protocol with data:', requestData);
      await patientTreatmentProtocolService.createPatientTreatmentProtocol(requestData);
      message.success('Tạo phác đồ điều trị thành công');
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error('Create protocol error:', error);
      message.error(error.message || 'Không thể tạo phác đồ điều trị');
    }
  };

  const handleCreateStage = async (values) => {
    try {
      const requestData = {
        StageName: values.stageName,
        StageNumber: values.orderNumber,
        Description: values.description || '',
        PatientTreatmentProtocolId: values.patientTreatmentProtocolId,
        StartDate: values.startDate.toISOString(),
        EndDate: values.endDate ? values.endDate.toISOString() : null,
        ReminderTimes: values.reminderTimes || '',
        Medicine: values.medicine || '',
        Status: values.status || 'Active',
        PatientId: values.patientId,
        DoctorId: values.doctorId,
        ExaminationDate: values.examinationDate.toISOString(),
        Diagnosis: values.diagnosis || '',
        Symptoms: values.symptoms || '',
        Prescription: values.prescription || '',
        Notes: values.notes || ''
      };

      console.log('Creating treatment stage with data:', requestData);
      await treatmentStageService.createTreatmentStage(requestData);
      message.success('Tạo giai đoạn điều trị thành công');
      setIsStageModalVisible(false);
      stageForm.resetFields();
      fetchData();
    } catch (error) {
      console.error('Create stage error:', error);
      message.error(error.message || 'Không thể tạo giai đoạn điều trị');
    }
  };

  const handleViewProtocol = async (protocolId) => {
    try {
      const protocol = await patientTreatmentProtocolService.getPatientTreatmentProtocolById(protocolId);
      setSelectedProtocol(protocol);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Không thể xem chi tiết phác đồ');
    }
  };

  const handleViewStage = async (stageId) => {
    try {
      const stage = await treatmentStageService.getTreatmentStageById(stageId);
      setSelectedStage(stage);
      setIsStageModalVisible(true);
    } catch (error) {
      message.error('Không thể xem chi tiết giai đoạn');
    }
  };

  // Chú thích các trạng thái phác đồ điều trị:
  // Active: Đang điều trị
  // Completed: Hoàn thành
  // Discontinued: Dừng điều trị
  // Pending: Chờ bắt đầu (nếu có)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Inactive': return 'red';
      case 'Pending': return 'orange';
      case 'Completed': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Active': return 'Đang điều trị';
      case 'Inactive': return 'Dừng điều trị';
      case 'Pending': return 'Chờ bắt đầu';
      case 'Completed': return 'Hoàn thành';
      default: return status;
    }
  };

  const protocolColumns = [
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'ARV Protocol ID',
      dataIndex: 'arvProtocolId',
      key: 'arvProtocolId',
      render: (id) => id ? id : <span style={{color: 'gray'}}>Không có ARV</span>,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
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
              onClick={() => handleViewProtocol(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const stageColumns = [
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Tên giai đoạn',
      dataIndex: 'stageName',
      key: 'stageName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Thứ tự',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Thời gian dự kiến',
      dataIndex: 'estimatedDuration',
      key: 'estimatedDuration',
      render: (duration) => `${duration} ngày`,
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
              onClick={() => handleViewStage(record.treatmentStageId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Phác đồ điều trị bệnh nhân"
            extra={
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchData}
                  loading={loading}
                >
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedProtocol(null);
                    setIsModalVisible(true);
                  }}
                >
                  Thêm phác đồ mới
                </Button>
              </Space>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <strong>Chú thích trạng thái:</strong>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li><Tag color="orange">Chờ bắt đầu</Tag>: 0</li>
                <li><Tag color="green">Đang điều trị</Tag>: 1</li>
                <li><Tag color="blue">Hoàn thành</Tag>: 2</li>
                <li><Tag color="red">Dừng điều trị</Tag>: 3</li>
                
              </ul>
            </div>
            <Table
              columns={protocolColumns}
              dataSource={patientProtocols}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phác đồ`,
              }}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title="Giai đoạn điều trị"
            extra={
              <Space>
                <Button
                  type="primary"
                  icon={<CalendarOutlined />}
                  onClick={() => {
                    setSelectedStage(null);
                    setIsStageModalVisible(true);
                  }}
                >
                  Thêm giai đoạn mới
                </Button>
              </Space>
            }
          >
            <Table
              columns={stageColumns}
              dataSource={treatmentStages}
              rowKey="treatmentStageId"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} giai đoạn`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Modal cho phác đồ điều trị */}
      <Modal
        title={selectedProtocol ? 'Chi tiết phác đồ điều trị' : 'Thêm phác đồ điều trị mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedProtocol(null);
          form.resetFields();
        }}
        footer={selectedProtocol ? [
          <Button key="close" onClick={() => {
            setIsModalVisible(false);
            setSelectedProtocol(null);
          }}>
            Đóng
          </Button>
        ] : [
          <Button key="cancel" onClick={() => {
            setIsModalVisible(false);
            setSelectedProtocol(null);
            form.resetFields();
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Tạo phác đồ
          </Button>
        ]}
        width={600}
      >
        {selectedProtocol ? (
          <div>
            <p><strong>Tên bệnh nhân:</strong> {selectedProtocol.patientName}</p>
            <p><strong>Phác đồ ARV:</strong> {selectedProtocol.arvProtocolName}</p>
            <p><strong>Ngày bắt đầu:</strong> {selectedProtocol.startDate ? new Date(selectedProtocol.startDate).toLocaleDateString('vi-VN') : '-'}</p>
            <p><strong>Ngày kết thúc:</strong> {selectedProtocol.endDate ? new Date(selectedProtocol.endDate).toLocaleDateString('vi-VN') : '-'}</p>
            <p><strong>Trạng thái:</strong> 
              <Tag color={getStatusColor(selectedProtocol.status)} style={{ marginLeft: 8 }}>
                {getStatusText(selectedProtocol.status)}
              </Tag>
            </p>
            <p><strong>Ghi chú:</strong> {selectedProtocol.notes || 'Không có ghi chú'}</p>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateProtocol}
            initialValues={{
              status: 'Pending'
            }}
          >
            <Form.Item
              name="patientId"
              label="Bệnh nhân"
              rules={[{ required: true, message: 'Vui lòng chọn bệnh nhân' }]}
            >
              <Select placeholder="Chọn bệnh nhân" showSearch filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {patients.map(p => <Option key={p.id} value={p.id}>{p.fullName}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item
              name="arvProtocolId"
              label="Phác đồ ARV"
              rules={[{ required: true, message: 'Vui lòng chọn phác đồ ARV' }]}
            >
              <Select placeholder="Chọn phác đồ ARV">
                {arvProtocols.filter(p => p.id).map(p => (
                  <Option key={p.id} value={p.id}>
                    <div>
                      <strong>{p.protocolName}</strong>
                      {p.description && <span style={{ color: '#888', marginLeft: 8 }}>- {p.description}</span>}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="appointmentId"
              label="Lịch hẹn"
              rules={[{ required: true, message: 'Vui lòng chọn lịch hẹn' }]}
            >
              <Select placeholder="Chọn lịch hẹn">
                {appointmentsData && appointmentsData.map(app => (
                  <Option key={app.id} value={app.id}>
                    {app.id}
                    {app.appointmentStartDate ? ` (${new Date(app.appointmentStartDate).toLocaleString('vi-VN')})` : ''}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Thời gian điều trị"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
            >
              <Select>
                <Option value="Pending">Chờ bắt đầu</Option>
                <Option value="Active">Đang điều trị</Option>
                <Option value="Completed">Hoàn thành</Option>
                <Option value="Inactive">Dừng điều trị</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="notes"
              label="Ghi chú"
            >
              <TextArea rows={3} />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Modal cho giai đoạn điều trị */}
      <Modal
        title={selectedStage ? 'Chi tiết giai đoạn điều trị' : 'Thêm giai đoạn điều trị mới'}
        open={isStageModalVisible}
        onCancel={() => {
          setIsStageModalVisible(false);
          setSelectedStage(null);
          stageForm.resetFields();
        }}
        footer={selectedStage ? [
          <Button key="close" onClick={() => {
            setIsStageModalVisible(false);
            setSelectedStage(null);
          }}>
            Đóng
          </Button>
        ] : [
          <Button key="cancel" onClick={() => {
            setIsStageModalVisible(false);
            setSelectedStage(null);
            stageForm.resetFields();
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => stageForm.submit()}>
            Tạo giai đoạn
          </Button>
        ]}
        width={600}
      >
        {selectedStage ? (
          <div>
            <p><strong>Tên giai đoạn:</strong> {selectedStage.stageName}</p>
            <p><strong>Thứ tự:</strong> {selectedStage.orderNumber}</p>
            <p><strong>Mô tả:</strong> {selectedStage.description}</p>
            <p><strong>Thời gian dự kiến:</strong> {selectedStage.estimatedDuration} ngày</p>
            <p><strong>Ngày tạo:</strong> {selectedStage.createdDate ? new Date(selectedStage.createdDate).toLocaleDateString('vi-VN') : '-'}</p>
          </div>
        ) : (
          <Form
            form={stageForm}
            layout="vertical"
            onFinish={handleCreateStage}
            initialValues={{
              status: 'Active'
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="stageName"
                  label="Tên giai đoạn"
                  rules={[{ required: true, message: 'Vui lòng nhập tên giai đoạn' }]}
                >
                  <Input placeholder="Nhập tên giai đoạn điều trị" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="orderNumber"
                  label="Thứ tự"
                  rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
                >
                  <Input type="number" placeholder="Nhập thứ tự giai đoạn" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea rows={3} placeholder="Nhập mô tả chi tiết về giai đoạn" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="patientTreatmentProtocolId"
                  label="ID Phác đồ điều trị"
                  rules={[{ required: true, message: 'Vui lòng nhập ID phác đồ điều trị' }]}
                >
                  <Input placeholder="Nhập ID phác đồ điều trị" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Option value="Active">Đang điều trị</Option>
                    <Option value="Completed">Hoàn thành</Option>
                    <Option value="Discontinued">Dừng điều trị</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  label="Ngày bắt đầu"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label="Ngày kết thúc"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="reminderTimes"
                  label="Thời gian nhắc nhở"
                >
                  <Input placeholder="VD: 08:00,20:00" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="medicine"
                  label="Thuốc"
                >
                  <Input placeholder="VD: Paracetamol,Vitamin C" />
                </Form.Item>
              </Col>
            </Row>

            {/* Medical Record Fields */}
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <h4>Thông tin khám bệnh</h4>
              
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
                    name="doctorId"
                    label="ID Bác sĩ"
                    rules={[{ required: true, message: 'Vui lòng nhập ID bác sĩ' }]}
                  >
                    <Input placeholder="Nhập ID bác sĩ" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="examinationDate"
                label="Ngày khám"
                rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="diagnosis"
                label="Chẩn đoán"
              >
                <TextArea rows={2} placeholder="Nhập chẩn đoán" />
              </Form.Item>

              <Form.Item
                name="symptoms"
                label="Triệu chứng"
              >
                <TextArea rows={2} placeholder="Nhập triệu chứng" />
              </Form.Item>

              <Form.Item
                name="prescription"
                label="Đơn thuốc"
              >
                <TextArea rows={2} placeholder="Nhập đơn thuốc" />
              </Form.Item>

              <Form.Item
                name="notes"
                label="Ghi chú"
              >
                <TextArea rows={2} placeholder="Nhập ghi chú" />
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default TreatmentProtocol;