import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    LineChart, Line, CartesianGrid
} from 'recharts';

const Analytics = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month'); // month, 3months, year

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
            return;
        }

        try {
            const [txRes, budgetRes] = await Promise.all([
                fetch(`http://localhost:8000/api/transactions/${userId}?limit=500`),
                fetch(`http://localhost:8000/api/budgets/${userId}/${new Date().toISOString().slice(0, 7)}`)
            ]);

            if (txRes.ok) setTransactions(await txRes.json());
            if (budgetRes.ok) setBudget(await budgetRes.json());
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate metrics
    const totalIncome = transactions
        .filter(tx => tx.transactionType === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpense = transactions
        .filter(tx => tx.transactionType === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Category breakdown
    const categoryData = transactions
        .filter(tx => tx.transactionType === 'expense')
        .reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {});

    const categoryChartData = Object.entries(categoryData)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    // Monthly trend
    const monthlyData = transactions.reduce((acc, tx) => {
        const month = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = { month, income: 0, expense: 0 };
        }
        if (tx.transactionType === 'income') {
            acc[month].income += tx.amount;
        } else {
            acc[month].expense += tx.amount;
        }
        return acc;
    }, {});

    const monthlyChartData = Object.values(monthlyData).slice(-6);

    // Payment method breakdown
    const paymentMethodData = transactions
        .filter(tx => tx.transactionType === 'expense')
        .reduce((acc, tx) => {
            acc[tx.paymentMethod] = (acc[tx.paymentMethod] || 0) + tx.amount;
            return acc;
        }, {});

    const paymentChartData = Object.entries(paymentMethodData).map(([name, value]) => ({
        name: name.replace('_', ' ').toUpperCase(),
        value
    }));

    const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                        <p className="text-gray-500 text-sm">Financial insights and trends</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <p className="text-xs text-gray-500 font-semibold">Total Income</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">₹{totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingDown className="w-4 h-4 text-red-600" />
                            <p className="text-xs text-gray-500 font-semibold">Total Expenses</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">₹{totalExpense.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <p className="text-xs text-gray-500 font-semibold">Net Savings</p>
                        </div>
                        <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{netSavings.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <p className="text-xs text-gray-500 font-semibold">Savings Rate</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{savingsRate.toFixed(1)}%</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Income vs Expense Trend */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Income vs Expense Trend</h3>
                        {monthlyChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={monthlyChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
                                    <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} name="Expense" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 text-center py-12">No data available</p>
                        )}
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Spending by Category</h3>
                        {categoryChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={categoryChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 text-center py-12">No data available</p>
                        )}
                    </div>

                    {/* Monthly Comparison */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Monthly Comparison</h3>
                        {monthlyChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={monthlyChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                    <Legend />
                                    <Bar dataKey="income" fill="#10B981" name="Income" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="expense" fill="#EF4444" name="Expense" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 text-center py-12">No data available</p>
                        )}
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Payment Methods</h3>
                        {paymentChartData.length > 0 ? (
                            <div className="space-y-3">
                                {paymentChartData.map((method, index) => {
                                    const percentage = (method.value / totalExpense) * 100;
                                    return (
                                        <div key={method.name}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">{method.name}</span>
                                                <span className="text-sm font-semibold text-gray-900">₹{method.value.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: COLORS[index % COLORS.length]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-12">No data available</p>
                        )}
                    </div>

                    {/* Top Categories */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 lg:col-span-2">
                        <h3 className="font-bold text-gray-900 mb-4">Top Spending Categories</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {categoryChartData.slice(0, 3).map((cat, index) => (
                                <div key={cat.name} className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                        <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">₹{cat.value.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {((cat.value / totalExpense) * 100).toFixed(1)}% of total expenses
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
