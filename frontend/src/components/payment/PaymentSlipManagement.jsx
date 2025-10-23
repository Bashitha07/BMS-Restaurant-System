import React, { useState, useEffect } from 'react';
import paymentService from '../../services/paymentService';
import adminService from '../../services/adminService';

const PaymentSlipManagement = () => {
  const [paymentSlips, setPaymentSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    fetchPaymentSlips();
    fetchStatistics();
  }, [filters]);

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
        filteredData = filteredData.filter(slip => slip.status === filters.status);
      }
      if (filters.orderNumber) {
        filteredData = filteredData.filter(slip => 
          slip.orderNumber?.toLowerCase().includes(filters.orderNumber.toLowerCase())
        );
      }
      if (filters.customerName) {
        filteredData = filteredData.filter(slip => 
          slip.customerName?.toLowerCase().includes(filters.customerName.toLowerCase())
        );
      }

      setPaymentSlips(filteredData);
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
      fetchPaymentSlips();
      fetchStatistics();
    } catch (err) {
      setError('Failed to upload payment slip');
    }
  };

  const handleStatusUpdate = async (slipId, newStatus, rejectionReason = '') => {
    try {
      await adminService.updatePaymentSlipStatus(slipId, newStatus, rejectionReason);
      fetchPaymentSlips();
      fetchStatistics();
    } catch (err) {
      setError('Failed to update payment slip status');
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedSlips.length === 0) {
      setError('Please select payment slips to update');
      return;
    }
    
    try {
      await adminService.bulkUpdatePaymentSlipStatus(selectedSlips, status);
      setSelectedSlips([]);
      fetchPaymentSlips();
      fetchStatistics();
    } catch (err) {
      setError('Failed to bulk update payment slips');
    }
  };

  const handleDownload = async (slipId, fileName) => {
    try {
      const blob = await paymentService.downloadPaymentSlip(slipId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
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
      VERIFIED: 'bg-green-100 text-green-800',
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
        <h1 className="text-3xl font-bold text-orange-500">
          {userRole === 'ADMIN' ? 'Payment Slip Management' : 'My Payment Slips'}
        </h1>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow border border-orange-300"
        >
          Upload Payment Slip
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
    <div className="bg-white overflow-hidden shadow rounded-lg border border-orange-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center border border-orange-300">
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
                <div className="w-8 h-8 bg-orange-400 rounded-md flex items-center justify-center border border-orange-300">
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
                <div className="w-8 h-8 bg-orange-300 rounded-md flex items-center justify-center border border-orange-300">
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
                <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center border border-orange-300">
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
  <div className="bg-white p-6 rounded-lg shadow border border-orange-200">
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
  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedSlips.length} payment slip(s) selected
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate('VERIFIED')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold border border-orange-300"
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
                className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold border border-orange-300"
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
  <div className="bg-white shadow overflow-hidden sm:rounded-md border border-orange-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-orange-500">Payment Slips</h3>
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
                  Payment Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentSlips.map((slip) => {
                const { date, time } = formatDateTime(slip.paymentDateTime);
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
                        <div className="text-sm font-medium text-gray-900">Order #{slip.orderNumber}</div>
                        <div className="text-sm text-gray-500">{slip.customerName}</div>
                        <div className="text-sm text-gray-500">Transaction: {slip.transactionId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{slip.paymentMethod?.replace('_', ' ')}</div>
                        <div className="text-sm text-gray-500">{date}</div>
                        <div className="text-sm text-gray-500">{time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      LKR {slip.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slip.status)}`}>
                        {slip.status?.replace('_', ' ')}
                      </span>
                      {slip.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1">{slip.rejectionReason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(slip.id, slip.fileName)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Download
                        </button>
                        {userRole === 'ADMIN' && slip.status === 'PENDING_VERIFICATION' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(slip.id, 'VERIFIED')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Please enter rejection reason:');
                                if (reason) handleStatusUpdate(slip.id, 'REJECTED', reason);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(userRole === 'ADMIN' || slip.status === 'PENDING_VERIFICATION') && (
                          <button
                            onClick={() => handleDelete(slip.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </div>
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