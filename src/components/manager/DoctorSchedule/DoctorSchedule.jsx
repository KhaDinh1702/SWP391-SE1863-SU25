import { Calendar, Select, Card, Badge, List, Typography } from 'antd';
import { useState } from 'react';

const { Option } = Select;
const { Text } = Typography;

const DoctorSchedule = ({ doctors }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      time: '09:00',
      type: 'Khám mới',
      status: 'confirmed',
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      time: '10:30',
      type: 'Tái khám',
      status: 'pending',
    },
    {
      id: 3,
      patientName: 'Lê Văn C',
      time: '14:00',
      type: 'Khám mới',
      status: 'confirmed',
    },
  ];

  const getListData = (value) => {
    return appointments.filter(appointment => {
      // Mock logic - in real app, this would check against actual appointment dates
      return Math.random() > 0.5;
    });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id}>
            <Badge
              status={item.status === 'confirmed' ? 'success' : 'warning'}
              text={`${item.time} - ${item.patientName}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4">
          <Text strong className="mr-2">Chọn bác sĩ:</Text>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn bác sĩ"
            onChange={setSelectedDoctor}
            value={selectedDoctor}
          >
            {doctors.map(doctor => (
              <Option key={doctor.id} value={doctor.id}>
                {doctor.fullName} - {doctor.specialty}
              </Option>
            ))}
          </Select>
        </div>

        <Calendar cellRender={cellRender} />
      </Card>

      <Card title="Lịch hẹn hôm nay">
        <List
          dataSource={appointments}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={`${item.time} - ${item.patientName}`}
                description={item.type}
              />
              <Badge
                status={item.status === 'confirmed' ? 'success' : 'warning'}
                text={item.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default DoctorSchedule; 