import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, AutoComplete, message, Space, Tag, Tooltip, DatePicker, Row, Col, TimePicker } from 'antd';
import { PlusOutlined, EyeOutlined, ReloadOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { patientTreatmentProtocolService } from '../../../services/patientTreatmentProtocolService';
import { treatmentStageService } from '../../../services/treatmentStageService';
import { appointmentService } from '../../../services/appointmentService';
import { arvProtocolService } from '../../../services/arvProtocolService';
import { doctorService } from '../../../services/doctorService';
import { patientService } from '../../../services/patientService';
import { doctorScheduleService } from '../../../services/doctorScheduleService';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const TreatmentProtocol = () => {
  // HIV drug combinations for dropdown
  const hivDrugOptions = [
    'Tenofovir + Lamivudine + Efavirenz',
    'Zidovudine + Lamivudine + Efavirenz',
    'Tenofovir + Emtricitabine + Efavirenz',
    'Abacavir + Lamivudine + Efavirenz',
    'Tenofovir + Lamivudine + Rilpivirine',
    'Zidovudine + Lamivudine + Nevirapine',
    'Tenofovir + Emtricitabine + Rilpivirine',
    'Abacavir + Lamivudine + Dolutegravir',
    'Tenofovir + Lamivudine + Dolutegravir',
    'Tenofovir + Emtricitabine + Dolutegravir',
    'Darunavir + Ritonavir + Tenofovir + Emtricitabine',
    'Atazanavir + Ritonavir + Tenofovir + Emtricitabine',
    'Lopinavir + Ritonavir + Zidovudine + Lamivudine'
  ];

  const [patientProtocols, setPatientProtocols] = useState([]);
  const [treatmentStages, setTreatmentStages] = useState([]);
  const [patients, setPatients] = useState([]);
  const [arvProtocols, setArvProtocols] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [validAppointments, setValidAppointments] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStageModalVisible, setIsStageModalVisible] = useState(false);
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [form] = Form.useForm();
  const [stageForm] = Form.useForm();
  const [updateStatusForm] = Form.useForm();

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

      const mappedArvData = arvData.map(p => ({ ...p, id: p.protocolId }));
      setArvProtocols(mappedArvData);
      console.log('ARV Protocols after mapping:', mappedArvData); // Debug log

      const doctor = allDoctors.find(d => d.userId === userId);
      setCurrentDoctor(doctor);

      // Map patientName, arvProtocolName, and patientStatus (from backend status) to each protocol
      const protocolsWithPatientInfo = protocolsData.map(protocol => {
        let patientName = protocol.patientName;
        if (!patientName && protocol.patientId) {
          const patient = allPatients.find(p => p.id === protocol.patientId);
          if (patient) patientName = patient.fullName;
        }
        // Map ARV protocol name
        let arvProtocolName = '';
        if (protocol.arvProtocolId) {
          const arv = mappedArvData.find(a => a.id === protocol.arvProtocolId);
          if (arv) arvProtocolName = arv.protocolName;
        }
        return {
          ...protocol,
          patientName: patientName || 'Không rõ',
          patientStatus: protocol.status,
          arvProtocolName: arvProtocolName || 'Không rõ',
        };
      });
      // Map patientName, startDate, endDate, and arvProtocolName to each treatment stage (for display like above)
      const stagesWithPatientName = stagesData.map(stage => {
        let patientName = '';
        let startDate = '';
        let endDate = '';
        let arvProtocolName = '';
        // Try to get from protocol (by patientTreatmentProtocolId)
        if (stage.patientTreatmentProtocolId) {
          const protocol = protocolsWithPatientInfo.find(p => p.id === stage.patientTreatmentProtocolId);
          if (protocol) {
            if (protocol.patientName) patientName = protocol.patientName;
            if (protocol.startDate) startDate = protocol.startDate;
            if (protocol.endDate) endDate = protocol.endDate;
            if (protocol.arvProtocolName) arvProtocolName = protocol.arvProtocolName;
          }
        }
        // Fallback to allPatients if not found
        if (!patientName && stage.patientId) {
          const patient = allPatients.find(p => p.id === stage.patientId);
          if (patient) patientName = patient.fullName;
        }
        return {
          ...stage,
          patientName: patientName || 'Không rõ',
          protocolStartDate: startDate || '',
          protocolEndDate: endDate || '',
          arvProtocolName: arvProtocolName || 'Không rõ',
        };
      });
      setPatientProtocols(protocolsWithPatientInfo);
      setTreatmentStages(stagesWithPatientName);
      setPatients(allPatients);
      setAppointmentsData(appointmentsData);
      setAllDoctors(allDoctors);

      // Filter appointments that have valid doctor schedules
      if (doctor?.id) {
        await filterValidAppointments(doctor.id, appointmentsData);
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // New function to filter appointments with valid doctor schedules
  const filterValidAppointments = async (doctorId, appointments) => {
    try {
      console.log('=== FILTERING VALID APPOINTMENTS ===');
      console.log('Doctor ID:', doctorId);
      console.log('All appointments to filter:', appointments);

      // Get doctor schedules for this doctor
      const doctorScheduleResponse = await doctorScheduleService.getDoctorSchedulesByDoctorId(doctorId);
      
      console.log('Doctor schedule response:', doctorScheduleResponse);
      
      // Extract the schedules array from response - handle different response formats
      let doctorSchedules = [];
      if (Array.isArray(doctorScheduleResponse)) {
        doctorSchedules = doctorScheduleResponse;
      } else if (doctorScheduleResponse?.Schedules) {
        doctorSchedules = doctorScheduleResponse.Schedules;
      } else if (doctorScheduleResponse?.schedules) {
        doctorSchedules = doctorScheduleResponse.schedules;
      } else if (doctorScheduleResponse?.data) {
        doctorSchedules = Array.isArray(doctorScheduleResponse.data) ? doctorScheduleResponse.data : [];
      }
      
      console.log('Extracted doctor schedules:', doctorSchedules);
      
      // Get appointment IDs that have corresponding doctor schedules
      const appointmentIdsWithSchedule = new Set();
      
      doctorSchedules.forEach(schedule => {
        const appointmentId = schedule.appointmentId || schedule.AppointmentId;
        if (appointmentId) {
          appointmentIdsWithSchedule.add(appointmentId);
          console.log('Found schedule for appointment ID:', appointmentId);
        }
      });

      console.log('Appointment IDs with schedule:', Array.from(appointmentIdsWithSchedule));

      // Filter appointments belonging to this doctor
      const doctorAppointments = appointments.filter(app => {
        const appDoctorId = app.doctorId || app.DoctorId;
        return appDoctorId === doctorId;
      });

      console.log('All doctor appointments:', doctorAppointments);

      // Filter for appointments that have valid doctor schedules
      const validApps = doctorAppointments.filter(app => {
        const hasSchedule = appointmentIdsWithSchedule.has(app.id);
        console.log(`Appointment ${app.id} has schedule: ${hasSchedule}`);
        return hasSchedule;
      });

      console.log('Valid appointments with schedule:', validApps);
      console.log('=== END FILTERING ===');

      setValidAppointments(validApps);
    } catch (error) {
      console.error('Error filtering valid appointments:', error);
      // Fallback: show all doctor appointments but warn user
      const doctorAppointments = appointments.filter(app => {
        const appDoctorId = app.doctorId || app.DoctorId;
        return appDoctorId === doctorId;
      });
      setValidAppointments(doctorAppointments);
      message.warning('Không thể xác minh lịch làm việc. Một số lịch hẹn có thể không hợp lệ để tạo phác đồ.');
    }
  };

  const statusMap = {
    'Active': 0,
    'Completed': 1,
    'Discontinued': 2
  };

  const handleCreateProtocol = async (values) => {
    try {
      const requestData = {
        patientId: values.patientId,
        doctorId: currentDoctor?.id,
        arvProtocolId: values.arvProtocolId,
        startDate: values.dateRange ? values.dateRange[0].toISOString() : null,
        endDate: values.dateRange ? values.dateRange[1].toISOString() : null,
        status: statusMap[values.status] ?? 0
      };

      console.log('Creating patient treatment protocol with data:', requestData);
      console.log('Current doctor:', currentDoctor);
      
      await patientTreatmentProtocolService.createPatientTreatmentProtocol(requestData);
      message.success('Tạo quy trình điều trị thành công');
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error('Create protocol error:', error);
      console.error('Error details:', {
        message: error.message,
        requestData: {
          patientId: values.patientId,
          doctorId: currentDoctor?.id,
          arvProtocolId: values.arvProtocolId,
          startDate: values.dateRange ? values.dateRange[0].toISOString() : null,
          endDate: values.dateRange ? values.dateRange[1].toISOString() : null,
          status: statusMap[values.status] ?? 0
        }
      });

      message.error(error.message || 'Không thể tạo quy trình điều trị');
    }
  };

  const handleCreateStage = async (values) => {
    try {
      // Format reminder time if provided (single time picker)
      let reminderTimesString = '';
      if (values.reminderTimes) {
        reminderTimesString = values.reminderTimes.format('HH:mm');
      }

      // Parse prescription items from form
      let prescriptionObject = null;
      if (values.prescriptionItems && values.prescriptionItems.length > 0) {
        prescriptionObject = {
          PrescriptionItems: values.prescriptionItems.map(item => ({
            DrugName: item.drugName || '',
            Dosage: item.dosage || '',
            Frequency: item.frequency || ''
          }))
        };
      }

      const requestData = {
        StageName: values.stageName,
        StageNumber: parseInt(values.orderNumber),
        Description: values.description || '',
        PatientTreatmentProtocolId: values.patientTreatmentProtocolId,
        StartDate: values.startDate.toISOString(),
        EndDate: values.endDate ? values.endDate.toISOString() : null,
        ReminderTimes: reminderTimesString,
        Status: 0, // Active status
        ExaminationDate: values.examinationDate.toISOString(),
        Diagnosis: values.diagnosis || '',
        Symptoms: values.symptoms || '',
        Notes: values.notes || '',
        PrescriptionNote: values.prescriptionNote || '',
        Prescription: prescriptionObject
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
      // Nếu không có patientName, tìm từ danh sách patients
      if (!protocol.patientName && protocol.patientId && patients.length > 0) {
        const patient = patients.find(p => p.id === protocol.patientId);
        protocol.patientName = patient ? patient.fullName : 'Không rõ';
      }
      setSelectedProtocol(protocol);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Không thể xem chi tiết quy trình');
    }
  };

  const handleViewStage = (stageId) => {
    const stage = treatmentStages.find(
      s => s.treatmentStageId === stageId || s.id === stageId
    );
    setSelectedStage(stage);
    setIsStageModalVisible(true);
  };

  const handleUpdateStatus = (protocol) => {
    setSelectedProtocol(protocol);
    updateStatusForm.setFieldsValue({
      status: protocol.status
    });
    setIsUpdateStatusModalVisible(true);
  };

  const handleUpdateStatusSubmit = async (values) => {
    try {
      await patientTreatmentProtocolService.updateTreatmentProtocolStatus(
        selectedProtocol.id,
        values.status
      );
      message.success('Cập nhật trạng thái quy trình điều trị thành công!');
      setIsUpdateStatusModalVisible(false);
      updateStatusForm.resetFields();
      setSelectedProtocol(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating protocol status:', error);
      message.error('Không thể cập nhật trạng thái: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  // Chú thích các trạng thái quy trình điều trị:
  // Active: Đang điều trị
  // Completed: Hoàn thành
  // Discontinued: Ngừng điều trị

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': 
      case 0: return 'green';
      case 'Completed': 
      case 1: return 'blue';
      case 'Discontinued': 
      case 2: return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Active': return 'Đang điều trị';
      case 'Completed': return 'Hoàn thành';
      case 'Discontinued': return 'Ngừng điều trị';
      case 0: return 'Đang điều trị';
      case 1: return 'Hoàn thành';
      case 2: return 'Ngừng điều trị';
      default: return status || 'Không rõ';
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
      title: 'ARV Protocol ',
      dataIndex: 'arvProtocolId',
      key: 'arvProtocolId',
      render: (id, record) => {
        // Tìm tên ARV protocol từ arvProtocols
        const arv = arvProtocols.find(p => p.id === id);
        return id ? (
          <span>
             {arv ? arv.protocolName : ''}
          </span>
        ) : <span style={{color: 'gray'}}>Không có ARV</span>;
      },
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
      title: 'Chi tiết',
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
          <Tooltip title="Cập nhật trạng thái">
            <Button
              type="default"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleUpdateStatus(record)}
            />
          </Tooltip>
          <Tooltip title="Thêm giai đoạn">
            <Button
              type="default"
              icon={<CalendarOutlined />}
              size="small"
              onClick={() => {
                setSelectedStage(null);
                // Pre-fill the protocol in the stage form
                stageForm.setFieldsValue({
                  patientTreatmentProtocolId: record.id,
                  arvProtocolId: record.arvProtocolId
                });
                setIsStageModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Expandable row render function for treatment stages
  const expandedRowRender = (protocol) => {
    const protocolStages = treatmentStages.filter(
      stage => stage.patientTreatmentProtocolId === protocol.id
    );

    const stageColumns = [
      {
        title: 'Tên giai đoạn',
        dataIndex: 'stageName',
        key: 'stageName',
        render: (text) => <strong>{text}</strong>,
      },
      {
        title: 'Thứ tự',
        dataIndex: 'stageNumber',
        key: 'stageNumber',
        render: (number) => number || '-',
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
        title: 'Thời gian nhắc nhở',
        dataIndex: 'reminderTimes',
        key: 'reminderTimes',
        render: (time) => time || 'Không có',
      },
      {
        title: 'Chi tiết',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="Xem chi tiết">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => handleViewStage(record.treatmentStageId || record.id)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={stageColumns}
        dataSource={protocolStages}
        pagination={false}
        rowKey={record => record.treatmentStageId || record.id || Math.random()}
        locale={{
          emptyText: 'Chưa có giai đoạn điều trị nào'
        }}
      />
    );
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Quy trình điều trị bệnh nhân"
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
                  Thêm quy trình mới
                </Button>
              </Space>
            }
          >
            <Table
              columns={protocolColumns}
              dataSource={patientProtocols}
              rowKey="id"
              loading={loading}
              expandable={{
                expandedRowRender,
                expandRowByClick: true,
                expandIcon: ({ expanded, onExpand, record }) => {
                  const stageCount = treatmentStages.filter(
                    stage => stage.patientTreatmentProtocolId === record.id
                  ).length;
                  
                  return (
                    <Button
                      type="link"
                      size="small"
                      onClick={e => onExpand(record, e)}
                      style={{ 
                        padding: 0,
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {expanded ? '▼' : '▶'} 
                      <span style={{ marginLeft: 4 }}>
                        Giai đoạn ({stageCount})
                      </span>
                    </Button>
                  );
                }
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} quy trình`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Modal cho phác đồ điều trị */}
      <Modal
        title={selectedProtocol ? 'Chi tiết quy trình điều trị' : 'Thêm quy trình điều trị mới'}
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
            Tạo quy trình
          </Button>
        ]}
        width={600}
      >
        {selectedProtocol ? (
          <div>
            <p><strong>Tên bệnh nhân:</strong> {selectedProtocol.patientName}</p>
            <p><strong>ARV Protocol:</strong> {selectedProtocol.arvProtocolName || selectedProtocol.arvProtocolId || '-'}</p>
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
              status: 'Active'
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
                {patients
                  .filter(patient => {
                    // Chỉ hiển thị bệnh nhân đã có lịch hẹn
                    return appointmentsData.some(appointment => 
                      appointment.patientId === patient.id || appointment.PatientId === patient.id
                    );
                  })
                  .map(p => (
                    <Option key={p.id} value={p.id}>
                      {p.fullName}
                    </Option>
                  ))}
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
              name="dateRange"
              label="Thời gian điều trị"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
            >
              <RangePicker 
                style={{ width: '100%' }} 
                disabledDate={(current) => {
                  // Không cho chọn ngày trong quá khứ (trước hôm nay)
                  return current && current < new Date().setHours(0, 0, 0, 0);
                }}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
            >
              <Select>
                <Option value="Active">Đang điều trị</Option>
                <Option value="Completed">Hoàn thành</Option>
                <Option value="Discontinued">Ngừng điều trị</Option>
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
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}> 
            {/* Thông tin cơ bản */}
            <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#0369a1' }}>Thông tin giai đoạn</h4>
              <p><strong>Tên giai đoạn:</strong> {selectedStage.stageName || selectedStage.StageName || '-'}</p>
              <p><strong>Mô tả:</strong> {selectedStage.description || selectedStage.Description || 'Không có mô tả'}</p>
              <p><strong>Bệnh nhân:</strong> {selectedStage.patientName || selectedStage.PatientName || '-'}</p>
            </div>

            {/* Thời gian */}
            <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#166534' }}>Thời gian điều trị</h4>
              <p><strong>Ngày bắt đầu:</strong> {selectedStage.startDate ? new Date(selectedStage.startDate).toLocaleDateString('vi-VN') : (selectedStage.StartDate ? new Date(selectedStage.StartDate).toLocaleDateString('vi-VN') : 'Chưa xác định')}</p>
              <p><strong>Ngày kết thúc:</strong> {selectedStage.endDate ? new Date(selectedStage.endDate).toLocaleDateString('vi-VN') : (selectedStage.EndDate ? new Date(selectedStage.EndDate).toLocaleDateString('vi-VN') : 'Chưa xác định')}</p>
              <p><strong>Thời gian nhắc nhở:</strong> {
                (() => {
                  const reminderTime = selectedStage.reminderTimes || selectedStage.ReminderTimes;
                  return reminderTime || 'Không có';
                })()
              }</p>
            </div>

            {/* Ghi chú */}
            {(selectedStage.notes || selectedStage.Notes) && (
              <div style={{ padding: 16, backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#475569' }}>Ghi chú</h4>
                <p style={{ margin: 0 }}>{selectedStage.notes || selectedStage.Notes}</p>
              </div>
            )}
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
                  name="arvProtocolId"
                  label="Phác đồ ARV"
                  rules={[{ required: true, message: 'Vui lòng chọn phác đồ ARV' }]}
                >
                  <Select placeholder="Chọn phác đồ ARV" disabled>
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
              </Col>
              <Col span={12}>
                <Form.Item
                  name="patientTreatmentProtocolId"
                  label="Quy trình điều trị"
                  rules={[{ required: true, message: 'Vui lòng chọn quy trình điều trị' }]}
                >
                  <Select 
                    placeholder="Chọn quy trình điều trị"
                    onChange={(value) => {
                      // Tự động điền ARV protocol khi chọn quy trình điều trị
                      const selectedProtocol = patientProtocols.find(p => p.id === value);
                      if (selectedProtocol && selectedProtocol.arvProtocolId) {
                        stageForm.setFieldsValue({
                          arvProtocolId: selectedProtocol.arvProtocolId
                        });
                      }
                    }}
                  >
                    {patientProtocols.map(protocol => {
                      // Lấy 3 số đầu của id phác đồ (UUID)
                      const shortId = protocol.id ? protocol.id.substring(0, 4) : '';
                      return (
                        <Option key={protocol.id} value={protocol.id}>
                          {shortId} - {protocol.patientName}
                        </Option>
                      );
                    })}
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
                  <DatePicker 
                    style={{ width: '100%' }} 
                    disabledDate={(current) => {
                      // Không cho chọn ngày trong quá khứ (trước hôm nay)
                      return current && current < new Date().setHours(0, 0, 0, 0);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label="Ngày kết thúc"
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    disabledDate={(current) => {
                      // Không cho chọn ngày trong quá khứ (trước hôm nay)
                      return current && current < new Date().setHours(0, 0, 0, 0);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="reminderTimes"
                  label="Thời gian nhắc nhở"
                  help="Chọn thời gian trong ngày để nhắc nhở uống thuốc"
                >
                  <TimePicker 
                    format="HH:mm"
                    placeholder="Chọn thời gian nhắc nhở"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Medical Record Fields */}
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <h4>Thông tin khám bệnh</h4>
              
              <Form.Item
                name="examinationDate"
                label="Ngày khám"
                rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabledDate={(current) => {
                    // Không cho chọn ngày trong quá khứ (trước hôm nay)
                    return current && current < new Date().setHours(0, 0, 0, 0);
                  }}
                />
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
                name="prescriptionNote"
                label="Ghi chú đơn thuốc"
              >
                <TextArea rows={2} placeholder="Nhập ghi chú về đơn thuốc" />
              </Form.Item>

              <Form.List name="prescriptionItems">
                {(fields, { add, remove }) => (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label>Danh sách thuốc:</label>
                      <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                        Thêm thuốc
                      </Button>
                    </div>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ 
                        marginBottom: 16, 
                        padding: 12, 
                        border: '1px solid #d9d9d9', 
                        borderRadius: 6,
                        backgroundColor: '#fafafa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontWeight: 'bold' }}>Thuốc #{key + 1}</span>
                          <Button type="link" danger onClick={() => remove(name)} size="small">
                            Xóa
                          </Button>
                        </div>
                        
                        <Form.Item
                          {...restField}
                          name={[name, 'drugName']}
                          label="Tên thuốc"
                          rules={[{ required: true, message: 'Nhập tên thuốc' }]}
                          style={{ marginBottom: 12 }}
                        >
                          <AutoComplete
                            placeholder="Chọn thuốc có sẵn hoặc nhập tên thuốc mới"
                            style={{ width: '100%' }}
                            options={hivDrugOptions.map(drug => ({ value: drug, label: drug }))}
                            filterOption={(inputValue, option) =>
                              option.label.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            allowClear
                          />
                        </Form.Item>
                        
                        <Form.Item
                          {...restField}
                          name={[name, 'frequency']}
                          label="Tần suất sử dụng"
                          rules={[{ required: true, message: 'Nhập tần suất' }]}
                          style={{ marginBottom: 12 }}
                        >
                          <Input placeholder="VD: 2 lần/ngày, sau ăn" />
                        </Form.Item>
                        
                        <Form.Item
                          {...restField}
                          name={[name, 'dosage']}
                          label="Tác dụng phụ"
                          rules={[{ required: true, message: 'Nhập tác dụng phụ' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="Nhập các tác dụng phụ có thể xảy ra" />
                        </Form.Item>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>

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

      {/* Modal cập nhật trạng thái quy trình điều trị */}
      <Modal
        title="Cập nhật trạng thái quy trình điều trị"
        open={isUpdateStatusModalVisible}
        onCancel={() => {
          setIsUpdateStatusModalVisible(false);
          setSelectedProtocol(null);
          updateStatusForm.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsUpdateStatusModalVisible(false);
            setSelectedProtocol(null);
            updateStatusForm.resetFields();
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => updateStatusForm.submit()}>
            Cập nhật trạng thái
          </Button>
        ]}
        width={500}
      >
        <Form
          form={updateStatusForm}
          layout="vertical"
          onFinish={handleUpdateStatusSubmit}
        >
          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 6 }}>
            <p><strong>Bệnh nhân:</strong> {selectedProtocol?.patientName}</p>
            <p><strong>ARV Protocol:</strong> {selectedProtocol?.arvProtocolName || selectedProtocol?.arvProtocolId || '-'}</p>
            <p><strong>Trạng thái hiện tại:</strong> 
              <Tag color={getStatusColor(selectedProtocol?.status)} style={{ marginLeft: 8 }}>
                {getStatusText(selectedProtocol?.status)}
              </Tag>
            </p>
          </div>

          <Form.Item
            name="status"
            label="Trạng thái mới"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái mới">
              <Option value="Active">Đang điều trị</Option>
              <Option value="Completed">Hoàn thành</Option>
              <Option value="Discontinued">Ngừng điều trị</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TreatmentProtocol;