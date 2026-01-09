import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Filter, Download, MoreVertical, CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip as RechartsTooltip } from 'recharts';

const CardDetailView = () => {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('transactions'); // transactions, analysis, settings

    // Mock Data
    const cardData = {
        id: cardId,
        name: "HDFC Millennia",
        bank: "HDFC Bank",
        number: "4589",
        limit: 100000,
        outstanding: 25450,
        dueDate: "2023-11-20",
        billingDate: "2023-11-01",
        color: "from-indigo-600 to-blue-500"
    };

    const utilization = (cardData.outstanding / cardData.limit) * 100;
    const available = cardData.limit - cardData.outstanding;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Banner */}
            <div className={`bg-gradient-to-r ${cardData.color} pb-12 pt-8 px-6 text-white shadow-lg`}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
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
                                <span className="font-mono text-lg tracking-widest">**** **** **** {cardData.number}</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-1">{cardData.name}</h1>
                            <p className="opacity-75">{cardData.bank}</p>
                        </div>

                        <div className="w-full md:w-auto bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[200px] border border-white/10">
                            <p className="text-xs uppercase tracking-wider opacity-75 mb-1">Available Credit</p>
                            <h3 className="text-2xl font-bold">₹{available.toLocaleString()}</h3>
                            <div className="mt-2 w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white/90 rounded-full" style={{ width: `${100 - utilization}%` }} />
                            </div>
                            <div className="flex justify-between text-xs mt-1 opacity-75">
                                <span>Limit: ₹{(cardData.limit / 1000)}k</span>
                                <span>{Math.round(utilization)}% Used</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl min-h-[500px] border border-gray-100 overflow-hidden">

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        {['transactions', 'analysis', 'settings'].map(tab => (
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
                                    <h3 className="font-bold text-gray-900">Recent Transactions</h3>
                                    <div className="flex gap-2">
                                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                                            <Filter className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Empty State Mock */}
                                <div className="text-center py-12 text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p>No transactions found for this period</p>
                                    <button className="mt-4 text-blue-600 font-semibold hover:underline">Add First Transaction</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'analysis' && (
                            <div className="text-center py-20 text-gray-400">Analysis Charts Coming Soon</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-300 flex items-center justify-center hover:bg-blue-700 transform hover:scale-105 transition-all z-20">
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
};

export default CardDetailView;
