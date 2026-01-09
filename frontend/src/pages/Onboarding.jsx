import React, { useEffect, useState } from 'react';
import Stepper from '../components/Onboarding/Stepper';
import useLocalStorage from '../hooks/useLocalStorage';
import { ONBOARDING_STEPS } from '../utils/constants';

// Step Components
import PersonalInfo from '../components/Onboarding/PersonalInfo';
import EmploymentDetails from '../components/Onboarding/EmploymentDetails';
// ... import other steps as we create them

const Onboarding = () => {
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
            [section]: { ...prev[section], ...data }
        }));
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
                return <div className="p-8 text-center">Step 3: Bank Accounts (Coming Soon) <button onClick={handleNext} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Next</button></div>;
            case 4:
                return <div className="p-8 text-center">Step 4: Card Details (Coming Soon) <button onClick={handleNext} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Next</button></div>;
            case 5:
                return <div className="p-8 text-center">Step 5: Budget (Coming Soon) <button onClick={handleNext} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Next</button></div>;
            case 6:
                return <div className="p-8 text-center">Step 6: Review (Coming Soon)</div>;
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
