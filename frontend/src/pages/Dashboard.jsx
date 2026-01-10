import React, { useState, useEffect } from 'react';
import { Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FinancialOverview from '../components/Dashboard/FinancialOverview';
import CreditCardsSummary from '../components/Dashboard/CreditCardsSummary';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import { API_BASE_URL } from '../utils/constants';

const Dashboard = () => {
    const [userName, setUserName] = useState('User');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/onboarding');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/user/${userId}`);
                if (response.ok) {
                    const user = await response.json();
                    setUserName(user.personal_info?.full_name || 'User');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="p-4 md:p-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                        <p className="text-gray-500">Welcome back {userName.split(' ')[0]}, here's your financial overview.</p>
                    </div>
                    <div className="flex items-center gap-4"> {/* Group buttons */}
                        <button
                            onClick={() => navigate('/settings')} // Navigate to settings
                            className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors shadow-sm"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors shadow-sm">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="space-y-8 animate-fadeIn">
                    <FinancialOverview />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <CreditCardsSummary />
                        <RecentTransactions />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
