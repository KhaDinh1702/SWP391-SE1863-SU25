import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, message, Space, Tag, Tooltip, Popconfirm, Switch } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { arvProtocolService } from '../../../services';

const { Option } = Select;
const { TextArea } = Input;

const ARVProtocols = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProtocols();
  }, []);

  const fetchProtocols = async () => {
    setLoading(true);
    try {
      const data = await arvProtocolService.getAllARVProtocols();
      setProtocols(data);
    } catch (error) {
      message.error('Không thể tải danh sách phác đồ ARV');
      console.error('Error fetching protocols:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProtocol = async (values) => {
    try {
      // Chuyển đổi dữ liệu theo đúng format của CreateARVProtocolRequest (PascalCase)
      const requestData = {
        ProtocolName: values.protocolName,
        Description: values.description || '',
        Indications: values.indications || '',
        Dosage: values.dosage || '',
        SideEffects: values.sideEffects || '',
        IsDefault: Boolean(values.isDefault),
        ProtocolType: values.protocolType
      };

      console.log('Creating protocol with data:', requestData);
      console.log('ProtocolType value:', requestData.ProtocolType);
      console.log('ProtocolType type:', typeof requestData.ProtocolType);
      console.log('IsDefault value:', requestData.IsDefault);
      console.log('IsDefault type:', typeof requestData.IsDefault);
      
      await arvProtocolService.createARVProtocol(requestData);
      message.success('Tạo phác đồ ARV thành công');
      setIsModalVisible(false);
      form.resetFields();
      fetchProtocols();
    } catch (error) {
      console.error('Create protocol error:', error);
      message.error(error.message || 'Không thể tạo phác đồ ARV');
    }
  };

  const handleViewProtocol = async (protocolId) => {
    try {
      const protocol = await arvProtocolService.getARVProtocolById(protocolId);
      setSelectedProtocol(protocol);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Không thể xem chi tiết phác đồ');
    }
  };

  const getProtocolTypeText = (type) => {
    const typeMap = {
      'A': 'Phác đồ bậc 1 - TDF + 3TC + EFV',
      'B': 'Phác đồ bậc 2 - AZT + 3TC + LPV/r',
      'C': 'Phác đồ bậc 3 - DRV + ETR + DTG + NRTIs',
      'D': 'Phác đồ tùy chỉnh'
    };
    return typeMap[type] || type;
  };

  const getProtocolTypeColor = (type) => {
    const colorMap = {
      'A': 'green',
      'B': 'blue',
      'C': 'orange',
      'D': 'red',
    };
    return colorMap[type] || 'default';
  };

  const columns = [
    {
      title: 'Tên phác đồ',
      dataIndex: 'protocolName',
      key: 'protocolName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Loại phác đồ',
      dataIndex: 'protocolType',
      key: 'protocolType',
      render: (type) => (
        <Tag color={getProtocolTypeColor(type)}>
          {getProtocolTypeText(type)}
        </Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Mặc định',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault) => (
        <Tag color={isDefault ? 'green' : 'default'}>
          {isDefault ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewProtocol(record.protocolId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Quản lý phác đồ ARV"
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchProtocols}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedProtocol(null);
                setIsModalVisible(true);
              }}
            >
              Thêm phác đồ mới
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={protocols}
          rowKey="protocolId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phác đồ`,
          }}
        />
      </Card>

      <Modal
        title={selectedProtocol ? 'Chi tiết phác đồ ARV' : 'Thêm phác đồ ARV mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedProtocol(null);
          form.resetFields();
        }}
        footer={selectedProtocol ? [
          <Button key="close" onClick={() => {
            setIsModalVisible(false);
            setSelectedProtocol(null);
          }}>
            Đóng
          </Button>
        ] : [
          <Button key="cancel" onClick={() => {
            setIsModalVisible(false);
            setSelectedProtocol(null);
            form.resetFields();
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Tạo phác đồ
          </Button>
        ]}
        width={700}
      >
        {selectedProtocol ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p><strong>Tên phác đồ:</strong> {selectedProtocol.protocolName}</p>
                <p><strong>Loại phác đồ:</strong> 
                  <Tag color={getProtocolTypeColor(selectedProtocol.protocolType)} style={{ marginLeft: 8 }}>
                    {getProtocolTypeText(selectedProtocol.protocolType)}
                  </Tag>
                </p>
                <p><strong>Mặc định:</strong> 
                  <Tag color={selectedProtocol.isDefault ? 'green' : 'default'} style={{ marginLeft: 8 }}>
                    {selectedProtocol.isDefault ? 'Có' : 'Không'}
                  </Tag>
                </p>
              </div>
              <div>
                <p><strong>Ngày tạo:</strong> {selectedProtocol.createdDate ? new Date(selectedProtocol.createdDate).toLocaleDateString('vi-VN') : '-'}</p>
                <p><strong>Trạng thái:</strong> 
                  <Tag color={selectedProtocol.isActive ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                    {selectedProtocol.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </Tag>
                </p>
              </div>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <p><strong>Mô tả:</strong></p>
              <p style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {selectedProtocol.description || 'Không có mô tả'}
              </p>
            </div>

            {selectedProtocol.indications && (
              <div style={{ marginTop: 16 }}>
                <p><strong>Chỉ định:</strong></p>
                <p style={{ padding: 12, backgroundColor: '#f0f8ff', borderRadius: 4 }}>
                  {selectedProtocol.indications}
                </p>
              </div>
            )}

            {selectedProtocol.dosage && (
              <div style={{ marginTop: 16 }}>
                <p><strong>Liều lượng:</strong></p>
                <p style={{ padding: 12, backgroundColor: '#fff8f0', borderRadius: 4 }}>
                  {selectedProtocol.dosage}
                </p>
              </div>
            )}

            {selectedProtocol.sideEffects && (
              <div style={{ marginTop: 16 }}>
                <p><strong>Tác dụng phụ và theo dõi:</strong></p>
                <p style={{ padding: 12, backgroundColor: '#fff0f0', borderRadius: 4 }}>
                  {selectedProtocol.sideEffects}
                </p>
              </div>
            )}
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateProtocol}
            initialValues={{
              isDefault: false,
              protocolType: 'A'
            }}
          >
            <Form.Item
              name="protocolName"
              label="Tên phác đồ"
              rules={[{ required: true, message: 'Vui lòng nhập tên phác đồ' }]}
            >
              <Input placeholder="Nhập tên phác đồ ARV" />
            </Form.Item>

            <Form.Item
              name="protocolType"
              label="Loại phác đồ"
              rules={[{ required: true, message: 'Vui lòng chọn loại phác đồ' }]}
            >
              <Select placeholder="Chọn loại phác đồ">
                <Option value="A">Phác đồ bậc 1 - TDF + 3TC + EFV</Option>
                <Option value="B">Phác đồ bậc 2 - AZT + 3TC + LPV/r</Option>
                <Option value="C">Phác đồ bậc 3 - DRV + ETR + DTG + NRTIs</Option>
                <Option value="D">Phác đồ tùy chỉnh</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea rows={3} placeholder="Nhập mô tả chi tiết về phác đồ và lý do áp dụng" />
            </Form.Item>

            <Form.Item
              name="indications"
              label="Chỉ định"
            >
              <TextArea rows={2} placeholder="VD: Người mới bắt đầu điều trị, phụ nữ mang thai, trẻ em, người có bệnh thận..." />
            </Form.Item>

            <Form.Item
              name="dosage"
              label="Liều lượng chi tiết"
            >
              <TextArea rows={4} placeholder="VD: TDF 300mg + 3TC 300mg + EFV 600mg, uống 1 lần/ngày vào buổi tối. TDF: 300mg/ngày, 3TC: 300mg/ngày, EFV: 600mg/ngày..." />
            </Form.Item>

            <Form.Item
              name="sideEffects"
              label="Tác dụng phụ và theo dõi"
            >
              <TextArea rows={3} placeholder="VD: Buồn nôn, chóng mặt, mất ngủ, rối loạn lipid máu. Theo dõi chức năng thận, gan, lipid máu định kỳ..." />
            </Form.Item>

            <Form.Item
              name="isDefault"
              label="Phác đồ mặc định"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ARVProtocols; 