import React, { useState, useEffect } from 'react';
import { CreditCard, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/constants';

const CreditCardsSummary = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/cards/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCards(data);
                }
            } catch (error) {
                console.error('Error fetching cards:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    const getCardColor = (index) => {
        const colors = [
            'from-indigo-600 to-blue-500',
            'from-gray-800 to-gray-900',
            'from-purple-600 to-pink-500',
            'from-green-600 to-teal-500',
            'from-orange-600 to-red-500'
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">My Cards</h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {[1, 2].map(i => (
                        <div key={i} className="min-w-[300px] h-40 rounded-xl bg-gray-200 animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">My Cards</h3>
                    <button className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">
                        + Add Card
                    </button>
                </div>
                <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No cards added yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">My Cards</h3>
                <button className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">
                    + Add Card
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {cards.map((card, index) => {
                    const limit = card.creditLimit || 0;
                    const used = card.currentOutstanding || 0;
                    const utilization = limit > 0 ? (used / limit) * 100 : 0;
                    const lastFour = card.cardNumber?.slice(-4) || '****';

                    return (
                        <div
                            key={card._id}
                            onClick={() => navigate(`/cards/${card._id}`)}
                            className={`min-w-[300px] rounded-2xl p-6 bg-gradient-to-br ${getCardColor(index)} text-white relative flex-shrink-0 group cursor-pointer transition-all hover:-translate-y-1 shadow-md`}
                        >
                            {/* Header: Bank Name  & Type Badge */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="font-bold text-xl tracking-wide text-white drop-shadow-sm">
                                        {card.bankName}
                                    </h3>
                                    <p className="text-white/80 text-xs font-medium mt-1">
                                        {card.cardType === 'credit' ? 'Credit Card' : 'Debit Card'}
                                    </p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                                    <CreditCard className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            {/* Card Number */}
                            <div className="mb-8 pl-1">
                                <span className="font-mono text-xl tracking-widest text-white/90">
                                    **** {lastFour}
                                </span>
                            </div>

                            {/* Footer: Balance/Limit & Progress */}
                            <div className="mt-auto">
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-white/70 text-xs uppercase tracking-wider font-semibold mb-1">
                                            {card.cardType === 'credit' ? 'Available Credit' : 'Current Balance'}
                                        </p>
                                        <h4 className="text-2xl font-bold">
                                            {card.cardType === 'credit'
                                                ? `₹${(limit - used).toLocaleString()}`
                                                : `₹${used.toLocaleString()}`
                                            }
                                        </h4>
                                    </div>
                                    {card.cardType === 'credit' && (
                                        <div className="text-right">
                                            <p className="text-white/90 text-sm font-semibold">{Math.round(utilization)}%</p>
                                            <p className="text-white/60 text-xs">Used</p>
                                        </div>
                                    )}
                                </div>

                                {card.cardType === 'credit' && limit > 0 && (
                                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden mt-3">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${utilization > 80 ? 'bg-red-400' : utilization > 30 ? 'bg-yellow-400' : 'bg-green-400'}`}
                                            style={{ width: `${Math.min(utilization, 100)}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CreditCardsSummary;
