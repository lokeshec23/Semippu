export const ONBOARDING_STEPS = [
    { id: 1, title: 'Personal Info', description: 'Basic details about you' },
    { id: 2, title: 'Employment', description: 'Work and income details' },
    { id: 3, title: 'Bank Accounts', description: 'Link your accounts' },
    { id: 4, title: 'Cards', description: 'Credit & Debit cards' },
    { id: 5, title: 'Budget & Goals', description: 'Plan your finances' },
    { id: 6, title: 'Review', description: 'Confirm details' },
];

export const EMPLOYMENT_STATUS_OPTIONS = [
    'Employed', 'Self-Employed', 'Unemployed', 'Student'
];

export const BANK_NAMES = [
    'SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'Kotak', 'Bank of Baroda', 'Others'
];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
