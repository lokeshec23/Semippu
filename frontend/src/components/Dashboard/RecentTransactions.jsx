import React from 'react';
import { ShoppingBag, Coffee, Car, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS = {
    Shopping: ShoppingBag,
    Food: Coffee,
    Transport: Car,
};

const RecentTransactions = () => {
    const transactions = [
        { id: 1, merchant: 'Amazon India', category: 'Shopping', amount: 1299, date: 'Today, 10:45 AM', type: 'debit' },
        { id: 2, merchant: 'Starbucks', category: 'Food', amount: 350, date: 'Yesterday, 4:20 PM', type: 'debit' },
        { id: 3, merchant: 'Uber Trip', category: 'Transport', amount: 240, date: 'Yesterday, 9:00 AM', type: 'debit' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Recent Transactions</h3>
                <button className="text-gray-400 hover:text-gray-600">
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                {transactions.map(tx => {
                    const Icon = CATEGORY_ICONS[tx.category] || ShoppingBag;
                    return (
                        <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{tx.merchant}</h4>
                                    <p className="text-xs text-gray-500">{tx.date}</p>
                                </div>
                            </div>
                            <span className="font-bold text-gray-900">-₹{tx.amount}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentTransactions;
