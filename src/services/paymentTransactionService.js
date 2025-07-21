import { API_BASE_URL, getAuthHeaders } from './config';

export const paymentTransactionService = {
  // Get all payment transactions
  getAllPaymentTransactions: async (fromDate = null, toDate = null) => {
    try {
      // If no dates provided, use a wide date range to get all transactions
      const defaultFromDate = fromDate || new Date('2020-01-01').toISOString();
      const defaultToDate = toDate || new Date().toISOString();
      
      // Backend expects uppercase field names and DateTime format
      const requestBody = {
        FromDate: defaultFromDate,  // Uppercase F
        ToDate: defaultToDate       // Uppercase T  
      };

      console.log('🔄 Payment Transaction API Request:', requestBody);
      console.log('🌐 API URL:', `${API_BASE_URL}/PaymentTransaction/get-payment-transaction`);
      console.log('🔑 Headers:', getAuthHeaders());

      const response = await fetch(`${API_BASE_URL}/PaymentTransaction/get-payment-transaction`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });
      
      console.log('📡 Response Status:', response.status);
      console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error Response Text:', errorText);
        
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: ${errorText || 'Không thể lấy danh sách giao dịch thanh toán'}`);
      }
      
      const responseText = await response.text();
      console.log('📄 Raw Response Text:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Failed to parse JSON:', e);
        throw new Error('Response không phải là JSON hợp lệ');
      }
      
      console.log('✅ Payment Transaction API Response:', result);
      console.log('📊 Data type:', typeof result);
      
      // Backend returns PaymentTransactionStatementResponse with structure:
      // { totalAmount: 0, transactions: [...], fromDate: "...", toDate: "..." }
      let transactions = [];
      
      if (result && Array.isArray(result.transactions)) {
        transactions = result.transactions;
      } else if (result && Array.isArray(result.Transactions)) {
        transactions = result.Transactions;
      } else if (Array.isArray(result)) {
        transactions = result;
      }
      
      // Transform backend DTO to frontend format
      const transformedTransactions = transactions.map((transaction, index) => ({
        id: transaction.Id || transaction.id || index + 1,
        transactionId: transaction.TransactionId || transaction.transactionId || `TXN-${index + 1}`,
        amount: transaction.Amount || transaction.amount || 0,
        paymentMethod: transaction.PaymentMethod || transaction.paymentMethod || 'Unknown',
        paymentStatus: transaction.Status || transaction.status || transaction.PaymentStatus || 'Unknown',
        createdDate: transaction.CreatedDate || transaction.createdDate || new Date().toISOString(),
        paymentDate: transaction.PaymentDate || transaction.paymentDate || transaction.CreatedDate || transaction.createdDate,
        appointmentId: transaction.AppointmentId || transaction.appointmentId,
        description: transaction.Description || transaction.description || transaction.Message || transaction.message,
        notes: transaction.Notes || transaction.notes || transaction.Message || transaction.message,
        patientFullName: transaction.PatientFullName || transaction.patientFullName || 'N/A'
      }));
      
      console.log('📊 Transformed transactions:', transformedTransactions);
      console.log('📊 Transactions count:', transformedTransactions.length);
      
      return transformedTransactions;
    } catch (error) {
      console.error('💥 Error fetching payment transactions:', error);
      console.error('💥 Error stack:', error.stack);
      throw error;
    }
  },

  // Get payment transaction by ID
  getPaymentTransactionById: async (transactionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/PaymentTransaction/get-payment-transaction/${transactionId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy thông tin giao dịch thanh toán');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment transaction:', error);
      throw error;
    }
  },

  // Get payment transactions by status
  getPaymentTransactionsByStatus: async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/PaymentTransaction/get-payment-transaction?status=${status}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy danh sách giao dịch theo trạng thái');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment transactions by status:', error);
      throw error;
    }
  },

  // Get payment transactions by date range
  getPaymentTransactionsByDateRange: async (startDate, endDate) => {
    try {
      const requestBody = {
        fromDate: new Date(startDate).toISOString(),
        toDate: new Date(endDate).toISOString()
      };

      console.log('Payment Transaction by Date Range Request:', requestBody);

      const response = await fetch(`${API_BASE_URL}/PaymentTransaction/get-payment-transaction`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy danh sách giao dịch theo thời gian');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment transactions by date range:', error);
      throw error;
    }
  },

  // Get payment statistics
  getPaymentStatistics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/PaymentTransaction/statistics`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy thống kê giao dịch thanh toán');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      throw error;
    }
  },

  // Test API endpoint - simple ping
  testPaymentAPI: async () => {
    try {
      console.log('🧪 Testing Payment Transaction API endpoints...');
      
      // Test 1: Try with today's date
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      
      const testBody1 = {
        fromDate: yesterday.toISOString(),
        toDate: today.toISOString()
      };
      
      console.log('🧪 Test 1 - Recent dates:', testBody1);
      
      let response = await fetch(`${API_BASE_URL}/PaymentTransaction/get-payment-transaction`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(testBody1)
      });
      
      console.log('📡 Test 1 Response Status:', response.status);
      
      if (response.ok) {
        const result = await response.text();
        console.log('✅ Test 1 Success:', result);
        return JSON.parse(result);
      }
      
      // Test 2: Try with wider date range
      const testBody2 = {
        fromDate: new Date('2024-01-01').toISOString(),
        toDate: new Date().toISOString()
      };
      
      console.log('🧪 Test 2 - Wide date range:', testBody2);
      
      response = await fetch(`${API_BASE_URL}/PaymentTransaction/get-payment-transaction`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(testBody2)
      });
      
      console.log('📡 Test 2 Response Status:', response.status);
      
      if (response.ok) {
        const result = await response.text();
        console.log('✅ Test 2 Success:', result);
        return JSON.parse(result);
      }
      
      // Test 3: Try GET method
      console.log('🧪 Test 3 - GET method');
      response = await fetch(`${API_BASE_URL}/PaymentTransaction`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      console.log('📡 Test 3 Response Status:', response.status);
      
      if (response.ok) {
        const result = await response.text();
        console.log('✅ Test 3 Success:', result);
        return JSON.parse(result);
      }
      
      throw new Error(`All tests failed. Last status: ${response.status}`);
      
    } catch (error) {
      console.error('💥 Payment API Test Error:', error);
      throw error;
    }
  }
};
