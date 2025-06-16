import { Layout } from 'antd';

const { Header } = Layout;

const ManagerHeader = ({ manager }) => {
  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px #f0f1f2',
      }}
    >
      <div className="text-lg font-semibold">
        {manager?.fullName || 'Quản lý'}
      </div>
    </Header>
  );
};

export default ManagerHeader; 