import { Table, Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { doctorService } from '../../../services/doctorService';

const DoctorList = ({ doctors, onEdit, onDelete, isLoading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDoctor, setEditingDoctor] = useState(null);

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingDoctor(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bác sĩ này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => onDelete(id),
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingDoctor) {
        onEdit({ ...editingDoctor, ...values });
      } else {
        const newDoctor = await doctorService.createDoctor(values);
        message.success('Thêm bác sĩ thành công');
        // Refresh the doctor list
        const updatedDoctors = await doctorService.getAllDoctors();
        setDoctors(updatedDoctors);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
      message.error(error.message || 'Có lỗi xảy ra');
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
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialty',
      key: 'specialty',
      render: (specialty) => (
        <Tag color="blue">{specialty}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang làm việc' : 'Nghỉ phép'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleAddDoctor}
        >
          Thêm bác sĩ
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={doctors}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingDoctor ? 'Sửa thông tin bác sĩ' : 'Thêm bác sĩ mới'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingDoctor ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="specialty"
            label="Chuyên khoa"
            rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa' }]}
          >
            <Select>
              <Select.Option value="Nội tổng quát">Nội tổng quát</Select.Option>
              <Select.Option value="Ngoại tổng quát">Ngoại tổng quát</Select.Option>
              <Select.Option value="Nhi khoa">Nhi khoa</Select.Option>
              <Select.Option value="Sản phụ khoa">Sản phụ khoa</Select.Option>
              <Select.Option value="Da liễu">Da liễu</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value="active">Đang làm việc</Select.Option>
              <Select.Option value="inactive">Nghỉ phép</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorList; 