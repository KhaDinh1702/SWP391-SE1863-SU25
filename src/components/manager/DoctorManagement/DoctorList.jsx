import { Table, Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const DoctorList = ({ doctors, onEdit, onDelete, isLoading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = (record) => {
    setEditingDoctor(record);
    form.setFieldsValue({
      ...record,
      // Ensure all fields are properly set
      fullName: record.fullName || '',
      email: record.email || '',
      phone: record.phone || '',
      specialty: record.specialty || '',
      status: record.status || 'active',
      qualification: record.qualification || '',
      experience: record.experience || '',
      description: record.description || ''
    });
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
      setSubmitting(true);
      const values = await form.validateFields();
      console.log('Form values:', values); // Debug log

      const doctorData = {
        ...values,
        // Ensure all required fields are present
        fullName: values.fullName?.trim(),
        email: values.email?.trim(),
        phone: values.phone?.trim(),
        specialty: values.specialty,
        status: values.status,
        qualification: values.qualification?.trim(),
        experience: values.experience?.trim(),
        description: values.description?.trim()
      };

      if (editingDoctor) {
        // For update, we need to include the doctor ID and preserve existing data
        const updateData = {
          ...editingDoctor,
          ...doctorData,
          id: editingDoctor.id // Ensure the ID is preserved
        };
        console.log('Sending update data:', updateData); // Debug log
        await onEdit(updateData);
        message.success('Cập nhật thông tin bác sĩ thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation error:', error);
      if (error.errorFields) {
        const firstError = error.errorFields[0];
        message.error(firstError.errors[0]);
      } else {
        message.error('Có lỗi xảy ra khi lưu thông tin bác sĩ');
      }
    } finally {
      setSubmitting(false);
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
      <Table
        columns={columns}
        dataSource={doctors}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title="Sửa thông tin bác sĩ"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={submitting}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            specialty: 'HIV/AIDS'
          }}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
            ]}
          >
            <Input placeholder="Nhập họ và tên bác sĩ" />
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
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' }
            ]}
          >
            <Input placeholder="0123456789" />
          </Form.Item>

          <Form.Item
            name="specialty"
            label="Chuyên khoa"
            rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa' }]}
          >
            <Select placeholder="Chọn chuyên khoa">
              <Select.Option value="HIV/AIDS">HIV/AIDS</Select.Option>
              <Select.Option value="Nội tổng quát">Nội tổng quát</Select.Option>
              <Select.Option value="Da liễu">Da liễu</Select.Option>
              <Select.Option value="Tâm lý">Tâm lý</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="active">Đang làm việc</Select.Option>
              <Select.Option value="inactive">Nghỉ phép</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="qualification"
            label="Bằng cấp"
            rules={[
              { required: true, message: 'Vui lòng nhập bằng cấp' },
              { min: 10, message: 'Bằng cấp phải có ít nhất 10 ký tự' }
            ]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Nhập thông tin bằng cấp của bác sĩ"
            />
          </Form.Item>

          <Form.Item
            name="experience"
            label="Kinh nghiệm"
            rules={[
              { required: true, message: 'Vui lòng nhập kinh nghiệm' },
              { min: 10, message: 'Kinh nghiệm phải có ít nhất 10 ký tự' }
            ]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Nhập kinh nghiệm làm việc của bác sĩ"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Nhập mô tả thêm về bác sĩ (không bắt buộc)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorList;