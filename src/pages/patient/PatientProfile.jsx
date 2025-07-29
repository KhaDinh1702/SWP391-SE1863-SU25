import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaCalendarAlt, FaEdit, FaSave, FaTimes, FaIdCard,
  FaVenusMars, FaUserFriends, FaCamera 
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
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Thêm key để force refresh UI
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }

        // Lấy thông tin User
        const userResponse = await fetch(`https://localhost:7040/api/User/get-by-id?userId=${currentUser.userId}`, {
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
          const patientResponse = await fetch(`https://localhost:7040/api/Patient/get-by-id?patientId=${currentUser.userId}`, {
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

  // Debug effect để theo dõi thay đổi của patientData
  useEffect(() => {
    console.log('PatientData changed:', patientData);
    if (patientData) {
      console.log('PatientData details:', {
        fullName: patientData.fullName,
        dateOfBirth: patientData.dateOfBirth,
        gender: patientData.gender,
        address: patientData.address
      });
    }
  }, [patientData]);

  const handleEdit = () => {
    if (!patientData?.id) {
      setError('Không tìm thấy thông tin bệnh nhân. Vui lòng tải lại trang.');
      return;
    }
    setIsEditing(true);
    setError(null);
  };
  
  const handleCancel = () => {
    setEditedUserData(userData);
    setEditedPatientData(patientData);
    setIsEditing(false);
    setError(null);
    setSelectedAvatar(null);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh hợp lệ');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      
      setSelectedAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const currentUser = authService.getCurrentUser();
      
      // Tạm thời chỉ cập nhật thông tin Patient (vì User update-profile endpoint chưa có)
      // TODO: Thêm User profile update khi backend có endpoint
      
      // Cập nhật thông tin Patient nếu có
      if (patientData && editedPatientData) {
        // Validation trước khi gửi
        if (!editedPatientData.fullName?.trim()) {
          throw new Error('Họ tên không được để trống');
        }
        if (!editedPatientData.dateOfBirth) {
          throw new Error('Ngày sinh không được để trống');
        }
        if (editedPatientData.gender === undefined || editedPatientData.gender === '') {
          throw new Error('Vui lòng chọn giới tính');
        }

        // Kiểm tra có patientData.id không (đây là PatientId thực sự)
        if (!patientData?.id) {
          throw new Error('Không tìm thấy thông tin Patient ID. Vui lòng tải lại trang.');
        }

        const formData = new FormData();
        formData.append('patientId', patientData.id);
        formData.append('fullName', editedPatientData.fullName.trim());
        formData.append('dateOfBirth', editedPatientData.dateOfBirth);
        formData.append('gender', editedPatientData.gender.toString());
        formData.append('address', editedPatientData.address || '');
        formData.append('contactPersonName', editedPatientData.contactPersonName || '');
        formData.append('contactPersonPhone', editedPatientData.contactPersonPhone || '');
        
        // Add avatar file if selected
        if (selectedAvatar) {
          formData.append('avatarPicture', selectedAvatar);
        }

        // Debug logging
        console.log('=== PATIENT UPDATE DEBUG ===');
        console.log('Current User:', currentUser);
        console.log('Patient Data:', patientData);
        console.log('Patient ID (actual):', patientData?.id);
        console.log('User ID:', currentUser?.userId);
        console.log('Edited Patient Data:', editedPatientData);
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        console.log('=== END DEBUG ===');

        const patientResponse = await fetch(`https://localhost:7040/api/Patient/patient-update-profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          },
          body: formData
        });

        console.log('Response status:', patientResponse.status);
        
        if (patientResponse.ok) {
          const updatedPatientData = await patientResponse.json();
          console.log('Updated patient data:', updatedPatientData);
          
          // Force tạo object mới để trigger re-render
          const newPatientData = { ...updatedPatientData };
          const newEditedPatientData = { ...updatedPatientData };
          
          // Cập nhật cả patientData và editedPatientData để đồng bộ
          setPatientData(newPatientData);
          setEditedPatientData(newEditedPatientData);
          
          // Debug: Log để kiểm tra dữ liệu đã được cập nhật
          console.log('Data after update:');
          console.log('New patientData:', newPatientData);
          console.log('New editedPatientData:', newEditedPatientData);
          
          // Cập nhật edited user data để đồng bộ avatar và thông tin khác
          const updatedUserData = {
            ...userData,
            fullName: updatedPatientData.fullName,
            phoneNumber: editedUserData?.phoneNumber || userData?.phoneNumber,
            // Cập nhật avatar nếu có trong response
            profilePictureURL: updatedPatientData.profilePictureURL || updatedPatientData.avatar || userData.profilePictureURL,
            avatar: updatedPatientData.profilePictureURL || updatedPatientData.avatar || userData.avatar
          };
          
          setUserData(updatedUserData);
          setEditedUserData(updatedUserData);
          
          // Hiển thị thông báo thành công đơn giản và điều hướng về trang chủ
          alert('Cập nhật hồ sơ thành công!');
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('profileUpdated'));
          
          // Reset editing state và avatar state
          setIsEditing(false);
          setSelectedAvatar(null);
          setAvatarPreview(null);
          
          // Điều hướng về trang chủ
          navigate('/');
        } else {
          const errorText = await patientResponse.text();
          console.error('Error response:', errorText);
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { message: errorText };
          }
          throw new Error(errorData.message || `Server error: ${patientResponse.status}`);
        }
      } else {
        throw new Error('Không tìm thấy thông tin bệnh nhân để cập nhật');
      }
    } catch (err) {
      setError(`Lỗi khi cập nhật hồ sơ: ${err.message}`);
      
      // Auto clear error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setSaving(false);
    }
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
        key={refreshKey} // Thêm key để force re-render
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
                {(() => {
                  if (avatarPreview) {
                    return (
                      <img 
                        src={avatarPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    );
                  }
                  
                  if (userData.profilePictureURL || userData.avatar) {
                    return (
                      <img 
                        src={userData.profilePictureURL || userData.avatar} 
                        alt={patientData?.fullName || userData.fullName} 
                        className="w-full h-full object-cover"
                      />
                    );
                  }
                  
                  return <FaUser className="text-[#3B9AB8] text-5xl" />;
                })()}
                
                {/* Camera overlay for editing */}
                {isEditing && (
                  <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <FaCamera className="text-white text-2xl" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </motion.div>

              {/* User Info */}
              <div className="text-white text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  {patientData?.fullName || userData.fullName}
                </h1>
                <p className="text-white/90 mb-3">{userData.email}</p>
                
                <div className="flex justify-center md:justify-start gap-4">
                  {!isEditing && patientData?.id && (
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 154, 184, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEdit}
                      className="group flex items-center px-6 py-3 bg-white text-[#3B9AB8] rounded-xl hover:bg-gradient-to-r hover:from-white hover:to-blue-50 transition-all duration-300 shadow-lg border border-white/20 backdrop-blur-sm"
                    >
                      <FaEdit className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="font-semibold">Chỉnh sửa hồ sơ</span>
                    </motion.button>
                  )}
                  {isEditing && (
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: saving ? 1 : 1.05, boxShadow: saving ? "none" : "0 8px 20px rgba(34, 197, 94, 0.3)" }}
                        whileTap={{ scale: saving ? 1 : 0.95 }}
                        onClick={handleSave}
                        disabled={saving}
                        className={`group flex items-center px-6 py-3 rounded-xl transition-all duration-300 shadow-lg ${
                          saving 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        }`}
                      >
                        {saving ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                            />
                            <span className="font-semibold">Đang lưu...</span>
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-semibold">Lưu thay đổi</span>
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(107, 114, 128, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancel}
                        className="group flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg"
                      >
                        <FaTimes className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-semibold">Hủy bỏ</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 md:p-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center gap-2"
              >
                <FaTimes className="text-red-600" />
                <span>{error}</span>
              </motion.div>
            )}

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
                          value={editedPatientData?.fullName || ''}
                          onChange={handlePatientInputChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B9AB8] focus:ring-4 focus:ring-[#3B9AB8]/20 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30"
                          placeholder="Nhập họ và tên"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{patientData?.fullName || userData?.fullName || 'Chưa cập nhật'}</p>
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
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B9AB8] focus:ring-4 focus:ring-[#3B9AB8]/20 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30"
                          required
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
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B9AB8] focus:ring-4 focus:ring-[#3B9AB8]/20 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30"
                          required
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
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B9AB8] focus:ring-4 focus:ring-[#3B9AB8]/20 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 resize-none"
                          placeholder="Nhập địa chỉ của bạn"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium whitespace-pre-wrap">{patientData?.address || 'Chưa cập nhật'}</p>
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
                      <FaEnvelope />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-gray-900 font-medium">{userData?.email || 'Chưa cập nhật'}</p>
                      <p className="text-xs text-gray-500 mt-1">* Email không thể thay đổi</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaPhone />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
                      <p className="text-gray-900 font-medium">{userData?.phoneNumber || 'Chưa cập nhật'}</p>
                      <p className="text-xs text-gray-500 mt-1">* Số điện thoại không thể thay đổi</p>
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
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B9AB8] focus:ring-4 focus:ring-[#3B9AB8]/20 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30"
                          placeholder="Tên người liên hệ khẩn cấp"
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
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B9AB8] focus:ring-4 focus:ring-[#3B9AB8]/20 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30"
                          placeholder="Số điện thoại người liên hệ"
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