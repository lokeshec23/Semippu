import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, IndianRupee } from 'lucide-react';

const StatCard = ({ title, amount, trend, trendType, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendType === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trendType === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {trend}
                </span>
            )}
        </div>
        <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{amount.toLocaleString()}</h3>
    </div>
);

const FinancialOverview = () => {
    // Mock data for now, ideally fetched via API
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Balance"
                amount={125000}
                trend="+12%"
                trendType="up"
                icon={Wallet}
                color="bg-blue-600"
            />
            <StatCard
                title="Monthly Spending"
                amount={45200}
                trend="+5%"
                trendType="down" // spending up is bad usually
                icon={ArrowDownRight}
                color="bg-purple-600"
            />
            <StatCard
                title="Monthly Savings"
                amount={25000}
                trend="+8%"
                trendType="up"
                icon={IndianRupee}
                color="bg-green-600" // Money saved
            />
            <StatCard
                title="Credit Utilization"
                amount={15} // this acts as % here
                trend="-2%"
                trendType="up" // lower utilization is good
                icon={TrendingUp}
                color="bg-orange-500"
            />
        </div>
    );
};

export default FinancialOverview;
