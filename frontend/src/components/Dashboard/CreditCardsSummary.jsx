import React, { useState, useEffect } from 'react';
import { CreditCard, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
                const response = await fetch(`http://localhost:8000/api/cards/${userId}`);
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
                    const limit = card.credit_limit || 0;
                    const used = card.current_outstanding || 0;
                    const utilization = limit > 0 ? (used / limit) * 100 : 0;
                    const lastFour = card.card_number?.slice(-4) || '****';

                    return (
                        <div
                            key={card._id}
                            onClick={() => navigate(`/cards/${card._id}`)}
                            className={`min-w-[300px] rounded-xl p-5 bg-gradient-to-br ${getCardColor(index)} text-white relative flex-shrink-0 group cursor-pointer transition-transform hover:-translate-y-1`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <CreditCard className="w-8 h-8 opacity-80" />
                                <span className="font-mono tracking-widest text-lg opacity-80">**** {lastFour}</span>
                            </div>

                            <div className="mb-4">
                                <p className="text-white/60 text-xs uppercase tracking-wider font-medium">
                                    {card.card_type === 'credit' ? 'Current Outstanding' : 'Card Type'}
                                </p>
                                <h4 className="text-2xl font-bold mt-1">
                                    {card.card_type === 'credit' ? `₹${used.toLocaleString()}` : card.card_type}
                                </h4>
                            </div>

                            {card.card_type === 'credit' && limit > 0 && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-white/80">
                                        <span>Limit: ₹{limit.toLocaleString()}</span>
                                        <span>{Math.round(utilization)}% Used</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${utilization > 80 ? 'bg-red-400' : utilization > 30 ? 'bg-yellow-400' : 'bg-green-400'}`}
                                            style={{ width: `${Math.min(utilization, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <h3 className="absolute bottom-5 right-5 font-semibold text-white/20 text-xl">
                                {card.bank_name}
                            </h3>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CreditCardsSummary;
