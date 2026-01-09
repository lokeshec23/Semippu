import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Filter, Download, MoreVertical, CreditCard, ShoppingBag, Coffee, Car, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';

const CATEGORY_ICONS = {
    Shopping: ShoppingBag,
    'Food & Dining': Coffee,
    'Fuel/Transport': Car,
    Transport: Car,
    Groceries: ShoppingBag,
    Entertainment: TrendingUp,
};

const CARD_COLORS = [
    'from-indigo-600 to-blue-500',
    'from-purple-600 to-pink-500',
    'from-green-600 to-teal-500',
    'from-orange-600 to-red-500',
];

const CardDetailView = () => {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('transactions');
    const [cardData, setCardData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCardData();
        fetchCardTransactions();
    }, [cardId]);

    const fetchCardData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`http://localhost:8000/api/cards/${userId}`);
            if (response.ok) {
                const cards = await response.json();
                const card = cards.find(c => c._id === cardId);
                setCardData(card);
            }
        } catch (error) {
            console.error('Error fetching card:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCardTransactions = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/transactions/card/${cardId}`);
            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    if (loading || !cardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const utilization = cardData.card_type === 'credit'
        ? (cardData.current_outstanding / cardData.credit_limit) * 100
        : 0;
    const available = cardData.card_type === 'credit'
        ? cardData.credit_limit - cardData.current_outstanding
        : cardData.balance || 0;

    // Calculate spending by category
    const categorySpending = transactions.reduce((acc, tx) => {
        if (tx.transactionType === 'expense') {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        }
        return acc;
    }, {});

    const categoryData = Object.entries(categorySpending).map(([name, value]) => ({
        name,
        value
    }));

    // Calculate monthly spending
    const monthlySpending = transactions.reduce((acc, tx) => {
        if (tx.transactionType === 'expense') {
            const month = new Date(tx.date).toLocaleDateString('en-US', { month: 'short' });
            acc[month] = (acc[month] || 0) + tx.amount;
        }
        return acc;
    }, {});

    const monthlyData = Object.entries(monthlySpending).map(([month, amount]) => ({
        month,
        amount
    }));

    const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Banner */}
            <div className={`bg-gradient-to-r ${CARD_COLORS[0]} pb-12 pt-8 px-6 text-white shadow-lg`}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold tracking-wide">Card Details</h2>
                        <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2 opacity-90">
                                <CreditCard className="w-6 h-6" />
                                <span className="font-mono text-lg tracking-widest">**** **** **** {cardData.card_number?.slice(-4)}</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-1">{cardData.bank_name}</h1>
                            <p className="opacity-75">{cardData.card_type === 'credit' ? 'Credit Card' : 'Debit Card'}</p>
                        </div>

                        <div className="w-full md:w-auto bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[200px] border border-white/10">
                            <p className="text-xs uppercase tracking-wider opacity-75 mb-1">
                                {cardData.card_type === 'credit' ? 'Available Credit' : 'Balance'}
                            </p>
                            <h3 className="text-2xl font-bold">₹{available.toLocaleString()}</h3>
                            {cardData.card_type === 'credit' && (
                                <>
                                    <div className="mt-2 w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white/90 rounded-full" style={{ width: `${100 - utilization}%` }} />
                                    </div>
                                    <div className="flex justify-between text-xs mt-1 opacity-75">
                                        <span>Limit: ₹{(cardData.credit_limit / 1000)}k</span>
                                        <span>{Math.round(utilization)}% Used</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl min-h-[500px] border border-gray-100 overflow-hidden">

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        {['transactions', 'analysis'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors border-b-2 
                        ${activeTab === tab ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}
                     `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'transactions' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900">Card Transactions ({transactions.length})</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate('/transactions/add')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                                        >
                                            + Add Transaction
                                        </button>
                                    </div>
                                </div>

                                {transactions.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p>No transactions found for this card</p>
                                        <button
                                            onClick={() => navigate('/transactions/add')}
                                            className="mt-4 text-blue-600 font-semibold hover:underline"
                                        >
                                            Add First Transaction
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.map(tx => {
                                            const Icon = CATEGORY_ICONS[tx.category] || ShoppingBag;
                                            const isIncome = tx.transactionType === 'income';

                                            return (
                                                <div key={tx._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{tx.merchant || tx.category}</h4>
                                                            <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-gray-900'}`}>
                                                        {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'analysis' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4">Spending by Category</h3>
                                    {categoryData.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie
                                                        data={categoryData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {categoryData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="space-y-2">
                                                {categoryData.map((cat, index) => (
                                                    <div key={cat.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                            <span className="text-sm text-gray-700">{cat.name}</span>
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-900">₹{cat.value.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-center py-8">No spending data available</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4">Monthly Spending Trend</h3>
                                    {monthlyData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={monthlyData}>
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <RechartsTooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                                <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="text-gray-400 text-center py-8">No monthly data available</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => navigate('/transactions/add')}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-300 flex items-center justify-center hover:bg-blue-700 transform hover:scale-105 transition-all z-20"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
};

export default CardDetailView;
