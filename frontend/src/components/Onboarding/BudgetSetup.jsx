import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Trash2, TrendingUp, AlertCircle, IndianRupee } from 'lucide-react';

const DEFAULT_CATEGORIES = [
    { name: 'Groceries', amount: 0, color: '#10B981' }, // Green
    { name: 'Fuel/Transport', amount: 0, color: '#3B82F6' }, // Blue
    { name: 'Bills & Utilities', amount: 0, color: '#F59E0B' }, // Yellow
    { name: 'Food & Dining', amount: 0, color: '#EC4899' }, // Pink
    { name: 'Shopping', amount: 0, color: '#8B5CF6' }, // Purple
    { name: 'Entertainment', amount: 0, color: '#F97316' }, // Orange
    { name: 'Healthcare', amount: 0, color: '#EF4444' }, // Red
    { name: 'Education', amount: 0, color: '#6366F1' }, // Indigo
    { name: 'Others', amount: 0, color: '#9CA3AF' }, // Gray
];

const BudgetSetup = ({ data, updateData, onNext, onBack }) => {
    const [totalBudget, setTotalBudget] = useState(data.totalBudget || '');
    const [savingsGoal, setSavingsGoal] = useState(data.savingsGoal || '');
    const [categories, setCategories] = useState(data.categories || DEFAULT_CATEGORIES);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Update parent state when local state changes
        updateData({
            totalBudget,
            savingsGoal,
            categories
        });
    }, [totalBudget, savingsGoal, categories]);

    const handleCategoryChange = (index, value) => {
        const newCategories = [...categories];
        newCategories[index].amount = Number(value);
        setCategories(newCategories);
    };

    const handleAddCategory = () => {
        const name = prompt("Enter category name:");
        if (name) {
            setCategories([...categories, { name, amount: 0, color: '#64748B' }]);
        }
    };

    const totalAllocated = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const totalBudgetNum = Number(totalBudget) || 0;
    const remainingCheck = totalBudgetNum - totalAllocated;

    const handleContinue = () => {
        if (!totalBudget || totalBudgetNum <= 0) {
            setErrors({ totalBudget: "Please enter a valid monthly budget" });
            return;
        }

        if (remainingCheck < 0) {
            setErrors({ allocation: "You have allocated more than your total budget!" });
            return;
        }

        onNext();
    };

    // Chart Data
    const chartData = categories.filter(c => c.amount > 0);

    return (
        <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Budget & Financial Goals</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Inputs */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Monthly Expense Budget (₹)</label>
                        <input
                            type="number"
                            value={totalBudget}
                            onChange={(e) => {
                                setTotalBudget(e.target.value);
                                setErrors({});
                            }}
                            className={`w-full px-4 py-3 rounded-lg border text-lg font-bold text-gray-800 ${errors.totalBudget ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'} outline-none`}
                            placeholder="50000"
                        />
                        {errors.totalBudget && <p className="text-red-500 text-xs">{errors.totalBudget}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Monthly Savings Goal (Optional)</label>
                        <input
                            type="number"
                            value={savingsGoal}
                            onChange={(e) => setSavingsGoal(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                            placeholder="10000"
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-blue-900">Category Allocation</h4>
                            <button onClick={handleAddCategory} className="text-xs font-bold text-blue-600 hover:text-blue-800">+ Add Custom</button>
                        </div>

                        <div className="h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {categories.map((cat, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                                    <span className="text-sm text-gray-600 flex-1 truncate">{cat.name}</span>
                                    <div className="relative w-32">
                                        <input
                                            type="number"
                                            value={cat.amount || ''}
                                            onChange={(e) => handleCategoryChange(index, e.target.value)}
                                            className="w-full px-3 py-1.5 rounded border border-gray-200 text-right text-sm focus:border-blue-500 outline-none"
                                            placeholder="0"
                                        />
                                        <span className="absolute left-2 top-1.5 text-gray-400 text-xs">₹</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Visualization */}
                <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white/60 text-xs uppercase tracking-wider">Remaining to Allocate</p>
                                <h2 className={`text-2xl font-bold ${remainingCheck < 0 ? 'text-red-400' : 'text-white'}`}>
                                    ₹{remainingCheck.toLocaleString()}
                                </h2>
                            </div>
                        </div>

                        {remainingCheck < 0 && (
                            <div className="bg-red-500/20 text-red-200 text-xs px-3 py-2 rounded-lg flex items-center mb-4">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Budget exceeded by ₹{Math.abs(remainingCheck).toLocaleString()}
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-white/80">
                                <span>Allocated</span>
                                <span>{Math.round((totalAllocated / (totalBudgetNum || 1)) * 100)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${remainingCheck < 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${Math.min((totalAllocated / (totalBudgetNum || 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-center min-h-[300px]">
                        {totalAllocated > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="amount"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `₹${value.toLocaleString()}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-gray-400">
                                <p>Allocate budget to see breakdown</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6 mt-8 border-t border-gray-100">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all"
                >
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all"
                >
                    Review & Finish
                </button>
            </div>
        </div>
    );
};

export default BudgetSetup;
