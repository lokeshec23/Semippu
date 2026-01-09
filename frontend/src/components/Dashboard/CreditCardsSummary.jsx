import React from 'react';
import { CreditCard, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreditCardsSummary = () => {
    const navigate = useNavigate();
    // Mock data
    const cards = [
        { id: 1, name: 'HDFC Millennia', bank: 'HDFC', number: '4589', limit: 100000, used: 25000, color: 'from-indigo-600 to-blue-500' },
        { id: 2, name: 'Axis Ace', bank: 'Axis', number: '1234', limit: 50000, used: 45000, color: 'from-gray-800 to-gray-900' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">My Cards</h3>
                <button className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">
                    + Add Card
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {cards.map(card => {
                    const utilization = (card.used / card.limit) * 100;
                    return (
                        <div
                            key={card.id}
                            onClick={() => navigate(`/cards/${card.id}`)}
                            className={`min-w-[300px] rounded-xl p-5 bg-gradient-to-br ${card.color} text-white relative flex-shrink-0 group cursor-pointer transition-transform hover:-translate-y-1`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <CreditCard className="w-8 h-8 opacity-80" />
                                <span className="font-mono tracking-widest text-lg opacity-80">**** {card.number}</span>
                            </div>

                            <div className="mb-4">
                                <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Current Outstanding</p>
                                <h4 className="text-2xl font-bold mt-1">₹{card.used.toLocaleString()}</h4>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-white/80">
                                    <span>Limit: ₹{card.limit.toLocaleString()}</span>
                                    <span>{Math.round(utilization)}% Used</span>
                                </div>
                                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${utilization > 80 ? 'bg-red-400' : utilization > 30 ? 'bg-yellow-400' : 'bg-green-400'}`}
                                        style={{ width: `${utilization}%` }}
                                    />
                                </div>
                            </div>

                            <h3 className="absolute bottom-5 right-5 font-semibold text-white/20 text-xl">{card.bank}</h3>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CreditCardsSummary;
