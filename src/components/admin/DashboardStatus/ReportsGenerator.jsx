import { Card } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReportsGenerator = ({ data }) => {
  return (
    <Card title="Biểu đồ người dùng theo thời gian" className="shadow-sm">
      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="createdDate" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="id" 
              stroke="#1890ff" 
              fill="#1890ff" 
              fillOpacity={0.2} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ReportsGenerator;
