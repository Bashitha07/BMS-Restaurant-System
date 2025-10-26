import React, { useState, useEffect } from 'react';
import paymentService from '../../services/paymentService';
import adminService from '../../services/adminService';

const PaymentSlipManagement = () => {
  const [paymentSlips, setPaymentSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedSlips, setSelectedSlips] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [userRole, setUserRole] = useState('');
  const [filters, setFilters] = useState({
    status: 'ALL',
    dateRange: 'THIS_WEEK',
    orderNumber: '',
    customerName: ''
  });

  const [uploadForm, setUploadForm] = useState({
    orderId: '',
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    transactionId: '',
    paymentDate: '',
    paymentTime: '',
    description: '',
    file: null,
    fileName: ''
  });

  const statusOptions = ['PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'PROCESSING'];
  const paymentMethods = ['BANK_TRANSFER', 'CARD_PAYMENT', 'DIGITAL_WALLET', 'CASH', 'CHEQUE'];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchPaymentSlips();
      fetchStatistics();
    }
  }, [filters, userRole]);

  const fetchPaymentSlips = async () => {
    try {
      setLoading(true);
      let data;
      
      if (userRole === 'ADMIN') {
        data = await adminService.getAllPaymentSlips();
      } else {
        data = await paymentService.getUserPaymentSlips();
      }

      // Apply filters
      let filteredData = data;
      if (filters.status !== 'ALL') {
        filteredData = filteredData.filter(slip => {
          // Map frontend filter values to backend status values
          if (filters.status === 'PENDING_VERIFICATION') {
            return slip.status === 'PENDING' || slip.status === 'PENDING_VERIFICATION';
          }
          if (filters.status === 'VERIFIED') {
            return slip.status === 'CONFIRMED' || slip.status === 'VERIFIED';
          }
          return slip.status === filters.status;
        });
      }
      if (filters.orderNumber) {
        filteredData = filteredData.filter(slip => 
          slip.orderId?.toString().includes(filters.orderNumber)
        );
      }
      if (filters.customerName) {
        filteredData = filteredData.filter(slip => 
          slip.userName?.toLowerCase().includes(filters.customerName.toLowerCase())
        );
      }

      setPaymentSlips(filteredData);
      
      // Calculate statistics from the actual data
      const stats = {
        totalPaymentSlips: data.length,
        pendingSlips: data.filter(s => s.status === 'PENDING' || s.status === 'PENDING_VERIFICATION').length,
        verifiedSlips: data.filter(s => s.status === 'CONFIRMED' || s.status === 'VERIFIED').length,
        rejectedSlips: data.filter(s => s.status === 'REJECTED').length
      };
      setStatistics(stats);
    } catch (err) {
      setError('Failed to fetch payment slips');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await adminService.getPaymentStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, and PDF files are allowed');
        return;
      }

      setUploadForm({
        ...uploadForm,
        file: file,
        fileName: file.name
      });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('orderId', uploadForm.orderId);
      formData.append('amount', uploadForm.amount);
      formData.append('paymentMethod', uploadForm.paymentMethod);
      formData.append('transactionId', uploadForm.transactionId);
      formData.append('paymentDateTime', `${uploadForm.paymentDate}T${uploadForm.paymentTime}`);
      formData.append('description', uploadForm.description);

      await paymentService.uploadPaymentSlip(formData);
      resetUploadForm();
      setShowUploadForm(false);
      setError('');
      setSuccessMessage('Payment slip uploaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh the list
      await fetchPaymentSlips();
      await fetchStatistics();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload payment slip: ' + (err.response?.data?.message || err.message));
      setSuccessMessage('');
    }
  };

  const handleStatusUpdate = async (slipId, newStatus, rejectionReason = '') => {
    try {
      console.log('🔄 [STATUS UPDATE] Starting update:', { slipId, newStatus, rejectionReason });
      console.log('🔄 [STATUS UPDATE] Calling adminService.updatePaymentSlipStatus...');
      const result = await adminService.updatePaymentSlipStatus(slipId, newStatus, rejectionReason);
      console.log('✅ [STATUS UPDATE] Update successful!', result);
      setSuccessMessage('Status updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchPaymentSlips();
      fetchStatistics();
    } catch (err) {
      console.error('❌ [STATUS UPDATE] Failed to update payment slip status:', err);
      console.error('❌ [STATUS UPDATE] Error details:', {
        message: err.message,
        response: err.response,
        fullError: err
      });
      setError('Failed to update payment slip status: ' + (err.message || err));
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedSlips.length === 0) {
      setError('Please select payment slips to update');
      return;
    }
    
    // Get the selected slip objects to check their current status
    const selectedSlipObjects = paymentSlips.filter(slip => selectedSlips.includes(slip.id));
    
    // Validate status transitions
    if (status === 'REJECTED') {
      // Only PENDING or PROCESSING slips can be rejected
      const invalidSlips = selectedSlipObjects.filter(slip => 
        slip.status !== 'PENDING' && slip.status !== 'PROCESSING'
      );
      if (invalidSlips.length > 0) {
        setError(`Cannot reject ${invalidSlips.length} slip(s) that are already ${invalidSlips[0].status}. Only PENDING or PROCESSING slips can be rejected.`);
        return;
      }
    } else if (status === 'VERIFIED' || status === 'CONFIRMED') {
      // Only PENDING or PROCESSING slips can be confirmed
      const invalidSlips = selectedSlipObjects.filter(slip => 
        slip.status !== 'PENDING' && slip.status !== 'PROCESSING'
      );
      if (invalidSlips.length > 0) {
        setError(`Cannot confirm ${invalidSlips.length} slip(s) that are already ${invalidSlips[0].status}. Only PENDING or PROCESSING slips can be confirmed.`);
        return;
      }
    }
    
    try {
      await adminService.bulkUpdatePaymentSlipStatus(selectedSlips, status);
      setSelectedSlips([]);
      fetchPaymentSlips();
      fetchStatistics();
    } catch (err) {
      setError('Failed to bulk update payment slips: ' + (err.message || err));
    }
  };

  const handleDownload = async (slip) => {
    try {
      if (slip.filePath) {
        // Open image in new tab for viewing/downloading
        const imageUrl = `http://localhost:8084${slip.filePath}`;
        window.open(imageUrl, '_blank');
      } else {
        setError('Payment slip file path not found');
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download payment slip');
    }
  };

  const handleDelete = async (slipId) => {
    if (window.confirm('Are you sure you want to delete this payment slip?')) {
      try {
        await paymentService.deletePaymentSlip(slipId);
        fetchPaymentSlips();
        fetchStatistics();
      } catch (err) {
        setError('Failed to delete payment slip');
      }
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      orderId: '',
      amount: '',
      paymentMethod: 'BANK_TRANSFER',
      transactionId: '',
      paymentDate: '',
      paymentTime: '',
      description: '',
      file: null,
      fileName: ''
    });
    setShowUploadForm(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      VERIFIED: 'bg-green-100 text-green-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      PROCESSING: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {userRole === 'ADMIN' ? 'Payment Slip Management' : 'My Payment Slips'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchPaymentSlips();
              fetchStatistics();
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
          <button
            onClick={() => setSuccessMessage('')}
            className="absolute top-0 right-0 px-4 py-3 text-green-700 hover:text-green-900"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}
          {error}
          <button
            onClick={() => setError('')}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📄</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Slips</dt>
                  <dd className="text-lg font-medium text-gray-900">{statistics.totalPaymentSlips || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">{statistics.pendingSlips || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Verified</dt>
                  <dd className="text-lg font-medium text-gray-900">{statistics.verifiedSlips || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">❌</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                  <dd className="text-lg font-medium text-gray-900">{statistics.rejectedSlips || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="ALL">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Order Number</label>
            <input
              type="text"
              value={filters.orderNumber}
              onChange={(e) => setFilters({...filters, orderNumber: e.target.value})}
              placeholder="Search by order number..."
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          {userRole === 'ADMIN' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input
                type="text"
                value={filters.customerName}
                onChange={(e) => setFilters({...filters, customerName: e.target.value})}
                placeholder="Search by customer name..."
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions - Admin Only */}
      {userRole === 'ADMIN' && selectedSlips.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedSlips.length} payment slip(s) selected
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate('VERIFIED')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                Verify
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('REJECTED')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Reject
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('PROCESSING')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Mark Processing
              </button>
              <button
                onClick={() => setSelectedSlips([])}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Slips Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Slips</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {userRole === 'ADMIN' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSlips(paymentSlips.map(slip => slip.id));
                        } else {
                          setSelectedSlips([]);
                        }
                      }}
                      checked={selectedSlips.length === paymentSlips.length && paymentSlips.length > 0}
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentSlips.map((slip) => {
                const { date, time } = formatDateTime(slip.uploadedAt);
                return (
                  <tr key={slip.id}>
                    {userRole === 'ADMIN' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSlips.includes(slip.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSlips([...selectedSlips, slip.id]);
                            } else {
                              setSelectedSlips(selectedSlips.filter(id => id !== slip.id));
                            }
                          }}
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Order #{slip.orderId}</div>
                        <div className="text-sm text-gray-500">{slip.userName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">Transaction: {slip.transactionReference}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {slip.filePath ? (
                        <>
                          {console.log('Payment slip image path:', slip.filePath)}
                          <img 
                            src={`http://localhost:8084${slip.filePath}`}
                            alt="Payment Slip"
                            className="h-20 w-20 object-cover rounded cursor-pointer hover:opacity-80"
                            onClick={() => window.open(`http://localhost:8084${slip.filePath}`, '_blank')}
                            onError={(e) => {
                              console.error('Failed to load image:', `http://localhost:8084${slip.filePath}`);
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </>
                      ) : (
                        <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{slip.bankName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{date}</div>
                        <div className="text-sm text-gray-500">{time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      LKR {slip.paymentAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {userRole === 'ADMIN' ? (
                        <div className="flex flex-col gap-1">
                          <select
                            value={slip.status || 'PENDING'}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              if (newStatus === 'REJECTED') {
                                const reason = prompt('Please enter rejection reason:');
                                if (reason) {
                                  handleStatusUpdate(slip.id, newStatus, reason);
                                } else {
                                  // Reset select if user cancels
                                  e.target.value = slip.status;
                                }
                              } else {
                                handleStatusUpdate(slip.id, newStatus);
                              }
                            }}
                            className={`w-full px-3 py-2 rounded-md text-sm font-medium border-2 cursor-pointer transition-all ${
                              slip.status === 'CONFIRMED' ? 'bg-green-50 border-green-300 text-green-800 hover:bg-green-100' :
                              slip.status === 'REJECTED' ? 'bg-red-50 border-red-300 text-red-800 hover:bg-red-100' :
                              slip.status === 'PROCESSING' ? 'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100' :
                              'bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100'
                            }`}
                          >
                            <option value="PENDING">⏳ Pending</option>
                            <option value="PROCESSING">🔄 Processing</option>
                            <option value="CONFIRMED">✅ Confirmed</option>
                            <option value="REJECTED">❌ Rejected</option>
                          </select>
                          {slip.rejectionReason && (
                            <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                              <span className="font-semibold">Reason:</span> {slip.rejectionReason}
                            </div>
                          )}
                          {slip.confirmedBy && slip.confirmedAt && (
                            <div className="text-xs text-green-700 bg-green-50 p-1 rounded">
                              ✓ By {slip.confirmedBy} on {new Date(slip.confirmedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block px-3 py-2 rounded-md text-sm font-medium ${
                            slip.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            slip.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            slip.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {slip.status === 'CONFIRMED' ? '✅ Confirmed' :
                             slip.status === 'REJECTED' ? '❌ Rejected' :
                             slip.status === 'PROCESSING' ? '🔄 Processing' :
                             '⏳ Pending'}
                          </span>
                          {slip.rejectionReason && (
                            <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                              <span className="font-semibold">Reason:</span> {slip.rejectionReason}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Payment Slip</h3>
              <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order ID *</label>
                  <input
                    type="text"
                    value={uploadForm.orderId}
                    onChange={(e) => setUploadForm({...uploadForm, orderId: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (LKR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={uploadForm.amount}
                    onChange={(e) => setUploadForm({...uploadForm, amount: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method *</label>
                  <select
                    value={uploadForm.paymentMethod}
                    onChange={(e) => setUploadForm({...uploadForm, paymentMethod: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID *</label>
                  <input
                    type="text"
                    value={uploadForm.transactionId}
                    onChange={(e) => setUploadForm({...uploadForm, transactionId: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Date *</label>
                  <input
                    type="date"
                    value={uploadForm.paymentDate}
                    onChange={(e) => setUploadForm({...uploadForm, paymentDate: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Time *</label>
                  <input
                    type="time"
                    value={uploadForm.paymentTime}
                    onChange={(e) => setUploadForm({...uploadForm, paymentTime: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Payment Slip File *</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: JPG, PNG, PDF (Max size: 5MB)
                  </p>
                  {uploadForm.fileName && (
                    <p className="text-sm text-green-600 mt-1">Selected: {uploadForm.fileName}</p>
                  )}
                </div>

                <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetUploadForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Upload Payment Slip
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSlipManagement;