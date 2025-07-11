import React, { useState, useEffect } from 'react';
import { Modal, Table, Tag, message, Descriptions, Card, Image, Space, Button, Tooltip } from 'antd';
import { FileTextOutlined, CalendarOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { medicalRecordService } from '../../services/medicalRecordService';
import dayjs from 'dayjs';

const MedicalRecordModal = ({ visible, onClose, patientId, patientName }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    if (visible && patientId) {
      fetchMedicalRecords();
    }
  }, [visible, patientId]);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      const data = await medicalRecordService.getAllMedicalRecords();
      // Filter records for the specific patient
      const patientRecords = Array.isArray(data) 
        ? data.filter(record => record.patientId === patientId || record.PatientId === patientId)
        : [];
      setMedicalRecords(patientRecords);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      message.error('Không thể tải hồ sơ bệnh án');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
  };

  const columns = [
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Ngày tạo
        </span>
      ),
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text, record) => formatDateTime(text || record.CreatedDate),
      sorter: (a, b) => {
        const dateA = dayjs(a.createdDate || a.CreatedDate);
        const dateB = dayjs(b.createdDate || b.CreatedDate);
        return dateA.isBefore(dateB) ? -1 : 1;
      },
      width: 150,
    },
    {
      title: (
        <span>
          <FileTextOutlined style={{ marginRight: 8 }} />
          Chẩn đoán
        </span>
      ),
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (text, record) => (
        <Tooltip title={text || record.Diagnosis || 'Chưa có chẩn đoán'}>
          <span style={{ 
            display: 'block', 
            maxWidth: 200, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || record.Diagnosis || 'Chưa có chẩn đoán'}
          </span>
        </Tooltip>
      ),
      width: 220,
    },
    {
      title: 'Triệu chứng',
      dataIndex: 'symptoms',
      key: 'symptoms',
      render: (text, record) => (
        <Tooltip title={text || record.Symptoms || 'Chưa có triệu chứng'}>
          <span style={{ 
            display: 'block', 
            maxWidth: 180, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || record.Symptoms || 'Chưa có triệu chứng'}
          </span>
        </Tooltip>
      ),
      width: 200,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewDetail(record)}
          size="small"
        >
          Xem chi tiết
        </Button>
      ),
      width: 120,
    },
  ];

  return (
    <>
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            {`Hồ sơ bệnh án - ${patientName || 'Bệnh nhân'}`}
          </Space>
        }
        open={visible}
        onCancel={onClose}
        width={1000}
        footer={null}
        destroyOnClose
      >
        <Table
          columns={columns}
          dataSource={medicalRecords}
          loading={loading}
          rowKey={(record) => record.id || record.Id || record.medicalRecordId}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} bản ghi`,
          }}
          scroll={{ y: 400 }}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            Chi tiết hồ sơ bệnh án
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={null}
        destroyOnClose
      >
        {selectedRecord && (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <Descriptions
              bordered
              column={1}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="Ngày tạo">
                {formatDateTime(selectedRecord.createdDate || selectedRecord.CreatedDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Chẩn đoán">
                {selectedRecord.diagnosis || selectedRecord.Diagnosis || 'Chưa có chẩn đoán'}
              </Descriptions.Item>
              <Descriptions.Item label="Triệu chứng">
                {selectedRecord.symptoms || selectedRecord.Symptoms || 'Chưa có triệu chứng'}
              </Descriptions.Item>
              <Descriptions.Item label="Điều trị">
                {selectedRecord.treatment || selectedRecord.Treatment || 'Chưa có điều trị'}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                {selectedRecord.notes || selectedRecord.Notes || 'Không có ghi chú'}
              </Descriptions.Item>
            </Descriptions>

            {/* Lab Pictures */}
            {(selectedRecord.labPictures || selectedRecord.LabPictures) && 
             (selectedRecord.labPictures?.length > 0 || selectedRecord.LabPictures?.length > 0) && (
              <Card title="Ảnh xét nghiệm" size="small" style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(selectedRecord.labPictures || selectedRecord.LabPictures).map((picture, index) => (
                    <Image
                      key={index}
                      width={100}
                      height={100}
                      src={picture.pictureUrl || picture.PictureUrl}
                      alt={`Lab Picture ${index + 1}`}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Yk1RUG8A+3ikQiwA1CkSCYHXABxIBgk8ggRAhixQHfAAeB3ZRIIIGFQ6CGAkXs3b8AAwNjk0wyCYWp7rGf1H1P397v/W/lrHvtA..."
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default MedicalRecordModal;