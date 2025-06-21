import { useState, useEffect } from 'react';
import { Card, Spin, Alert, Typography, Button, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { doctorScheduleService } from '../../../services/doctorScheduleService';
import { doctorService } from '../../../services/doctorService';
import moment from 'moment';
import 'moment/locale/vi'; // Import Vietnamese locale for moment

const { Title, Text } = Typography;

const DoctorSchedule = () => {
  const [allSchedules, setAllSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());

  useEffect(() => {
    moment.locale('vi');
    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }

        const allDoctors = await doctorService.getAllDoctors();
        const currentDoctor = allDoctors.find(d => d.userId === userId);

        if (!currentDoctor) {
          setError('Không thể tìm thấy thông tin bác sĩ.');
          setLoading(false);
          return;
        }

        const doctorId = currentDoctor.id;
        const allSchedulesResponse = await doctorScheduleService.getAllDoctorSchedules();

        if (allSchedulesResponse && Array.isArray(allSchedulesResponse)) {
            const doctorSchedules = allSchedulesResponse.filter(s => s.doctorId === doctorId);
            
            const expandedSchedules = [];
            doctorSchedules.forEach(schedule => {
                const start = moment(schedule.startTime);
                const end = moment(schedule.endTime);

                for (let m = start.clone(); m.isSameOrBefore(end, 'day'); m.add(1, 'day')) {
                    expandedSchedules.push({
                        ...schedule,
                        id: `${schedule.id}-${m.format('YYYY-MM-DD')}`,
                        startTime: m.clone().set({
                            hour: start.hour(),
                            minute: start.minute(),
                        }).toDate(),
                        endTime: m.clone().set({
                            hour: end.hour(),
                            minute: end.minute(),
                        }).toDate(),
                    });
                }
            });

            setAllSchedules(expandedSchedules);
        } else {
            setAllSchedules([]);
        }

      } catch (err) {
        setError('Lỗi khi tải lịch làm việc. Vui lòng thử lại.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);
  
  const goToPreviousWeek = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'week'));
  };

  const goToNextWeek = () => {
    setCurrentDate(currentDate.clone().add(1, 'week'));
  };

  const renderWeekView = () => {
    const startOfWeek = currentDate.clone().startOf('isoWeek');
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.clone().add(i, 'days'));
    }

    return (
      <Row gutter={[8, 8]}>
        {days.map(day => {
          const daySchedules = allSchedules
            .filter(s => moment(s.startTime).isSame(day, 'day'))
            .sort((a, b) => moment(a.startTime).diff(moment(b.startTime)));

          return (
            <Col key={day.format('YYYY-MM-DD')} xs={24} sm={12} md={8} lg={3}>
              <Card 
                title={day.format('dddd, DD/MM')}
                styles={{ 
                  header: { backgroundColor: '#f0f2f5', textTransform: 'capitalize' },
                  body: { minHeight: 200, padding: '12px' }
                }}
              >
                {daySchedules.length > 0 ? (
                  daySchedules.map(schedule => (
                    <Card key={schedule.id} size="small" style={{ marginBottom: 8, backgroundColor: schedule.isAvailable ? '#e6f7ff' : '#fff1f0' }}>
                      <Text strong>{moment(schedule.startTime).format('HH:mm')} - {moment(schedule.endTime).format('HH:mm')}</Text>
                      <br />
                      <Text>{schedule.isAvailable ? 'Sẵn sàng' : 'Bận'}</Text>
                      {schedule.notes && <><br /><Text type="secondary">Ghi chú: {schedule.notes}</Text></>}
                    </Card>
                  ))
                ) : (
                  <Text type="secondary">Không có lịch</Text>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  const startOfWeek = currentDate.clone().startOf('isoWeek').format('DD/MM');
  const endOfWeek = currentDate.clone().endOf('isoWeek').format('DD/MM/YYYY');


  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
            <Title level={4}>Lịch làm việc của tôi</Title>
            <Text>Tuần: {startOfWeek} - {endOfWeek}</Text>
        </Col>
        <Col>
          <Button icon={<LeftOutlined />} onClick={goToPreviousWeek} style={{ marginRight: 8 }}>Tuần trước</Button>
          <Button icon={<RightOutlined />} onClick={goToNextWeek}>Tuần sau</Button>
        </Col>
      </Row>
      
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Spin spinning={loading}>
        {renderWeekView()}
      </Spin>
    </div>
  );
};

export default DoctorSchedule; 