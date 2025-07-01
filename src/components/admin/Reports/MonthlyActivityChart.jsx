import React from 'react';
import { Card } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const MonthlyActivityChart = ({ userStats, appointmentStats, patientStats }) => {
  const getMonthlyData = () => {
    const months = {};
    
    // Combine all monthly data
    [
      { data: userStats.byMonth || {}, key: 'users' },
      { data: appointmentStats.byMonth || {}, key: 'appointments' },
      { data: patientStats.byMonth || {}, key: 'patients' }
    ].forEach(({ data, key }) => {
      Object.entries(data).forEach(([month, count]) => {
        if (!months[month]) {
          months[month] = { month, users: 0, appointments: 0, patients: 0 };
        }
        months[month][key] = count;
      });
    });

    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Show last 12 months
  };

  const monthlyData = getMonthlyData();

  return (
    <Card title="Hoạt động theo tháng" className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, 
              name === 'users' ? 'Người dùng' : 
              name === 'appointments' ? 'Cuộc hẹn' : 'Bệnh nhân'
            ]}
            labelFormatter={(label) => `Tháng: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="users" 
            stackId="1" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.6}
            name="users"
          />
          <Area 
            type="monotone" 
            dataKey="appointments" 
            stackId="1" 
            stroke="#82ca9d" 
            fill="#82ca9d" 
            fillOpacity={0.6}
            name="appointments"
          />
          <Area 
            type="monotone" 
            dataKey="patients" 
            stackId="1" 
            stroke="#ffc658" 
            fill="#ffc658" 
            fillOpacity={0.6}
            name="patients"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MonthlyActivityChart;
