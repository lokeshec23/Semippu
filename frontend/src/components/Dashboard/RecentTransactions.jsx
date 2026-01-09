import React, { useState, useEffect } from 'react';
import { ShoppingBag, Coffee, Car, ArrowRight, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const CATEGORY_ICONS = {
    Shopping: ShoppingBag,
    'Food & Dining': Coffee,
    'Fuel/Transport': Car,
    Transport: Car,
    Groceries: ShoppingBag,
    Entertainment: TrendingUp,
    Salary: TrendingUp,
    Investment: TrendingUp,
};

const RecentTransactions = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentTransactions();
    }, [location.state]); // Re-fetch when location state changes

    const fetchRecentTransactions = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/transactions/${userId}/recent?limit=5`);
            console.log('Fetching recent transactions, status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('Transactions fetched:', data.length);
                setTransactions(data);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-6">Recent Transactions</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                <div>
                                    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">Recent Transactions</h3>
                    <button
                        onClick={() => navigate('/transactions/add')}
                        className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                    >
                        + Add
                    </button>
                </div>
                <div className="text-center py-8 text-gray-500">
                    <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No transactions yet</p>
                    <button
                        onClick={() => navigate('/transactions/add')}
                        className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
                    >
                        Add your first transaction
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Recent Transactions</h3>
                <button
                    onClick={() => navigate('/transactions')}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                {transactions.map(tx => {
                    const Icon = CATEGORY_ICONS[tx.category] || ShoppingBag;
                    const isIncome = tx.transaction_type === 'income';

                    return (
                        <div key={tx._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{tx.merchant || tx.category}</h4>
                                    <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${isIncome ? 'text-green-600' : 'text-gray-900'}`}>
                                {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString()}
                            </span>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => navigate('/transactions/add')}
                className="w-full mt-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
            >
                + Add Transaction
            </button>
        </div>
    );
};

export default RecentTransactions;
