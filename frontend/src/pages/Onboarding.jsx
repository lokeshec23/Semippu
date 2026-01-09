import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Onboarding/Stepper';
import useLocalStorage from '../hooks/useLocalStorage';
import { ONBOARDING_STEPS } from '../utils/constants';

// Step Components
import PersonalInfo from '../components/Onboarding/PersonalInfo';
import EmploymentDetails from '../components/Onboarding/EmploymentDetails';
import BankAccounts from '../components/Onboarding/BankAccounts';
import CardDetails from '../components/Onboarding/CardDetails';
import BudgetSetup from '../components/Onboarding/BudgetSetup';
import ReviewConfirm from '../components/Onboarding/ReviewConfirm';
// ... import other steps as we create them

const Onboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useLocalStorage('onboarding_step', 1);
    const [completedSteps, setCompletedSteps] = useLocalStorage('onboarding_completed', []);
    const [formData, setFormData] = useLocalStorage('onboarding_data', {
        personalInfo: {},
        employmentInfo: {},
        bankAccounts: [],
        cardDetails: [],
        budget: {},
    });

    const handleNext = () => {
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps([...completedSteps, currentStep]);
        }
        if (currentStep < ONBOARDING_STEPS.length) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const updateFormData = (section, data) => {
        setFormData(prev => ({
            ...prev,
            [section]: Array.isArray(data) ? data : { ...prev[section], ...data }
        }));
    };

    // Helper function to convert camelCase to snake_case
    const toSnakeCase = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        const snakeObj = {};
        for (const [key, value] of Object.entries(obj)) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            snakeObj[snakeKey] = value;
        }
        return snakeObj;
    };

    const handleComplete = async () => {
        try {
            // 1. Create User
            const userPayload = {
                personal_info: toSnakeCase(formData.personalInfo),
                employment_info: formData.employmentInfo
                    ? toSnakeCase(formData.employmentInfo)
                    : { monthly_salary: 0, status: 'Unemployed' }, // Default safety
                onboarding_completed: true
            };

            const userResponse = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userPayload)
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                console.error("Registration error:", errorData);
                throw new Error("User registration failed");
            }
            const user = await userResponse.json();
            const userId = user._id;

            // 2. Create Bank Accounts
            for (const acc of formData.bankAccounts) {
                const bankPayload = {
                    userId,
                    ...toSnakeCase(acc)
                };
                await fetch('http://localhost:8000/api/bank-accounts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bankPayload)
                });
            }

            // 3. Create Cards
            for (const card of formData.cardDetails) {
                const cardPayload = {
                    userId,
                    ...toSnakeCase(card),
                    card_provider: 'Visa', // Auto-detect later
                    // Convert numeric fields
                    credit_limit: card.creditLimit ? Number(card.creditLimit) : undefined,
                    current_outstanding: card.currentOutstanding ? Number(card.currentOutstanding) : 0,
                    billing_date: card.billingDate ? Number(card.billingDate) : undefined,
                    due_date: card.dueDate ? Number(card.dueDate) : undefined,
                    daily_limit: card.dailyLimit ? Number(card.dailyLimit) : undefined
                };
                await fetch('http://localhost:8000/api/cards', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cardPayload)
                });
            }

            // 4. Create Budget
            if (formData.budget && formData.budget.totalBudget) {
                const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
                // format categories as dict {name: amount}
                const catDict = {};
                formData.budget.categories.forEach(c => {
                    if (c.amount > 0) catDict[c.name] = c.amount;
                });

                await fetch('http://localhost:8000/api/budgets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        month_year: currentMonth,
                        total_budget: Number(formData.budget.totalBudget),
                        savings_goal: Number(formData.budget.savingsGoal || 0),
                        categories: catDict
                    })
                });
            }

            // Success!
            setFormData({});
            setCompletedSteps([]);
            setCurrentStep(1);
            // alert("Account Setup Successful! Welcome using ID: " + userId);
            navigate('/dashboard');

        } catch (error) {
            console.error("Setup Error:", error);
            alert("Error during setup: " + error.message);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfo
                        data={formData.personalInfo}
                        updateData={(data) => updateFormData('personalInfo', data)}
                        onNext={handleNext}
                    />
                );
            case 2:
                return (
                    <EmploymentDetails
                        data={formData.employmentInfo}
                        updateData={(data) => updateFormData('employmentInfo', data)}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 3:
                return (
                    <BankAccounts
                        data={formData.bankAccounts}
                        updateData={(data) => updateFormData('bankAccounts', data)}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 4:
                return (
                    <CardDetails
                        data={formData.cardDetails}
                        updateData={(data) => updateFormData('cardDetails', data)}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 5:
                return (
                    <BudgetSetup
                        data={formData.budget}
                        updateData={(data) => updateFormData('budget', data)}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 6:
                return (
                    <ReviewConfirm
                        data={formData}
                        onBack={handleBack}
                        onComplete={handleComplete}
                        onEditStep={(step) => {
                            setCurrentStep(step);
                            window.scrollTo(0, 0);
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                <Stepper
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    onStepClick={setCurrentStep}
                />

                <div className="bg-white rounded-2xl shadow-xl mt-6 overflow-hidden min-h-[500px] border border-gray-100">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
