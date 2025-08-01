import React, { useEffect } from 'react';
import { Form, Input, Switch, Button, Select, message } from 'antd';
import { arvProtocolService } from '../../services/arvProtocolService';
const { TextArea } = Input;

const PROTOCOL_TYPE_OPTIONS = [
  { value: 0, label: 'A' },
  { value: 1, label: 'B' },
  { value: 2, label: 'C' },
  { value: 3, label: 'D' },
  { value: 4, label: 'E' },
  { value: 5, label: 'F' },
  { value: 6, label: 'G' },
  { value: 7, label: 'H' },
];

const UpdateARVProtocolForm = ({ onSuccess, form, protocolData }) => {
  useEffect(() => {
    if (protocolData && form) {
      form.setFieldsValue({
        protocolName: protocolData.protocolName,
        description: protocolData.description || "",
        indications: protocolData.indications || "",
        dosage: protocolData.dosage || "",
        sideEffects: protocolData.sideEffects || "",
        isDefault: protocolData.isDefault,
        protocolType: protocolData.protocolType,
      });
    }
  }, [protocolData, form]);

  const handleUpdateProtocol = async (values) => {
    // Ensure all text fields are at least empty string
    const payload = {
      ...values,
      description: values.description || "",
      indications: values.indications || "",
      dosage: values.dosage || "",
      sideEffects: values.sideEffects || "",
      // Convert boolean to 1/0 for backend
      isDefault: values.isDefault ? 1 : 0,
    };
    console.log('Update payload:', payload);
    try {
      await arvProtocolService.updateARVProtocol(protocolData.protocolId, payload);
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error(error.message || 'Cập nhật phác đồ thất bại');
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleUpdateProtocol}
      initialValues={{
        isDefault: false,
        protocolType: undefined,
      }}
    >
      <Form.Item
        label="Tên phác đồ"
        name="protocolName"
        rules={[
          { required: true, message: 'Vui lòng nhập tên phác đồ' },
          { validator: (_, value) => value && value.trim() !== '' ? Promise.resolve() : Promise.reject('Tên phác đồ không được để trống hoặc chỉ chứa dấu cách') }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Mô tả" name="description">
        <TextArea rows={2} onChange={e => form.setFieldsValue({ description: e.target.value })} />
      </Form.Item>
      <Form.Item label="Chỉ định" name="indications">
        <TextArea rows={2} onChange={e => form.setFieldsValue({ indications: e.target.value })} />
      </Form.Item>
      <Form.Item label="Liều dùng" name="dosage">
        <TextArea rows={2} onChange={e => form.setFieldsValue({ dosage: e.target.value })} />
      </Form.Item>
      <Form.Item label="Tác dụng phụ" name="sideEffects">
        <TextArea rows={2} onChange={e => form.setFieldsValue({ sideEffects: e.target.value })} />
      </Form.Item>
      <Form.Item label="Mặc định" name="isDefault" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Loại phác đồ (ProtocolType)" name="protocolType" rules={[{ required: true, message: 'Chọn loại phác đồ' }]}>
        <Select
          options={PROTOCOL_TYPE_OPTIONS}
          onChange={value => form.setFieldsValue({ protocolType: value })}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Cập nhật phác đồ</Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateARVProtocolForm;
