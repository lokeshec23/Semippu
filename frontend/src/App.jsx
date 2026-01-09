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
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<TransactionsList />} />
                <Route path="/transactions/add" element={<AddTransaction />} />
                <Route path="/transactions/edit/:transactionId" element={<EditTransaction />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/bank-accounts" element={<BankAccounts />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/cards/:cardId" element={<CardDetailView />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
