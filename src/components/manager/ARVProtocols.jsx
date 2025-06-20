import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { arvProtocolService } from '../../services/arvProtocolService';
import CreateARVProtocolForm from './CreateARVProtocolForm';

const PROTOCOL_TYPE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const ARVProtocols = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchProtocols = async () => {
    setLoading(true);
    try {
      const data = await arvProtocolService.getAllARVProtocols();
      setProtocols(data);
    } catch (error) {
      message.error('Không thể tải danh sách phác đồ ARV');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProtocols();
  }, []);

  const handleCreateSuccess = () => {
    setModalVisible(false);
    fetchProtocols();
    message.success('Tạo phác đồ thành công!');
  };

  const columns = [
    { title: 'Tên phác đồ', dataIndex: 'protocolName', key: 'protocolName' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Chỉ định', dataIndex: 'indications', key: 'indications', ellipsis: true },
    { title: 'Liều dùng', dataIndex: 'dosage', key: 'dosage', ellipsis: true },
    { title: 'Tác dụng phụ', dataIndex: 'sideEffects', key: 'sideEffects', ellipsis: true },
    { title: 'Mặc định', dataIndex: 'isDefault', key: 'isDefault', render: val => val ? 'Có' : 'Không' },
    { title: 'Loại phác đồ', dataIndex: 'protocolType', key: 'protocolType', render: val => PROTOCOL_TYPE_LABELS[val] || val },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Danh sách phác đồ ARV</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalVisible(true); }}>
          Tạo phác đồ mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={protocols}
        rowKey={record => record.protocolId || record.id || record.key}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Tạo phác đồ ARV mới"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <CreateARVProtocolForm onSuccess={handleCreateSuccess} form={form} />
      </Modal>
    </div>
  );
};

export default ARVProtocols; 