import { Layout } from 'antd';
const { Header } = Layout;

const StaffHeader = ({ staff }) => {
  return (
    <Header
      style={{
        background: '#fff',
        padding: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px #f0f1f2',
      }}
    >
      <div></div>
      {/* No avatar or dropdown */}
    </Header>
  );
};

export default StaffHeader; 