import { Table, Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

// Helper function to map backend doctor fields to frontend fields
function mapDoctorFromBackend(doctor) {
  return {
    id: doctor.id,
    doctorId: doctor.id,
    fullName: doctor.fullName,
    specialization: doctor.specialization,
    qualifications: doctor.qualifications,
    experience: doctor.experience,
    bio: doctor.bio,
    profilePictureURL: doctor.profilePictureURL,
    isActive: doctor.isActive,
  };
}

const DoctorList = ({ doctors, onEdit, onDelete, onSave, isLoading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Map doctors from backend before using in Table
  const mappedDoctors = Array.isArray(doctors) ? doctors.map(mapDoctorFromBackend) : [];

  const handleEdit = (record) => {
    setEditingDoctor(record);
    form.setFieldsValue({
      ...record,
      fullName: record.fullName || '',
      specialization: record.specialization || '',
      qualifications: record.qualifications || '',
      experience: record.experience || '',
      bio: record.bio || '',
      profilePictureURL: record.profilePictureURL || '',
      isActive: record.isActive,
      doctorId: record.doctorId
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
        doctorId: editingDoctor?.doctorId,
        fullName: values.fullName?.trim(),
        specialization: values.specialization,
        qualifications: values.qualifications?.trim(),
        experience: values.experience?.trim(),
        bio: values.bio?.trim(),
        profilePictureURL: values.profilePictureURL?.trim(),
        isActive: values.isActive,
      };

      if (editingDoctor) {
        const updateData = {
          ...editingDoctor,
          ...doctorData,
          doctorId: editingDoctor.doctorId
        };
        console.log('Sending update data:', updateData); // Debug log
        if (onSave) {
          await onSave(updateData);
        } else if (onEdit) {
          await onEdit(updateData);
        }
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
      title: 'Chuyên khoa',
      dataIndex: 'specialization',
      key: 'specialization',
    },
    {
      title: 'Bằng cấp',
      dataIndex: 'qualifications',
      key: 'qualifications',
    },
    {
      title: 'Kinh nghiệm',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: 'Mô tả',
      dataIndex: 'bio',
      key: 'bio',
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'profilePictureURL',
      key: 'profilePictureURL',
      render: (url) => url ? <img src={url} alt="avatar" style={{width: 40, height: 40, objectFit: 'cover', borderRadius: '50%'}} /> : 'Không có',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Đang làm việc' : 'Nghỉ phép'}
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
        dataSource={mappedDoctors}
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
            isActive: true,
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
            name="specialization"
            label="Chuyên khoa"
            rules={[{ required: true, message: 'Vui lòng nhập chuyên khoa' }]}
          >
            <Input placeholder="Nhập chuyên khoa" />
          </Form.Item>
          <Form.Item
            name="qualifications"
            label="Bằng cấp"
            rules={[
              { required: true, message: 'Vui lòng nhập bằng cấp' },
              { min: 10, message: 'Bằng cấp phải có ít nhất 10 ký tự' }
            ]}
          >
            <Input.TextArea rows={2} placeholder="Nhập thông tin bằng cấp của bác sĩ" />
          </Form.Item>
          <Form.Item
            name="experience"
            label="Kinh nghiệm"
            rules={[
              { required: true, message: 'Vui lòng nhập kinh nghiệm' },
              { min: 5, message: 'Kinh nghiệm phải có ít nhất 5 ký tự' }
            ]}
          >
            <Input.TextArea rows={2} placeholder="Nhập kinh nghiệm làm việc của bác sĩ" />
          </Form.Item>
          <Form.Item
            name="bio"
            label="Mô tả"
          >
            <Input.TextArea rows={2} placeholder="Nhập mô tả thêm về bác sĩ (không bắt buộc)" />
          </Form.Item>
          <Form.Item
            name="profilePictureURL"
            label="Ảnh đại diện (URL)"
          >
            <Input placeholder="Nhập URL ảnh đại diện (nếu có)" />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value={true}>Đang làm việc</Select.Option>
              <Select.Option value={false}>Nghỉ phép</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorList;