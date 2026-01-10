import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, Sparkles, Shield } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Password strength calculation
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = calculatePasswordStrength(formData.password);
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name || formData.name.length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!acceptedTerms) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                const data = await response.json();

                // Navigate to login with success message
                navigate('/login', { state: { successMessage: 'Registration successful! Please login to continue.' } });
            } else {
                const data = await response.json();
                setErrors({ submit: data.detail || 'Registration failed' });
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Semippu</h1>
                    </div>
                    <p className="text-gray-600">Start your financial journey today</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className={`text-sm font-semibold transition-colors ${focusedField === 'name' ? 'text-blue-600' : 'text-gray-700'}`}>
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-11 ${errors.name
                                        ? 'border-red-300 focus:ring-red-100'
                                        : focusedField === 'name'
                                            ? 'border-blue-500 focus:ring-blue-100'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="John Doe"
                                />
                                <User className={`w-5 h-5 absolute left-3 top-3.5 transition-colors ${focusedField === 'name' ? 'text-blue-500' : 'text-gray-400'}`} />
                                {formData.name.length >= 3 && !errors.name && (
                                    <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-4" />
                                )}
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-xs flex items-center mt-1 animate-shake">
                                    <AlertCircle className="w-3 h-3 mr-1" />{errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className={`text-sm font-semibold transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-gray-700'}`}>
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-11 ${errors.email
                                        ? 'border-red-300 focus:ring-red-100'
                                        : focusedField === 'email'
                                            ? 'border-blue-500 focus:ring-blue-100'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="john@example.com"
                                />
                                <Mail className={`w-5 h-5 absolute left-3 top-3.5 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                                {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && !errors.email && (
                                    <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-4" />
                                )}
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs flex items-center mt-1 animate-shake">
                                    <AlertCircle className="w-3 h-3 mr-1" />{errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className={`text-sm font-semibold transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-11 pr-11 ${errors.password
                                        ? 'border-red-300 focus:ring-red-100'
                                        : focusedField === 'password'
                                            ? 'border-blue-500 focus:ring-blue-100'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <Lock className={`w-5 h-5 absolute left-3 top-3.5 transition-colors ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Meter */}
                            {formData.password && (
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-all ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Password strength: <span className="font-semibold">{strengthLabels[passwordStrength - 1] || 'Very Weak'}</span>
                                    </p>
                                </div>
                            )}

                            {errors.password && (
                                <p className="text-red-500 text-xs flex items-center mt-1 animate-shake">
                                    <AlertCircle className="w-3 h-3 mr-1" />{errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className={`text-sm font-semibold transition-colors ${focusedField === 'confirmPassword' ? 'text-blue-600' : 'text-gray-700'}`}>
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-11 pr-11 ${errors.confirmPassword
                                        ? 'border-red-300 focus:ring-red-100'
                                        : focusedField === 'confirmPassword'
                                            ? 'border-blue-500 focus:ring-blue-100'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <Shield className={`w-5 h-5 absolute left-3 top-3.5 transition-colors ${focusedField === 'confirmPassword' ? 'text-blue-500' : 'text-gray-400'}`} />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-12 top-4" />
                                )}
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs flex items-center mt-1 animate-shake">
                                    <AlertCircle className="w-3 h-3 mr-1" />{errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="space-y-2">
                            <label className="flex items-start cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => {
                                        setAcceptedTerms(e.target.checked);
                                        if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                                    }}
                                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                    I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-semibold">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">Privacy Policy</Link>
                                </span>
                            </label>
                            {errors.terms && (
                                <p className="text-red-500 text-xs flex items-center mt-1 animate-shake">
                                    <AlertCircle className="w-3 h-3 mr-1" />{errors.terms}
                                </p>
                            )}
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-shake">
                                <p className="text-red-700 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />{errors.submit}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Register;

