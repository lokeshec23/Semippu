import React, { useState } from 'react';
import { Plus, Trash2, Building, CreditCard, AlertCircle } from 'lucide-react';
import { BANK_NAMES } from '../../utils/constants';

const BankAccounts = ({ data, updateData, onNext, onBack }) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Ensure there's at least one account structure if empty
    const accounts = data && data.length > 0 ? data : [{
        id: Date.now(),
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountType: 'Savings',
        branchName: '',
        isPrimary: true
    }];

    const handleAddAccount = () => {
        const newAccount = {
            id: Date.now(),
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            accountType: 'Savings',
            branchName: '',
            isPrimary: accounts.length === 0 // Make primary if it's the first one
        };
        updateData([...accounts, newAccount]);
    };

    const handleRemoveAccount = (id) => {
        const newAccounts = accounts.filter(acc => acc.id !== id);
        // If we removed the primary account, make the first available one primary
        if (newAccounts.length > 0 && accounts.find(a => a.id === id)?.isPrimary) {
            newAccounts[0].isPrimary = true;
        }
        updateData(newAccounts);
    };

    const handleChange = (id, field, value) => {
        const newAccounts = accounts.map(acc => {
            if (acc.id === id) {
                return { ...acc, [field]: value };
            }
            return acc;
        });

        // If setting isPrimary, unset others
        if (field === 'isPrimary' && value === true) {
            newAccounts.forEach(acc => {
                if (acc.id !== id) acc.isPrimary = false;
            });
        }

        updateData(newAccounts);

        // Validate on change if touched
        if (touched[`${id}-${field}`]) {
            setErrors(prev => ({
                ...prev,
                [`${id}-${field}`]: validateField(field, value)
            }));
        }
    };

    const handleBlur = (id, field, value) => {
        setTouched(prev => ({ ...prev, [`${id}-${field}`]: true }));
        setErrors(prev => ({
            ...prev,
            [`${id}-${field}`]: validateField(field, value)
        }));
    };

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case 'bankName':
                if (!value) error = "Select a bank";
                break;
            case 'accountNumber':
                if (!value) error = "Account Number is required";
                else if (!/^\d{9,18}$/.test(value)) error = "Invalid Account Number (9-18 digits)";
                break;
            case 'ifscCode':
                if (!value) error = "IFSC Code is required";
                else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) error = "Invalid IFSC Code format";
                break;
            default:
                break;
        }
        return error;
    };

    const handleContinue = () => {
        const newErrors = {};
        let hasError = false;

        accounts.forEach(acc => {
            ['bankName', 'accountNumber', 'ifscCode'].forEach(field => {
                const error = validateField(field, acc[field]);
                if (error) {
                    newErrors[`${acc.id}-${field}`] = error;
                    hasError = true;
                }
            });
        });

        if (hasError) {
            setErrors(newErrors);
            // Mark all as touched
            const newTouched = {};
            accounts.forEach(acc => {
                ['bankName', 'accountNumber', 'ifscCode'].forEach(f => newTouched[`${acc.id}-${f}`] = true);
            });
            setTouched(newTouched);
            return;
        }

        onNext();
    };

    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Bank Accounts</h3>
                <button
                    onClick={handleAddAccount}
                    className="flex items-center text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4 mr-1" /> Add Another
                </button>
            </div>

            <div className="space-y-8">
                {accounts.map((account, index) => (
                    <div key={account.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative group animate-fadeIn">
                        {accounts.length > 1 && (
                            <button
                                onClick={() => handleRemoveAccount(account.id)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}

                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                {index + 1}
                            </div>
                            <span className="font-semibold text-gray-700">Account #{index + 1}</span>
                            {account.isPrimary && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Primary</span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Bank Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Bank Name</label>
                                <select
                                    value={account.bankName}
                                    onChange={(e) => handleChange(account.id, 'bankName', e.target.value)}
                                    onBlur={(e) => handleBlur(account.id, 'bankName', e.target.value)}
                                    className={`w-full px-3 py-2.5 rounded-lg border bg-white outline-none ${errors[`${account.id}-bankName`] ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`}
                                >
                                    <option value="">Select Bank</option>
                                    {BANK_NAMES.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                                </select>
                                {errors[`${account.id}-bankName`] && <p className="text-red-500 text-xs">{errors[`${account.id}-bankName`]}</p>}
                            </div>

                            {/* Account Number */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Account Number</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={account.accountNumber}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, ''); // Numbers only
                                            handleChange(account.id, 'accountNumber', val);
                                        }}
                                        onBlur={(e) => handleBlur(account.id, 'accountNumber', e.target.value)}
                                        className={`w-full px-3 py-2.5 rounded-lg border outline-none pl-9 ${errors[`${account.id}-accountNumber`] ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`}
                                        placeholder="XXXXXXXXXXXX"
                                    />
                                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                                {errors[`${account.id}-accountNumber`] && <p className="text-red-500 text-xs">{errors[`${account.id}-accountNumber`]}</p>}
                            </div>

                            {/* IFSC Code */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">IFSC Code</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={account.ifscCode}
                                        onChange={(e) => handleChange(account.id, 'ifscCode', e.target.value.toUpperCase())}
                                        onBlur={(e) => handleBlur(account.id, 'ifscCode', e.target.value)}
                                        maxLength={11}
                                        className={`w-full px-3 py-2.5 rounded-lg border outline-none pl-9 ${errors[`${account.id}-ifscCode`] ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`}
                                        placeholder="SBIN0001234"
                                    />
                                    <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                                {errors[`${account.id}-ifscCode`] && <p className="text-red-500 text-xs">{errors[`${account.id}-ifscCode`]}</p>}
                            </div>

                            {/* Account Type */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Account Type</label>
                                <select
                                    value={account.accountType}
                                    onChange={(e) => handleChange(account.id, 'accountType', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 bg-white outline-none"
                                >
                                    <option value="Savings">Savings</option>
                                    <option value="Current">Current</option>
                                    <option value="Salary">Salary</option>
                                </select>
                            </div>

                            {/* Branch Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Branch Name (Optional)</label>
                                <input
                                    type="text"
                                    value={account.branchName}
                                    onChange={(e) => handleChange(account.id, 'branchName', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                                    placeholder="Main Branch"
                                />
                            </div>

                            {/* Is Primary Checkbox */}
                            <div className="space-y-1.5 flex items-center pt-6">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={account.isPrimary}
                                        onChange={(e) => handleChange(account.id, 'isPrimary', e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                        disabled={account.isPrimary && accounts.length > 1} // Can't uncheck if it's the only primary, must check another one
                                    />
                                    <span className="ml-2 text-sm text-gray-700 font-medium">Set as Primary Account</span>
                                </label>
                            </div>

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
                    Continue to Cards
                </button>
            </div>
        </div>
    );
};

export default BankAccounts;
