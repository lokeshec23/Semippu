import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, IndianRupee } from 'lucide-react';

const StatCard = ({ title, amount, trend, trendType, icon: Icon, color, onClick }) => (
    <div
        onClick={onClick}
        className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''
            }`}
    >
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
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalBalance: 0,
        monthlySpending: 0,
        monthlySavings: 0,
        creditUtilization: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinancialData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                // Fetch bank accounts
                const bankResponse = await fetch(`http://localhost:8000/api/bank-accounts/${userId}`);
                const banks = bankResponse.ok ? await bankResponse.json() : [];

                // Fetch cards
                const cardsResponse = await fetch(`http://localhost:8000/api/cards/${userId}`);
                const cards = cardsResponse.ok ? await cardsResponse.json() : [];

                // Fetch budget for current month
                const currentMonth = new Date().toISOString().slice(0, 7);
                const budgetResponse = await fetch(`http://localhost:8000/api/budgets/${userId}/${currentMonth}`);
                const budget = budgetResponse.ok ? await budgetResponse.json() : null;

                // Calculate stats
                const totalBalance = banks.reduce((sum, bank) => sum + (bank.balance || 0), 0);

                const creditCards = cards.filter(c => c.card_type === 'credit');
                const totalCreditLimit = creditCards.reduce((sum, card) => sum + (card.credit_limit || 0), 0);
                const totalOutstanding = creditCards.reduce((sum, card) => sum + (card.current_outstanding || 0), 0);
                const creditUtilization = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit) * 100 : 0;

                const monthlySpending = budget?.total_budget ?
                    Object.values(budget.categories || {}).reduce((sum, val) => sum + val, 0) : 0;
                const monthlySavings = budget?.savings_goal || 0;

                setStats({
                    totalBalance,
                    monthlySpending,
                    monthlySavings,
                    creditUtilization: Math.round(creditUtilization)
                });
            } catch (error) {
                console.error('Error fetching financial data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinancialData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                        <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Balance"
                amount={stats.totalBalance}
                trend="+12%"
                trendType="up"
                icon={Wallet}
                color="bg-blue-600"
                onClick={() => navigate('/bank-accounts')}
            />
            <StatCard
                title="Monthly Budget"
                amount={stats.monthlySpending}
                trend="+5%"
                trendType="down"
                icon={ArrowDownRight}
                color="bg-purple-600"
                onClick={() => navigate('/transactions')}
            />
            <StatCard
                title="Savings Goal"
                amount={stats.monthlySavings}
                trend="+8%"
                trendType="up"
                icon={IndianRupee}
                color="bg-green-600"
            />
            <StatCard
                title="Credit Utilization"
                amount={stats.creditUtilization}
                trend="-2%"
                trendType="up"
                icon={TrendingUp}
                color="bg-orange-500"
            />
        </div>
    );
};

export default FinancialOverview;
