import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaCalendarAlt, FaEdit, FaSave, FaTimes, FaIdCard,
  FaVenusMars, FaUserFriends 
} from 'react-icons/fa';
import { authService } from "../../services/authService";
import { motion } from 'framer-motion';

export default function PatientProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState(null);
  const [editedPatientData, setEditedPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }

        // Lấy thông tin User
        const userResponse = await fetch(`http://localhost:5275/api/User/get-by-id?userId=${currentUser.userId}`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        
        const userData = await userResponse.json();
        setUserData(userData);
        setEditedUserData(userData);

        // Lấy thông tin Patient
        try {
          const patientResponse = await fetch(`http://localhost:5275/api/Patient/get-by-id?patientId=${currentUser.userId}`, {
            headers: {
              'Authorization': `Bearer ${currentUser.token}`,
              'Content-Type': 'application/json'
            }
          });

          if (patientResponse.ok) {
            const patientData = await patientResponse.json();
            setPatientData(patientData);
            setEditedPatientData(patientData);
          }
        } catch (patientError) {
          console.error('Error fetching patient data:', patientError);
          // Không báo lỗi nếu không lấy được patient data
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditedUserData(userData);
    setEditedPatientData(patientData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      
      // Cập nhật thông tin User
      const userResponse = await fetch(`http://localhost:5275/api/User/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.userId,
          fullName: editedUserData.fullName,
          email: editedUserData.email,
          phoneNumber: editedUserData.phoneNumber
        })
      });

      if (!userResponse.ok) throw new Error('Failed to update user profile');
      
      const updatedUserData = await userResponse.json();
      setUserData(updatedUserData);

      // Cập nhật thông tin Patient nếu có
      if (patientData && editedPatientData) {
        const patientResponse = await fetch(`http://localhost:5275/api/Patient/patient-update-profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: currentUser.userId,
            fullName: editedPatientData.fullName,
            dateOfBirth: editedPatientData.dateOfBirth,
            gender: editedPatientData.gender,
            address: editedPatientData.address,
            contactPersonName: editedPatientData.contactPersonName,
            contactPersonPhone: editedPatientData.contactPersonPhone
          })
        });

        if (patientResponse.ok) {
          const updatedPatientData = await patientResponse.json();
          setPatientData(updatedPatientData);
        }
      }
      
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatientData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3B9AB8]/10 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-4 border-[#3B9AB8] border-t-transparent"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3B9AB8]/10 to-white">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#3B9AB8] text-white rounded-lg hover:bg-[#2d7a94] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B9AB8]/10 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Gradient Background */}
          <div className="bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-white"
              >
                {userData.profilePictureURL ? (
                  <img 
                    src={userData.profilePictureURL} 
                    alt={patientData?.fullName || userData.fullName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-[#3B9AB8] text-5xl" />
                )}
              </motion.div>

              {/* User Info */}
              <div className="text-white text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  {patientData?.fullName || userData.fullName}
                </h1>
                <p className="text-white/90 mb-3">{userData.email}</p>
                
                <div className="flex justify-center md:justify-start gap-4">
                  {!isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEdit}
                      className="flex items-center px-5 py-2 bg-white text-[#3B9AB8] rounded-full hover:bg-gray-100 transition-all shadow-md"
                    >
                      <FaEdit className="mr-2" />
                      Chỉnh sửa
                    </motion.button>
                  ) : (
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="flex items-center px-5 py-2 bg-white text-green-600 rounded-full hover:bg-green-50 transition-all shadow-md"
                      >
                        <FaSave className="mr-2" />
                        Lưu
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancel}
                        className="flex items-center px-5 py-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-all shadow-md"
                      >
                        <FaTimes className="mr-2" />
                        Hủy
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaIdCard className="text-[#3B9AB8]" />
                  Thông tin cá nhân
                </h2>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaUser />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Họ và tên</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={editedPatientData?.fullName || editedUserData.fullName}
                          onChange={patientData ? handlePatientInputChange : handleUserInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{patientData?.fullName || userData.fullName}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaEnvelope />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editedUserData.email}
                          onChange={handleUserInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{userData.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaCalendarAlt />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Ngày sinh</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editedPatientData?.dateOfBirth ? new Date(editedPatientData.dateOfBirth).toISOString().split('T')[0] : ''}
                          onChange={handlePatientInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {patientData?.dateOfBirth ? new Date(patientData.dateOfBirth).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Chưa cập nhật'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaVenusMars />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Giới tính</label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={editedPatientData?.gender ?? ''}
                          onChange={handlePatientInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value={0}>Nam</option>
                          <option value={1}>Nữ</option>
                          <option value={2}>Khác</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {patientData?.gender === 0 ? 'Nam' : 
                           patientData?.gender === 1 ? 'Nữ' : 
                           patientData?.gender === 2 ? 'Khác' : 'Chưa xác định'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaPhone className="text-[#3B9AB8]" />
                  Thông tin liên hệ
                </h2>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaPhone />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editedUserData.phoneNumber}
                          onChange={handleUserInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{userData.phoneNumber}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Địa chỉ</label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={editedPatientData?.address || ''}
                          onChange={handlePatientInputChange}
                          rows="3"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all resize-none"
                          placeholder="Nhập địa chỉ của bạn"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium whitespace-pre-wrap">{patientData?.address || 'Chưa cập nhật'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaUserFriends />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Người liên hệ khẩn cấp</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="contactPersonName"
                          value={editedPatientData?.contactPersonName || ''}
                          onChange={handlePatientInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all"
                          placeholder="Tên người liên hệ"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{patientData?.contactPersonName || 'Chưa cập nhật'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaPhone />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">SĐT người liên hệ</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="contactPersonPhone"
                          value={editedPatientData?.contactPersonPhone || ''}
                          onChange={handlePatientInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all"
                          placeholder="SĐT người liên hệ"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{patientData?.contactPersonPhone || 'Chưa cập nhật'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}