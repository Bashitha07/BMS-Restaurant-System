import React, { useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/api';
import { toast } from 'react-hot-toast';
import { CheckCircle2, Loader2, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';

const roleOptions = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingPromo, setEditingPromo] = useState(null);
  const [promoForm, setPromoForm] = useState({
    promoCode: '',
    discountPercent: 0,
    promoExpires: '',
    promoActive: false
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      (u.username || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      String(u.id || '').includes(q)
    );
  }, [users, search]);

  const handleRoleChange = async (userId, newRole) => {
    setSavingId(userId);
    try {
      const updated = await adminService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: updated.role } : u)));
      toast.success('Role updated');
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Failed to update role');
    } finally {
      setSavingId(null);
    }
  };

  const handleEditPromo = (user) => {
    setEditingPromo(user.id);
    setPromoForm({
      promoCode: user.promoCode || '',
      discountPercent: user.discountPercent || 0,
      promoExpires: user.promoExpires ? new Date(user.promoExpires).toISOString().split('T')[0] : '',
      promoActive: user.promoActive || false
    });
  };

  const handleSavePromo = async (userId) => {
    setSavingId(userId);
    try {
      const payload = {
        ...promoForm,
        promoExpires: promoForm.promoExpires ? new Date(promoForm.promoExpires).toISOString() : null
      };
      
      // Call backend API to update user promo
      const response = await fetch(`/api/admin/users/${userId}/promo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update promo');
      
      const updated = await response.json();
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updated } : u)));
      setEditingPromo(null);
      toast.success('Promo code updated');
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Failed to update promo code');
    } finally {
      setSavingId(null);
    }
  };

  const handleCancelPromo = () => {
    setEditingPromo(null);
    setPromoForm({
      promoCode: '',
      discountPercent: 0,
      promoExpires: '',
      promoActive: false
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">User Management</h1>
        <button
          onClick={loadUsers}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-gray-50 text-black"
        >
          <RefreshCw className="h-4 w-4 text-black" /> Refresh
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or ID..."
          className="w-full md:w-80 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Loading users...
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">No users found</td>
              </tr>
            ) : (
              filtered.map((u) => (
                <React.Fragment key={u.id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={typeof u.role === 'string' ? u.role : (u.role?.name || 'USER')}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={savingId === u.id}
                        className="px-2 py-1 border rounded-md text-sm"
                      >
                        {roleOptions.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {u.promoCode ? (
                        <div>
                          <div className="font-medium text-indigo-600">{u.promoCode}</div>
                          <div className="text-xs text-gray-500">
                            {u.discountPercent}% off
                            {u.promoExpires && ` • Expires ${new Date(u.promoExpires).toLocaleDateString()}`}
                            {u.promoActive && <span className="ml-1 text-green-600">● Active</span>}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No promo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEditPromo(u)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        {u.promoCode ? 'Edit Promo' : 'Add Promo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {savingId === u.id ? (
                        <span className="inline-flex items-center gap-1 text-indigo-600">
                          <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" /> Synced
                        </span>
                      )}
                    </td>
                  </tr>
                  {editingPromo === u.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-semibold text-gray-900 mb-4">Edit Promo Code for {u.username}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Promo Code
                              </label>
                              <input
                                type="text"
                                value={promoForm.promoCode}
                                onChange={(e) => setPromoForm({ ...promoForm, promoCode: e.target.value.toUpperCase() })}
                                placeholder="e.g., SAVE20"
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discount Percentage
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={promoForm.discountPercent}
                                onChange={(e) => setPromoForm({ ...promoForm, discountPercent: Number(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiration Date
                              </label>
                              <input
                                type="date"
                                value={promoForm.promoExpires}
                                onChange={(e) => setPromoForm({ ...promoForm, promoExpires: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={promoForm.promoActive}
                                  onChange={(e) => setPromoForm({ ...promoForm, promoActive: e.target.checked })}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                              </label>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleSavePromo(u.id)}
                              disabled={savingId === u.id}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
                            >
                              {savingId === u.id ? 'Saving...' : 'Save Promo'}
                            </button>
                            <button
                              onClick={handleCancelPromo}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
