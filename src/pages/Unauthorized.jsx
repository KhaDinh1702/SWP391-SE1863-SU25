const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Không có quyền truy cập</h1>
      <p className="text-lg text-gray-700">Bạn không được phép truy cập trang này.</p>
    </div>
  );
};

export default Unauthorized;
