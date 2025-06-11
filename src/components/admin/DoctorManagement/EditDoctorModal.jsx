import { Modal, Form, Input, message, InputNumber, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const EditDoctorModal = ({ visible, doctor, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave({ ...doctor, ...values });
      form.resetFields();
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thông tin bác sĩ"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnHidden
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={doctor}
      >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="specializations"
          label="Chuyên môn"
          rules={[{ required: true, message: 'Vui lòng nhập chuyên môn' }]}
        >
          <Input.TextArea rows={2} placeholder="Nhập các chuyên môn, phân cách bằng dấu phẩy" />
        </Form.Item>

        <Form.Item
          name="qualification"
          label="Trình độ"
          rules={[{ required: true, message: 'Vui lòng nhập trình độ' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="experience"
          label="Kinh nghiệm (năm)"
          rules={[{ required: true, message: 'Vui lòng nhập số năm kinh nghiệm' }]}
        >
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="bio"
          label="Tiểu sử"
          rules={[{ required: true, message: 'Vui lòng nhập tiểu sử' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="profilePictureURL"
          label="URL ảnh đại diện"
          rules={[{ required: true, message: 'Vui lòng nhập URL ảnh đại diện' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDoctorModal; 