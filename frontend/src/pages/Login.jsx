import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
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
                const user = await response.json();

                // Save userId to localStorage
                localStorage.setItem('userId', user._id);

                // Check if user has completed onboarding
                if (user.onboarding_completed) {
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                            S
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Semippu</h1>
                    </div>
                    <p className="text-gray-500">Welcome back!</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-700 text-sm flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />{successMessage}
                        </p>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-10 ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                        }`}
                                    placeholder="john@example.com"
                                />
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs flex items-center mt-1">
                                    <AlertCircle className="w-3 h-3 mr-1" />{errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pl-10 pr-10 ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs flex items-center mt-1">
                                    <AlertCircle className="w-3 h-3 mr-1" />{errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-700 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />{errors.submit}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
