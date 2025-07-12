import React, { useState } from 'react';
import { Form, Input, Switch, Button, Select, message } from 'antd';
import { arvProtocolService } from '../../services/arvProtocolService';
const { TextArea } = Input;

const PROTOCOL_TYPE_OPTIONS = [
  { value: 0, label: 'A - Tenofovir + Lamivudine + Efavirenz (Phác đồ bậc 1 phổ biến)' },
  { value: 1, label: 'B - Tenofovir + Lamivudine + Dolutegravir (Hiệu quả cao, ít kháng)' },
  { value: 2, label: 'C - Zidovudine + Lamivudine + Nevirapine (Phác đồ cũ)' },
  { value: 3, label: 'D - Zidovudine + Lamivudine + Efavirenz (Thay thế TDF)' },
  { value: 4, label: 'E - Abacavir + Lamivudine + Lopinavir/Ritonavir (Dành cho trẻ em)' },
  { value: 5, label: 'F - Tenofovir + Lamivudine + Lopinavir/Ritonavir (Phác đồ bậc 2)' },
  { value: 6, label: 'G - Darunavir + Ritonavir + Raltegravir (Phác đồ kháng thuốc)' },
  { value: 7, label: 'H - Emtricitabine + Tenofovir + Rilpivirine (Phác đồ mới)' },
];

const CreateARVProtocolForm = ({ onSuccess, form }) => {
  const [isDefault, setIsDefault] = useState(false);

  const handleCreateProtocol = async (values) => {
    // Ensure all text fields are at least empty string
    const payload = {
      ...values,
      description: values.description || "",
      indications: values.indications || "",
      dosage: values.dosage || "",
      sideEffects: values.sideEffects || "",
      // Convert boolean to 1/0 for backend
      isDefault: values.isDefault ? 1 : 0,
      // Nếu là default thì không cần protocolType
      protocolType: values.isDefault ? undefined : values.protocolType,
    };
    console.log('Submit payload:', payload);
    try {
      await arvProtocolService.createARVProtocol(payload);
      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error(error.message || 'Tạo phác đồ thất bại');
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleCreateProtocol}
      initialValues={{
        isDefault: false,
        protocolType: 0, // Mặc định chọn loại A
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
      <Form.Item 
        label="Mặc định" 
        name="isDefault" 
        valuePropName="checked"
      > 
        <Switch 
          checkedChildren="Có" 
          unCheckedChildren="Không"
          onChange={(checked) => {
            setIsDefault(checked);
            if (checked) {
              // Nếu chọn mặc định, clear protocolType
              form.setFieldsValue({ protocolType: undefined });
            }
          }}
        /> 
      </Form.Item>
      <Form.Item 
        label="Loại phác đồ (ProtocolType)" 
        name="protocolType" 
        rules={[
          { 
            required: !isDefault, 
            message: 'Chọn loại phác đồ (không bắt buộc nếu là phác đồ mặc định)' 
          }
        ]}
      > 
        <Select
          disabled={isDefault}
          placeholder={isDefault ? "Không áp dụng cho phác đồ mặc định" : "Chọn loại phác đồ"}
          options={PROTOCOL_TYPE_OPTIONS}
          onChange={value => form.setFieldsValue({ protocolType: value })}
        />
      </Form.Item>
      <Form.Item> <Button type="primary" htmlType="submit">Tạo phác đồ</Button> </Form.Item>
    </Form>
  );
};

export default CreateARVProtocolForm; 