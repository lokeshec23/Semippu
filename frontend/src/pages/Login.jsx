import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        // Show success message from registration
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, [location]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();

                // Save tokens to localStorage
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);
                localStorage.setItem('userId', data.user._id);

                // Check if user has completed onboarding
                if (data.user.onboarding_completed) {
                    navigate('/dashboard');
                } else {
                    navigate('/onboarding');
                }
            } else {
                const data = await response.json();
                setErrors({ submit: data.detail || 'Login failed' });
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
                    <p className="text-gray-600">Welcome back to your financial journey</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 animate-slide-down">
                        <p className="text-green-700 text-sm flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />{successMessage}
                        </p>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            {errors.password && (
                                <p className="text-red-500 text-xs flex items-center mt-1 animate-shake">
                                    <AlertCircle className="w-3 h-3 mr-1" />{errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Forgot password?
                            </Link>
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
                                    Logging in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Login;

