import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';

const EditTransaction = () => {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        merchant: '',
        description: '',
        date: '',
        status: 'completed'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const TRANSACTION_CATEGORIES = [
        'Groceries', 'Fuel/Transport', 'Bills & Utilities', 'Food & Dining',
        'Shopping', 'Entertainment', 'Healthcare', 'Education',
        'Salary', 'Investment', 'Others'
    ];

    useEffect(() => {
        fetchTransaction();
    }, [transactionId]);

    const fetchTransaction = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/transactions/detail/${transactionId}`);
            if (response.ok) {
                const data = await response.json();
                setTransaction(data);
                setFormData({
                    amount: data.amount,
                    category: data.category,
                    merchant: data.merchant || '',
                    description: data.description || '',
                    date: new Date(data.date).toISOString().split('T')[0],
                    status: data.status
                });
            } else {
                navigate('/transactions');
            }
        } catch (error) {
            console.error('Error fetching transaction:', error);
            navigate('/transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }
        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }
        if (!formData.date) {
            newErrors.date = 'Please select a date';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            const payload = {
                amount: parseFloat(formData.amount),
                category: formData.category,
                merchant: formData.merchant || null,
                description: formData.description || null,
                date: new Date(formData.date).toISOString(),
                status: formData.status
            };

            const response = await fetch(`${API_BASE_URL}/api/transactions/${transactionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/transactions', { state: { message: 'Transaction updated successfully' } });
            } else {
                setErrors({ submit: 'Failed to update transaction' });
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/transactions/${transactionId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                navigate('/transactions', { state: { message: 'Transaction deleted successfully' } });
            } else {
                setErrors({ submit: 'Failed to delete transaction' });
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
        }
        setShowDeleteConfirm(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!transaction) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/transactions')}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Transaction</h1>
                        <p className="text-gray-500 text-sm">Update transaction details</p>
                    </div>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="space-y-6">
                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                step="0.01"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all text-lg font-bold ${errors.amount ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                            />
                            {errors.amount && <p className="text-red-500 text-xs flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.amount}</p>}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all bg-white ${errors.category ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                            >
                                <option value="">Select Category</option>
                                {TRANSACTION_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.category}</p>}
                        </div>

                        {/* Merchant */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Merchant (Optional)</label>
                            <input
                                type="text"
                                name="merchant"
                                value={formData.merchant}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>

                        {/* Error Message */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-700 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />{errors.submit}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => navigate('/transactions')}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 flex items-center justify-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Transaction?</h3>
                        <p className="text-gray-500 text-center mb-6">
                            This action cannot be undone. The transaction will be permanently deleted.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditTransaction;
