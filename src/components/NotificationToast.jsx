import React, { useEffect, useState } from 'react';
import { FaBell, FaPills, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { useNotification } from '../contexts/NotificationContext';

const NotificationToast = () => {
  const { notifications } = useNotification();
  const [visibleToasts, setVisibleToasts] = useState([]);

  useEffect(() => {
    // Chỉ hiển thị notifications mới (chưa đọc)
    const newNotifications = notifications
      .filter(n => !n.isRead)
      .slice(0, 3); // Chỉ hiển thị 3 toast cùng lúc

    setVisibleToasts(newNotifications);

    // Auto hide after 5 seconds
    const timer = setTimeout(() => {
      setVisibleToasts([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'medication': return <FaPills />;
      case 'appointment': return <FaCalendarAlt />;
      default: return <FaBell />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'medication': return 'border-blue-500 bg-blue-50';
      case 'appointment': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  if (visibleToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleToasts.map((toast, index) => (
        <div 
          key={toast.id}
          className={`max-w-sm w-full border-l-4 p-4 rounded-lg shadow-lg ${getColor(toast.type)} 
                     transform transition-all duration-300 ease-in-out
                     ${index === 0 ? 'animate-slide-in-right' : ''}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                {getIcon(toast.type)}
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                {toast.title}
              </h4>
              <p className="text-sm text-gray-700 mt-1">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setVisibleToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
