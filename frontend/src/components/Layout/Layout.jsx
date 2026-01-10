import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Auto-collapse sidebar on mobile devices
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsExpanded(false);
            } else {
                setIsExpanded(true);
            }
        };

        // Set initial state
        handleResize();

        // Listen for window resize
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Main Content */}
            <div
                className={`
                    transition-all duration-300 ease-in-out
                    ${isExpanded ? 'md:ml-64' : 'md:ml-16'}
                `}
            >
                {/* Mobile Header with Menu Button */}
                <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-30">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="ml-3 font-bold text-xl text-gray-900">Semippu</h1>
                </div>

                {/* Page Content */}
                <div className="pt-16 md:pt-0">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
