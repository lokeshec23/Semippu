import React, { useState } from 'react';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import { BANK_NAMES } from '../../utils/constants';

const CardDetails = ({ data, updateData, onNext, onBack }) => {
    const [hasCards, setHasCards] = useState(data && data.length > 0 ? 'yes' : null); // 'yes', 'no'
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const cards = Array.isArray(data) ? data : [];

    const handleAddCard = (type = 'Credit Card') => {
        const newCard = {
            id: Date.now(),
            cardType: type, // 'Credit Card' or 'Debit Card'
            cardNumber: '', // Last 4 digits or full for logic (frontend stores full until submit? Reqs say masked. I'll store full for validation then mask on submit/display)
            cardHolderName: '',
            bankName: '',
            expiryDate: '', // MM/YY

            // Credit specific
            creditLimit: '',
            currentOutstanding: '',
            billingDate: '',
            dueDate: '',

            // Debit specific
            dailyLimit: ''
        };
        updateData([...cards, newCard]);
    };

    const handleRemoveCard = (id) => {
        updateData(cards.filter(c => c.id !== id));
    };

    const handleChange = (id, field, value) => {
        const newCards = cards.map(c => {
            if (c.id === id) return { ...c, [field]: value };
            return c;
        });
        updateData(newCards);

        if (touched[`${id}-${field}`]) {
            setErrors(prev => ({ ...prev, [`${id}-${field}`]: validateField(field, value, cards.find(c => c.id === id)?.cardType) }));
        }
    };

    const handleBlur = (id, field, value) => {
        const card = cards.find(c => c.id === id);
        setTouched(prev => ({ ...prev, [`${id}-${field}`]: true }));
        setErrors(prev => ({ ...prev, [`${id}-${field}`]: validateField(field, value, card?.cardType) }));
    };

    const validateField = (name, value, type) => {
        let error = "";
        switch (name) {
            case 'cardNumber':
                if (!value || value.length < 16) error = "Enter valid 16-digit number";
                break;
            case 'cardHolderName':
                if (!value) error = "Required";
                break;
            case 'bankName':
                if (!value) error = "Required";
                break;
            case 'expiryDate':
                if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value)) error = "Format MM/YY";
                break;
            case 'creditLimit':
                if (type === 'Credit Card' && (!value || value <= 0)) error = "Required";
                break;
            case 'dueDate':
                if (type === 'Credit Card' && (!value)) error = "Required";
                break;
            default: break;
        }
        return error;
    };

    const handleContinue = () => {
        if (hasCards === 'no') {
            onNext();
            return;
        }

        if (hasCards === 'yes' && cards.length === 0) {
            // Must add at least one card if they said yes, or switch to no
            alert("Please add at least one card or select 'No'.");
            return;
        }

        const newErrors = {};
        let hasError = false;

        cards.forEach(card => {
            const fieldsCheck = ['cardNumber', 'cardHolderName', 'bankName', 'expiryDate'];
            if (card.cardType === 'Credit Card') {
                fieldsCheck.push('creditLimit', 'dueDate');
            }

            fieldsCheck.forEach(f => {
                const err = validateField(f, card[f], card.cardType);
                if (err) {
                    newErrors[`${card.id}-${f}`] = err;
                    hasError = true;
                }
            });
        });

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        onNext();
    };

    // Initial Question View
    if (hasCards === null) {
        return (
            <div className="p-8 text-center min-h-[400px] flex flex-col items-center justify-center animate-fadeIn">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <CreditCard className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Do you have any Credit or Debit Cards?</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Tracking your cards helps in monitoring expenses, due dates, and maintaining a healthy credit score.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => { setHasCards('yes'); handleAddCard('Credit Card'); }}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        Yes, I do
                    </button>
                    <button
                        onClick={() => { setHasCards('no'); updateData([]); }}
                        className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                        No, Skip
                    </button>
                </div>
                <button onClick={onBack} className="mt-8 text-gray-400 hover:text-gray-600 text-sm font-medium">
                    Back to Bank Accounts
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Card Details</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleAddCard('Credit Card')}
                        className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
                    >
                        <Plus className="w-3 h-3 mr-1" /> Credit Card
                    </button>
                    <button
                        onClick={() => handleAddCard('Debit Card')}
                        className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                    >
                        <Plus className="w-3 h-3 mr-1" /> Debit Card
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {hasCards === 'yes' && cards.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-400">No cards added yet.</p>
                    </div>
                )}

                {cards.map((card, index) => (
                    <div key={card.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group animate-slideUp">
                        {/* Card Header with Type Gradient */}
                        <div className={`px-5 py-3 flex justify-between items-center ${card.cardType === 'Credit Card' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-gray-700 to-gray-900'}`}>
                            <div className="flex items-center gap-2 text-white">
                                <CreditCard className="w-4 h-4" />
                                <span className="font-semibold text-sm tracking-wide">{card.cardType}</span>
                            </div>
                            <button onClick={() => handleRemoveCard(card.id)} className="text-white/60 hover:text-white transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Card Number */}
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Card Number</label>
                                <input
                                    type="text"
                                    maxLength={16}
                                    placeholder="0000 0000 0000 0000"
                                    value={card.cardNumber}
                                    onChange={(e) => handleChange(card.id, 'cardNumber', e.target.value.replace(/\D/g, ''))}
                                    onBlur={(e) => handleBlur(card.id, 'cardNumber', e.target.value)}
                                    className={`w-full px-3 py-2 rounded-lg border focus:ring-1 focus:ring-blue-500 outline-none font-mono text-lg tracking-widest ${errors[`${card.id}-cardNumber`] ? 'border-red-300' : 'border-gray-200'}`}
                                />
                                {errors[`${card.id}-cardNumber`] && <p className="text-red-500 text-xs">{errors[`${card.id}-cardNumber`]}</p>}
                            </div>

                            {/* Bank Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Name</label>
                                <select
                                    value={card.bankName}
                                    onChange={(e) => handleChange(card.id, 'bankName', e.target.value)}
                                    onBlur={(e) => handleBlur(card.id, 'bankName', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white"
                                >
                                    <option value="">Select Bank</option>
                                    {BANK_NAMES.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>

                            {/* Card Holder */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Card Holder Name</label>
                                <input
                                    type="text"
                                    placeholder="NAME ON CARD"
                                    value={card.cardHolderName}
                                    onChange={(e) => handleChange(card.id, 'cardHolderName', e.target.value.toUpperCase())}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200"
                                />
                            </div>

                            {/* Expiry */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    value={card.expiryDate}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/\D/g, '');
                                        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
                                        handleChange(card.id, 'expiryDate', val);
                                    }}
                                    className={`w-full px-3 py-2 rounded-lg border ${errors[`${card.id}-expiryDate`] ? 'border-red-300' : 'border-gray-200'}`}
                                />
                            </div>

                            {/* Credit Card Specific Fields */}
                            {card.cardType === 'Credit Card' && (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Credit Limit (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="50000"
                                            value={card.creditLimit}
                                            onChange={(e) => handleChange(card.id, 'creditLimit', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Billing Day</label>
                                        <select
                                            value={card.billingDate}
                                            onChange={(e) => handleChange(card.id, 'billingDate', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200"
                                        >
                                            <option value="">Select Day (1-31)</option>
                                            {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Due Day</label>
                                        <select
                                            value={card.dueDate}
                                            onChange={(e) => handleChange(card.id, 'dueDate', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200"
                                        >
                                            <option value="">Select Day (1-31)</option>
                                            {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Debit Card Specific */}
                            {card.cardType === 'Debit Card' && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Daily Limit (Optional)</label>
                                    <input
                                        type="number"
                                        placeholder="20000"
                                        value={card.dailyLimit}
                                        onChange={(e) => handleChange(card.id, 'dailyLimit', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
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
                    Continue to Budget
                </button>
            </div>
        </div>
    );
};

export default CardDetails;
