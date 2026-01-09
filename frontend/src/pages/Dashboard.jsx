import React, { useState, useEffect } from 'react';
import { Home, PieChart, CreditCard, Settings, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FinancialOverview from '../components/Dashboard/FinancialOverview';
import CreditCardsSummary from '../components/Dashboard/CreditCardsSummary';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import { API_BASE_URL } from '../utils/constants';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('home');
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
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">S</div>
                        Semippu
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {[
                        { id: 'home', label: 'Overview', icon: Home },
                        { id: 'analytics', label: 'Analytics', icon: PieChart },
                        { id: 'cards', label: 'My Cards', icon: CreditCard },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'settings') {
                                    navigate('/settings');
                                } else if (item.id === 'analytics') {
                                    navigate('/analytics');
                                } else {
                                    setActiveTab(item.id);
                                }
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm
                    ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">{userName}</h4>
                            <p className="text-xs text-gray-500">Pro Member</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                        <p className="text-gray-500">Welcome back {userName.split(' ')[0]}, here's your financial overview.</p>
                    </div>
                    <button className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors shadow-sm">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </header>

                <div className="space-y-8 animate-fadeIn">
                    <FinancialOverview />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <CreditCardsSummary />
                        <RecentTransactions />
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 md:hidden flex justify-around p-3 z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {[
                    { id: 'home', label: 'Home', icon: Home },
                    { id: 'analytics', label: 'Stats', icon: PieChart },
                    { id: 'cards', label: 'Cards', icon: CreditCard },
                    { id: 'settings', label: 'Profile', icon: User },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                    ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}
                  `}
                    >
                        <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Dashboard;
