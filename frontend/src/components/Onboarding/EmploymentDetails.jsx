import React, { useState, useEffect } from 'react';
import { Building2, Briefcase, IndianRupee, Mail, AlertCircle } from 'lucide-react';
import { EMPLOYMENT_STATUS_OPTIONS } from '../../utils/constants';

const EmploymentDetails = ({ data, updateData, onNext, onBack }) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const isEmployed = ['Employed', 'Self-Employed'].includes(data?.status);
    const isUnemployed = data?.status === 'Unemployed';

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case 'status':
                if (!value) error = "Employment status is required";
                break;
            case 'companyName':
                if (isEmployed && (!value || value.length < 2)) error = "Company name is required";
                break;
            case 'monthlySalary':
                if (!value || value <= 0) error = "Valid income is required";
                break;
            case 'salaryDate':
                if (!isUnemployed && (!value || value < 1 || value > 31)) error = "Valid date (1-31) required";
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateData({ [name]: value });

        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleContinue = () => {
        const newErrors = {};
        // Validate fields
        let fieldsToValidate = ['status', 'monthlySalary'];
        if (isEmployed) fieldsToValidate.push('companyName');
        if (!isUnemployed) fieldsToValidate.push('salaryDate');

        fieldsToValidate.forEach(field => {
            const error = validateField(field, data[field]);
            if (error) newErrors[field] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            // Mark all as touched
            const newTouched = {};
            fieldsToValidate.forEach(f => newTouched[f] = true);
            setTouched(newTouched);
            return;
        }
        onNext();
    };

    return (
        <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Employment Details</h3>

            <div className="space-y-6">
                {/* Status */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Employment Status</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {EMPLOYMENT_STATUS_OPTIONS.map(status => (
                            <button
                                key={status}
                                onClick={() => {
                                    updateData({ status });
                                    setErrors(prev => ({ ...prev, status: '' }));
                                }}
                                className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all
                    ${data?.status === status
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                        : 'border-gray-200 hover:border-blue-300 text-gray-600'
                                    }
                  `}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    {errors.status && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" />{errors.status}</p>}
                </div>

                {isEmployed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Company Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="companyName"
                                    value={data?.companyName || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-10 ${errors.companyName ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`}
                                    placeholder="Company Name"
                                />
                                <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Designation</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="designation"
                                    value={data?.designation || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none pl-10"
                                    placeholder="Software Engineer"
                                />
                                <Briefcase className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Monthly Income (₹)</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="monthlySalary"
                                value={data?.monthlySalary || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-10 ${errors.monthlySalary ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`}
                                placeholder="0.00"
                            />
                            <IndianRupee className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                        {errors.monthlySalary && <p className="text-red-500 text-xs mt-1">{errors.monthlySalary}</p>}
                    </div>

                    {!isUnemployed && (
                        <div className="space-y-2 animate-fadeIn">
                            <label className="text-sm font-semibold text-gray-700">Salary Date</label>
                            <select
                                name="salaryDate"
                                value={data?.salaryDate || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border outline-none bg-white ${errors.salaryDate ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`}
                            >
                                <option value="">Select Day</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            {errors.salaryDate && <p className="text-red-500 text-xs mt-1">{errors.salaryDate}</p>}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Work Email (Optional)</label>
                    <div className="relative">
                        <input
                            type="email"
                            name="workEmail"
                            value={data?.workEmail || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none pl-10"
                            placeholder="you@company.com"
                        />
                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                </div>

                <div className="flex justify-between pt-6 mt-6 border-t border-gray-100">
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
                        Continue to Bank Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmploymentDetails;
