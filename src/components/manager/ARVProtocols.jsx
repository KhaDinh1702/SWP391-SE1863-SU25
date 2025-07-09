import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { arvProtocolService } from '../../services/arvProtocolService';
import CreateARVProtocolForm from './CreateARVProtocolForm';
import UpdateARVProtocolForm from './UpdateARVProtocolForm';

const PROTOCOL_TYPE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const ARVProtocols = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  const fetchProtocols = async () => {
    setLoading(true);
    try {
      const data = await arvProtocolService.getAllARVProtocols();
      setProtocols(data);    } catch (error) {
      console.error('Error fetching protocols:', error);
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
    form.resetFields(); // Reset form after successful creation
    fetchProtocols();
    message.success('Tạo phác đồ thành công!');
  };

  const handleUpdateSuccess = () => {
    setUpdateModalVisible(false);
    setSelectedProtocol(null);
    fetchProtocols();
    message.success('Cập nhật phác đồ thành công!');
  };

  const handleEditProtocol = (protocol) => {
    // Convert isDefault from 1/0 to true/false for Switch component
    setSelectedProtocol({ 
      ...protocol, 
      isDefault: protocol.isDefault === 1 || protocol.isDefault === true 
    });
    setUpdateModalVisible(true);
  };

  const columns = [
    { title: 'Tên phác đồ', dataIndex: 'protocolName', key: 'protocolName' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Chỉ định', dataIndex: 'indications', key: 'indications', ellipsis: true },
    { title: 'Liều dùng', dataIndex: 'dosage', key: 'dosage', ellipsis: true },
    { title: 'Tác dụng phụ', dataIndex: 'sideEffects', key: 'sideEffects', ellipsis: true },
    { title: 'Mặc định', dataIndex: 'isDefault', key: 'isDefault', render: val => (val === 1 || val === true) ? 'Có' : 'Không' },
    { title: 'Loại phác đồ', dataIndex: 'protocolType', key: 'protocolType', render: val => PROTOCOL_TYPE_LABELS[val] || val },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Danh sách phác đồ ARV</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setModalVisible(true); }}>
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
        onCancel={() => { 
          form.resetFields(); 
          setModalVisible(false); 
        }}
        footer={null}
      >
        <CreateARVProtocolForm onSuccess={handleCreateSuccess} form={form} />
      </Modal>
      
      {/* Update modal removed since backend doesn't support update */}
    </div>
  );
};

export default ARVProtocols;