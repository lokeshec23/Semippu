import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Briefcase, Building, LogOut, Trash2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/onboarding');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch(`http://localhost:8000/api/user/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
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
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-500">Manage your account and preferences</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={userData?.personal_info?.full_name || ''}
                                onChange={(e) => setUserData({
                                    ...userData,
                                    personal_info: { ...userData.personal_info, full_name: e.target.value }
                                })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={userData?.personal_info?.email || ''}
                                onChange={(e) => setUserData({
                                    ...userData,
                                    personal_info: { ...userData.personal_info, email: e.target.value }
                                })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={userData?.personal_info?.phone_number || ''}
                                onChange={(e) => setUserData({
                                    ...userData,
                                    personal_info: { ...userData.personal_info, phone_number: e.target.value }
                                })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                value={userData?.personal_info?.dob || ''}
                                disabled
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Employment Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        Employment Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                            <input
                                type="text"
                                value={userData?.employment_info?.company_name || ''}
                                onChange={(e) => setUserData({
                                    ...userData,
                                    employment_info: { ...userData.employment_info, company_name: e.target.value }
                                })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Salary</label>
                            <input
                                type="number"
                                value={userData?.employment_info?.monthly_salary || ''}
                                onChange={(e) => setUserData({
                                    ...userData,
                                    employment_info: { ...userData.employment_info, monthly_salary: Number(e.target.value) }
                                })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <button
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all
              ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}
            `}
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
