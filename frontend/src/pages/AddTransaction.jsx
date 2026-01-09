import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Calendar, Tag, Store, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';

const TRANSACTION_CATEGORIES = [
    'Groceries', 'Fuel/Transport', 'Bills & Utilities', 'Food & Dining',
    'Shopping', 'Entertainment', 'Healthcare', 'Education',
    'Salary', 'Investment', 'Others'
];

const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash', icon: Wallet },
    { value: 'card', label: 'Card', icon: CreditCard },
    { value: 'upi', label: 'UPI', icon: Wallet },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: Wallet }
];

const AddTransaction = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        transactionType: 'expense',
        amount: '',
        category: '',
        merchant: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        cardId: '',
        bankAccountId: ''
    });
    const [cards, setCards] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCardsAndAccounts();
    }, []);

    const fetchCardsAndAccounts = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const [cardsRes, banksRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/cards/${userId}`),
                fetch(`${API_BASE_URL}/api/bank-accounts/${userId}`)
            ]);

            if (cardsRes.ok) setCards(await cardsRes.json());
            if (banksRes.ok) setBankAccounts(await banksRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login first');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                userId,
                transactionType: formData.transactionType,
                amount: parseFloat(formData.amount),
                category: formData.category,
                merchant: formData.merchant || null,
                description: formData.description || null,
                date: new Date(formData.date).toISOString(),
                paymentMethod: formData.paymentMethod,
                cardId: formData.paymentMethod === 'card' && formData.cardId ? formData.cardId : null,
                bankAccountId: formData.paymentMethod === 'bank_transfer' && formData.bankAccountId ? formData.bankAccountId : null,
                status: 'completed'
            };

            const response = await fetch(`${API_BASE_URL}/api/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log('Transaction response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('Transaction created:', result);
                navigate('/dashboard', { state: { refresh: true } });
            } else {
                const error = await response.json();
                console.error('Transaction error:', error);
                setErrors({ submit: error.detail || 'Failed to add transaction' });
            }
        } catch (error) {
            console.error('Network error:', error);
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add Transaction</h1>
                        <p className="text-gray-500 text-sm">Record your income or expense</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Transaction Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Transaction Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, transactionType: 'expense' }))}
                                    className={`py-3 px-4 rounded-xl font-medium border-2 transition-all ${formData.transactionType === 'expense'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, transactionType: 'income' }))}
                                    className={`py-3 px-4 rounded-xl font-medium border-2 transition-all ${formData.transactionType === 'income'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    Income
                                </button>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Amount (₹)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    step="0.01"
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-10 text-lg font-bold ${errors.amount ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                        }`}
                                    placeholder="0.00"
                                />
                                <IndianRupee className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                            {errors.amount && <p className="text-red-500 text-xs flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.amount}</p>}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-10 bg-white ${errors.category ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                        }`}
                                >
                                    <option value="">Select Category</option>
                                    {TRANSACTION_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                            </div>
                            {errors.category && <p className="text-red-500 text-xs flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.category}</p>}
                        </div>

                        {/* Merchant */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Merchant (Optional)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="merchant"
                                    value={formData.merchant}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pl-10"
                                    placeholder="e.g., Amazon, Starbucks"
                                />
                                <Store className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
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
                                placeholder="Add notes..."
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pl-10"
                                />
                                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Payment Method</label>
                            <div className="grid grid-cols-2 gap-3">
                                {PAYMENT_METHODS.map(method => (
                                    <button
                                        key={method.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
                                        className={`py-3 px-4 rounded-xl font-medium border-2 transition-all flex items-center justify-center gap-2 ${formData.paymentMethod === method.value
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        <method.icon className="w-4 h-4" />
                                        {method.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Card Selection (if payment method is card) */}
                        {formData.paymentMethod === 'card' && cards.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Select Card</label>
                                <select
                                    name="cardId"
                                    value={formData.cardId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                                >
                                    <option value="">Select Card</option>
                                    {cards.map(card => (
                                        <option key={card._id} value={card._id}>
                                            {card.bank_name} - **** {card.card_number?.slice(-4)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Bank Account Selection (if payment method is bank transfer) */}
                        {formData.paymentMethod === 'bank_transfer' && bankAccounts.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Select Bank Account</label>
                                <select
                                    name="bankAccountId"
                                    value={formData.bankAccountId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                                >
                                    <option value="">Select Account</option>
                                    {bankAccounts.map(account => (
                                        <option key={account._id} value={account._id}>
                                            {account.bank_name} - **** {account.account_number?.slice(-4)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-700 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />{errors.submit}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Adding Transaction...' : 'Add Transaction'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;
