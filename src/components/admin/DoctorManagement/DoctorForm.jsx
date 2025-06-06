import { Form, Input, Button, Select, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const DoctorForm = ({ initialValues, onFinish, onCancel, specializations }) => {
  const [form] = Form.useForm();

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="name"
        label="Họ và Tên"
        rules={[{ required: true, message: 'Vui lòng nhập tên bác sĩ' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="specialization"
        label="Chuyên Môn"
        rules={[{ required: true, message: 'Vui lòng chọn chuyên môn' }]}
      >
        <Select options={specializations} />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số Điện Thoại"
        rules={[{ pattern: /^[0-9]+$/, message: 'Chỉ nhập số' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="certificates"
        label="Bằng Cấp"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Tải lên bằng cấp</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Hủy
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DoctorForm;