import { useState, useEffect } from 'react';
import { FaUser, FaChevronDown, FaChevronUp, FaFileAlt, FaFileMedical, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function PatientProfile() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        try {
          const response = await fetch(`http://localhost:5275/api/User/get-by-id?userId=${currentUser.userId}`, {
            headers: {
              'Authorization': `Bearer ${currentUser.token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!userData) return null;

  return (
    <div className="fixed top-30 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out"
           style={{ width: isExpanded ? '300px' : 'auto' }}>
        
        {/* Header - Always visible */}
        <div 
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            {userData.avatar ? (
              <img src={userData.avatar} alt={userData.fullName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <FaUser className="text-blue-600 text-xl" />
            )}
          </div>
          {isExpanded && (
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{userData.fullName}</h3>
              <p className="text-sm text-gray-500">{userData.email}</p>
            </div>
          )}
          {isExpanded ? (
            <FaChevronUp className="text-gray-500" />
          ) : (
            <FaChevronDown className="text-gray-500" />
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-100">
            <div className="p-3 space-y-2">
              <button 
                onClick={() => navigate('/profile')}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                <FaUser className="text-blue-600" />
                <span>Thông tin cá nhân</span>
              </button>
              <button 
                onClick={() => navigate('/appointments')}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                <FaFileAlt className="text-blue-600" />
                <span>Lịch hẹn của tôi</span>
              </button>
              <button 
                onClick={() => navigate('/medical-records')}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                <FaFileMedical className="text-blue-600" />
                <span>Hồ sơ y tế</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
              >
                <FaSignOutAlt className="text-red-600" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 