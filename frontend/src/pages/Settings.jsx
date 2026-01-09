import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Lock, LogOut, AlertCircle, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';

const Settings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setFormData({
                    name: data.name,
                    phoneNumber: data.personal_info?.phone_number || ''
                });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');

        const userId = localStorage.getItem('userId');
        try {
            const payload = {
                name: formData.name,
                personal_info: {
                    ...user.personal_info,
                    full_name: formData.name,
                    phone_number: formData.phoneNumber
                }
            };

            const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setSuccess('Profile updated successfully!');
                setEditMode(false);
                fetchUserData();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setErrors({ profile: 'Failed to update profile' });
            }
        } catch (error) {
            setErrors({ profile: 'Network error. Please try again.' });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrors({ password: 'Passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setErrors({ password: 'Password must be at least 6 characters' });
            return;
        }

        // Note: You'll need to implement password change endpoint in backend
        setErrors({ password: 'Password change feature coming soon!' });
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-500 text-sm">Manage your account</p>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-700 text-sm flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />{success}
                        </p>
                    </div>
                )}

                {/* Profile Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                        {!editMode && (
                            <button
                                onClick={() => setEditMode(true)}
                                className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg"
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {editMode ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pl-10"
                                    />
                                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={user?.email}
                                        disabled
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed pl-10"
                                    />
                                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                                <p className="text-xs text-gray-500">Email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pl-10"
                                    />
                                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                            </div>

                            {errors.profile && (
                                <p className="text-red-500 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />{errors.profile}
                                </p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditMode(false);
                                        setFormData({
                                            name: user.name,
                                            phoneNumber: user.personal_info?.phone_number || ''
                                        });
                                    }}
                                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <User className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Full Name</p>
                                    <p className="font-semibold text-gray-900">{user?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Phone Number</p>
                                    <p className="font-semibold text-gray-900">{user?.personal_info?.phone_number || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Change Password Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Current Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pl-10"
                                />
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">New Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pl-10"
                                />
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pl-10"
                                />
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />{errors.password}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Logout Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h2>
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
