import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DepositSlipUploader = ({ orderId, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [bankName, setBankName] = useState('');
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState({});
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Reset errors
    setErrors({});
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrors({ file: 'Invalid file type. Please upload JPG, PNG or PDF file.' });
      return;
    }
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors({ file: 'File is too large. Maximum size is 5MB.' });
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview for image files
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null); // No preview for non-image files
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const formErrors = {};
    if (!file) formErrors.file = 'Please select a file to upload';
    if (!bankName.trim()) formErrors.bankName = 'Bank name is required';
    if (!reference.trim()) formErrors.reference = 'Transaction reference is required';
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setUploading(true);
    
    try {
      // In a real app, this would upload to the backend
      // For now, simulate success in development mode
      if (import.meta.env.DEV) {
        // Create mock success
        setTimeout(() => {
          // Get current user
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const userId = currentUser?.id;
          
          if (!userId) {
            toast.error('User not logged in');
            setUploading(false);
            return;
          }
          
          // Get orders from localStorage
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          
          // Find the order
          const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
              // Create a data URL for the preview image or a placeholder for PDF
              const depositSlip = preview || '/images/pdf-placeholder.png';
              
              return {
                ...order,
                depositSlip,
                depositSlipName: file.name,
                paymentMethod: 'deposit',
                paymentStatus: 'pending',
                bankName,
                transactionReference: reference,
                trackingUpdates: [
                  ...(order.trackingUpdates || []),
                  {
                    status: 'payment_pending',
                    title: 'Deposit Slip Uploaded',
                    description: 'Waiting for admin verification',
                    timestamp: new Date().toISOString(),
                    completed: true
                  }
                ]
              };
            }
            return order;
          });
          
          // Save updated orders
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
          
          toast.success('Deposit slip uploaded successfully!');
          setUploading(false);
          
          // Call the callback
          if (onUploadComplete) {
            onUploadComplete({
              success: true,
              message: 'Deposit slip uploaded successfully'
            });
          }
        }, 1500);
      } else {
        // For production, call the actual API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orderId', orderId);
        formData.append('bankName', bankName);
        formData.append('transactionReference', reference);
        formData.append('paymentAmount', '100.00'); // Should come from the actual order
        formData.append('paymentDate', new Date().toISOString());
        
        const response = await fetch('/api/payment-slips/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload deposit slip');
        }
        
        const data = await response.json();
        
        toast.success('Deposit slip uploaded successfully!');
        setUploading(false);
        
        // Call the callback
        if (onUploadComplete) {
          onUploadComplete({
            success: true,
            message: 'Deposit slip uploaded successfully',
            data
          });
        }
      }
    } catch (error) {
      console.error('Error uploading deposit slip:', error);
      toast.error('Failed to upload deposit slip');
      setUploading(false);
    }
  };
  
  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Deposit Slip</h3>
      
      <form onSubmit={handleSubmit}>
        {/* File upload area */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Slip Image/PDF
          </label>
          
          {!file ? (
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                errors.file ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400">JPG, PNG or PDF (max 5MB)</p>
              
              {errors.file && (
                <p className="mt-2 text-sm text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.file}
                </p>
              )}
            </div>
          ) : (
            <div className="relative border rounded-lg overflow-hidden">
              {preview ? (
                <img 
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-contain"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">PDF File (No Preview)</p>
                </div>
              )}
              <button 
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                onClick={removeFile}
              >
                <X className="w-5 h-5" />
              </button>
              <p className="p-2 text-sm bg-gray-50 border-t">
                {file.name}
              </p>
            </div>
          )}
        </div>
        
        {/* Bank name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name
          </label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bankName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter bank name"
          />
          {errors.bankName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bankName}
            </p>
          )}
        </div>
        
        {/* Transaction reference */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Reference
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.reference ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter transaction reference number"
          />
          {errors.reference && (
            <p className="mt-1 text-sm text-red-600">
              {errors.reference}
            </p>
          )}
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium ${
            uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-r-transparent rounded-full"></div>
              Uploading...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Upload Deposit Slip
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DepositSlipUploader;