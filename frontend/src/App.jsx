import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import TransactionsList from './pages/TransactionsList';
import Analytics from './pages/Analytics';
import BankAccounts from './pages/BankAccounts';
import Settings from './pages/Settings';
import CardDetailView from './components/CreditCardTracker/CardDetailView';
import Layout from './components/Layout/Layout';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/onboarding" element={<Onboarding />} />


                {/* Public Routes (No Sidebar)
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/cards/:cardId" element={<CardDetailView />} />
                <Route path="/onboarding" element={<Onboarding />} /> */}

                {/* Authenticated Routes (With Sidebar) */}
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/transactions" element={<Layout><TransactionsList /></Layout>} />
                <Route path="/transactions/add" element={<Layout><AddTransaction /></Layout>} />
                <Route path="/transactions/edit/:transactionId" element={<Layout><EditTransaction /></Layout>} />
                <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
                <Route path="/bank-accounts" element={<Layout><BankAccounts /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/cards/:cardId" element={<Layout><CardDetailView /></Layout>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
