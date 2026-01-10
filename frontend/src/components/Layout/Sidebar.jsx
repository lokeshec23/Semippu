import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    TrendingUp,
    Building2,
    CreditCard,
    Settings,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';

const Sidebar = ({ isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Receipt, label: 'Transactions', path: '/transactions' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: Building2, label: 'Bank Accounts', path: '/bank-accounts' },
        { icon: CreditCard, label: 'Cards', path: '/cards' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        // Close mobile menu after navigation
        if (window.innerWidth < 768) {
            setIsMobileOpen(false);
        }
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
                    transition-all duration-300 ease-in-out
                    ${isExpanded ? 'w-64' : 'w-16'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    {isExpanded && (
                        <h1 className="font-bold text-xl text-gray-900">Semippu</h1>
                    )}

                    {/* Desktop Toggle */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        )}
                    </button>

                    {/* Mobile Close */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-2 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNavigation(item.path)}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-3 rounded-lg
                                    transition-all duration-200
                                    ${active
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                                    ${!isExpanded && 'justify-center'}
                                `}
                                title={!isExpanded ? item.label : ''}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-600'}`} />
                                {isExpanded && (
                                    <span className={`font-medium ${active ? 'text-blue-600' : 'text-gray-700'}`}>
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
