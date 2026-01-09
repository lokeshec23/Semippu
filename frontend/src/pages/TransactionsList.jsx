import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Search, Calendar, Tag, TrendingUp, TrendingDown, ShoppingBag, Coffee, Car } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';

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

const TRANSACTION_CATEGORIES = [
    'All', 'Groceries', 'Fuel/Transport', 'Bills & Utilities', 'Food & Dining',
    'Shopping', 'Entertainment', 'Healthcare', 'Education',
    'Salary', 'Investment', 'Others'
];

const TransactionsList = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'All',
        type: 'All',
        search: ''
    });

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const fetchTransactions = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            let url = `${API_BASE_URL}/api/transactions/${userId}?limit=100`;

            if (filters.category !== 'All') {
                url += `&category=${encodeURIComponent(filters.category)}`;
            }
            if (filters.type !== 'All') {
                url += `&transaction_type=${filters.type.toLowerCase()}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                let data = await response.json();

                // Client-side search filter
                if (filters.search) {
                    data = data.filter(tx =>
                        (tx.merchant?.toLowerCase().includes(filters.search.toLowerCase())) ||
                        (tx.category?.toLowerCase().includes(filters.search.toLowerCase())) ||
                        (tx.description?.toLowerCase().includes(filters.search.toLowerCase()))
                    );
                }

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
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const groupByDate = (transactions) => {
        const groups = {};
        transactions.forEach(tx => {
            const date = new Date(tx.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(tx);
        });
        return groups;
    };

    const groupedTransactions = groupByDate(transactions);

    // Calculate totals
    const totalIncome = transactions
        .filter(tx => tx.transactionType === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpense = transactions
        .filter(tx => tx.transactionType === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);

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
                        <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
                        <p className="text-gray-500 text-sm">{transactions.length} transactions</p>
                    </div>
                    <button
                        onClick={() => navigate('/transactions/add')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                        + Add
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <p className="text-xs text-green-600 font-semibold">Income</p>
                        </div>
                        <p className="text-2xl font-bold text-green-700">₹{totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingDown className="w-4 h-4 text-red-600" />
                            <p className="text-xs text-red-600 font-semibold">Expenses</p>
                        </div>
                        <p className="text-2xl font-bold text-red-700">₹{totalExpense.toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {TRANSACTION_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilters({ ...filters, category: cat })}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filters.category === cat
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Type Filter */}
                        <div className="flex gap-2">
                            {['All', 'Income', 'Expense'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilters({ ...filters, type })}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${filters.type === type
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                        <div>
                                            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your filters or add a new transaction</p>
                        <button
                            onClick={() => navigate('/transactions/add')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Add Transaction
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedTransactions).map(([date, txs]) => (
                            <div key={date}>
                                <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">{date}</h3>
                                <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
                                    {txs.map(tx => {
                                        const Icon = CATEGORY_ICONS[tx.category] || ShoppingBag;
                                        const isIncome = tx.transactionType === 'income';

                                        return (
                                            <div
                                                key={tx._id}
                                                onClick={() => navigate(`/transactions/edit/${tx._id}`)}
                                                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{tx.merchant || tx.category}</h4>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <span>{tx.category}</span>
                                                                <span>•</span>
                                                                <span>{tx.paymentMethod}</span>
                                                                {tx.description && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="truncate max-w-[200px]">{tx.description}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-gray-900'}`}>
                                                            {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionsList;
