import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, DatePicker } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { patientService } from '../../services/patientService';
import moment from 'moment';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form] = Form.useForm();

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (error) {
      message.error('Không thể tải danh sách bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    form.setFieldsValue({
      ...patient,
      dateOfBirth: patient.dateOfBirth ? moment(patient.dateOfBirth) : null,
    });
    setEditModalVisible(true);
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setViewModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updateData = {
        ...selectedPatient,
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
      };
      
      await patientService.updatePatient(updateData);
      message.success('Cập nhật thông tin bệnh nhân thành công');
      setEditModalVisible(false);
      fetchPatients();
    } catch (error) {
      message.error('Cập nhật thông tin bệnh nhân thất bại');
    }
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => gender === 'Male' ? 'Nam' : gender === 'Female' ? 'Nữ' : 'Khác',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : 'Chưa cập nhật',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý thông tin bệnh nhân</h2>
      
      <Table
        columns={columns}
        dataSource={patients}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa thông tin bệnh nhân"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => setEditModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="example@email.com" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' }
            ]}
          >
            <Input placeholder="0123456789" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value="Male">Nam</Select.Option>
              <Select.Option value="Female">Nữ</Select.Option>
              <Select.Option value="Other">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Thông tin chi tiết bệnh nhân"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedPatient && (
          <div>
            <p><strong>Họ và tên:</strong> {selectedPatient.fullName}</p>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <p><strong>Số điện thoại:</strong> {selectedPatient.phoneNumber}</p>
            <p><strong>Giới tính:</strong> {selectedPatient.gender === 'Male' ? 'Nam' : selectedPatient.gender === 'Female' ? 'Nữ' : 'Khác'}</p>
            <p><strong>Ngày sinh:</strong> {selectedPatient.dateOfBirth ? moment(selectedPatient.dateOfBirth).format('DD/MM/YYYY') : 'Chưa cập nhật'}</p>
            <p><strong>Địa chỉ:</strong> {selectedPatient.address || 'Chưa cập nhật'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientManagement;
