import React, { useState } from 'react';
import { X, Calendar, Tag, FileText } from 'lucide-react';
import axios from 'axios';

const TransactionForm = ({ isOpen, onClose, onSuccess, userId, cardId = null, cardName = null }) => {
    const [formData, setFormData] = useState({
        merchant: '',
        amount: '',
        category: 'Shopping',
        paymentMode: cardId ? 'Credit Card' : 'UPI',
        date: new Date().toISOString().slice(0, 10),
        description: '',
        cardId: cardId || '',
        isEMI: false
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                userId: userId, // In real app, get from context/auth
                merchant: formData.merchant,
                amount: Number(formData.amount),
                category: formData.category,
                paymentMode: formData.paymentMode,
                date: new Date(formData.date).toISOString(),
                description: formData.description || undefined,
                cardId: formData.paymentMode === 'Credit Card' ? formData.cardId : undefined,
                isEMI: formData.isEMI
            };

            // If cardId was passed as prop, force it (though logic above handles it)
            if (cardId && formData.paymentMode === 'Credit Card') {
                payload.cardId = cardId;
            }

            await axios.post('http://localhost:8000/api/transactions', payload);

            onSuccess();
            onClose();
            // Reset form slightly
            setFormData({ ...formData, merchant: '', amount: '', description: '' });
        } catch (error) {
            console.error("Failed to add transaction", error);
            alert("Error adding transaction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-900 text-lg">Add New Transaction</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Amount Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-400 font-bold text-lg">₹</span>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-gray-300"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Merchant */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Merchant / Title</label>
                        <input
                            type="text"
                            name="merchant"
                            value={formData.merchant}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                            placeholder="e.g. Amazon, Uber, Starbucks"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white"
                            >
                                {['Shopping', 'Food', 'Transport', 'Bills', 'Entertainment', 'Health', 'Education', 'Others'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Mode */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Mode</label>
                        <select
                            name="paymentMode"
                            value={formData.paymentMode}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white"
                        >
                            <option value="UPI">UPI</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </div>

                    {/* Card Selection (if Credit Card selected and not fixed) */}
                    {formData.paymentMode === 'Credit Card' && !cardId && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Select Card</label>
                            <input
                                type="text"
                                name="cardId"
                                value={formData.cardId}
                                onChange={handleChange}
                                placeholder="Enter Card ID (Temp)" // To be replaced with Dropdown from API
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                            />
                        </div>
                    )}

                    {/* EMI Toggle */}
                    {formData.paymentMode === 'Credit Card' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isEMI"
                                id="isEMI"
                                checked={formData.isEMI}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="isEMI" className="text-sm text-gray-700">Convert to EMI?</label>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-200 mt-4 transition-all
                  ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}
               `}
                    >
                        {loading ? 'Adding...' : 'Add Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
