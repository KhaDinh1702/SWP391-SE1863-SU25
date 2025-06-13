import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaCalendarAlt, FaEdit, FaSave, FaTimes, FaIdCard 
} from 'react-icons/fa';
import { authService } from "../../services/authService";
import { motion } from 'framer-motion';

export default function PatientProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
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

        const response = await fetch(`http://localhost:5275/api/User/get-by-id?userId=${currentUser.userId}`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        setUserData(data);
        setEditedData(data);
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
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      const response = await fetch(`http://localhost:5275/api/User/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.userId,
          fullName: editedData.fullName,
          email: editedData.email,
          phoneNumber: editedData.phoneNumber,
          address: editedData.address || '',
          dateOfBirth: editedData.dateOfBirth || null
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
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
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.fullName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-[#3B9AB8] text-5xl" />
                )}
              </motion.div>

              {/* User Info */}
              <div className="text-white text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{userData.fullName}</h1>
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
                      Edit Profile
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
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancel}
                        className="flex items-center px-5 py-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-all shadow-md"
                      >
                        <FaTimes className="mr-2" />
                        Cancel
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
                  Personal Information
                </h2>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaUser />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={editedData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{userData.fullName}</p>
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
                          value={editedData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{userData.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaPhone className="text-[#3B9AB8]" />
                  Contact Details
                </h2>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaPhone />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editedData.phoneNumber}
                          onChange={handleInputChange}
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
                      <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={editedData.address || ''}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all resize-none"
                          placeholder="Enter your address"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium whitespace-pre-wrap">{userData.address || 'No address provided'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#3B9AB8]">
                      <FaCalendarAlt />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editedData.dateOfBirth || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#3B9AB8] focus:ring-2 focus:ring-[#3B9AB8]/30 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not provided'}
                        </p>
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