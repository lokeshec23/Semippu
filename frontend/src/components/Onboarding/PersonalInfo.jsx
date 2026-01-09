import React, { useState, useEffect } from 'react';
import { Upload, User, Mail, Phone, AlertCircle } from 'lucide-react';

const PersonalInfo = ({ data, updateData, onNext }) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case 'fullName':
                if (!value || value.length < 3) error = "Name must be at least 3 characters";
                break;
            case 'phoneNumber':
                if (!/^\d{10}$/.test(value)) error = "Phone number must be exactly 10 digits";
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
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

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateData({ profilePhoto: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const isFormValid = () => {
        const requiredFields = ['fullName', 'phoneNumber', 'email'];
        const hasErrors = Object.values(errors).some(err => err);
        const hasEmptyFields = requiredFields.some(field => !data[field]);
        return !hasErrors && !hasEmptyFields;
    };

    const handleContinue = () => {
        // Validate all before proceeding
        const newErrors = {};
        ['fullName', 'phoneNumber', 'email'].forEach(field => {
            const error = validateField(field, data[field]);
            if (error) newErrors[field] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTouched({ fullName: true, phoneNumber: true, email: true });
            return;
        }

        onNext();
    };

    return (
        <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>

            <div className="space-y-6">
                {/* Photo Upload */}
                <div className="flex justify-center mb-8">
                    <div className="relative group cursor-pointer">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg bg-gray-50 flex items-center justify-center">
                            {data.profilePhoto ? (
                                <img src={data.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-gray-400" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="fullName"
                                value={data.fullName || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-10 ${errors.fullName ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`}
                                placeholder="John Doe"
                            />
                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                        {errors.fullName && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" />{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={data.email || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-10 ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`}
                                placeholder="john@example.com"
                            />
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" />{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                        <div className="relative">
                            <input
                                type="tel"
                                name="phoneNumber"
                                maxLength={10}
                                value={data.phoneNumber || ''}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    handleChange({ target: { name: 'phoneNumber', value: val } });
                                }}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-10 ${errors.phoneNumber ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`}
                                placeholder="9876543210"
                            />
                            <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                        {errors.phoneNumber && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" />{errors.phoneNumber}</p>}
                    </div>



                    {/* Gender */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={data.gender || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
                    <button
                        onClick={handleContinue}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all"
                    >
                        Continue to Employment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;
