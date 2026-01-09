import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Building2, Wallet, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const BankAccounts = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBalances, setShowBalances] = useState(true);
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        accountType: 'savings',
        balance: '',
        ifscCode: ''
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/bank-accounts/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setAccounts(data);
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            toast.error('Failed to load bank accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        const payload = {
            userId,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            accountType: formData.accountType,
            balance: parseFloat(formData.balance),
            ifscCode: formData.ifscCode
        };

        try {
            const response = await fetch('http://localhost:8000/api/bank-accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success('Bank account added successfully');
                setShowAddModal(false);
                setFormData({
                    bankName: '',
                    accountNumber: '',
                    accountType: 'savings',
                    balance: '',
                    ifscCode: ''
                });
                fetchAccounts();
            } else {
                toast.error('Failed to add bank account');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        }
    };

    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">Bank Accounts</h1>
                        <p className="text-gray-500 text-sm">{accounts.length} accounts</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Account
                    </button>
                </div>

                {/* Total Balance Card */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
                            <h2 className="text-4xl font-bold">
                                {showBalances ? `₹${totalBalance.toLocaleString()}` : '₹••••••'}
                            </h2>
                        </div>
                        <button
                            onClick={() => setShowBalances(!showBalances)}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            {showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="text-blue-100 text-sm">Across {accounts.length} bank accounts</p>
                </div>

                {/* Accounts List */}
                {accounts.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No bank accounts</h3>
                        <p className="text-gray-500 mb-4">Add your first bank account to get started</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Add Bank Account
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {accounts.map((account) => (
                            <div key={account._id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg mb-1">{account.bank_name}</h3>
                                            <p className="text-gray-500 text-sm mb-2">
                                                {account.account_type?.charAt(0).toUpperCase() + account.account_type?.slice(1)} Account
                                            </p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-gray-600">
                                                    •••• {account.account_number?.slice(-4)}
                                                </span>
                                                {account.ifsc_code && (
                                                    <>
                                                        <span className="text-gray-300">|</span>
                                                        <span className="text-gray-600">IFSC: {account.ifsc_code}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-900">
                                            {showBalances ? `₹${account.balance?.toLocaleString()}` : '₹••••••'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">Available Balance</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Account Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Bank Account</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2">Bank Name</label>
                                <input
                                    type="text"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="e.g., HDFC Bank"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2">Account Number</label>
                                <input
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Enter account number"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2">Account Type</label>
                                <select
                                    value={formData.accountType}
                                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                                >
                                    <option value="savings">Savings</option>
                                    <option value="current">Current</option>
                                    <option value="salary">Salary</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2">Current Balance (₹)</label>
                                <input
                                    type="number"
                                    value={formData.balance}
                                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2">IFSC Code (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.ifscCode}
                                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="e.g., HDFC0001234"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                                >
                                    Add Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankAccounts;
