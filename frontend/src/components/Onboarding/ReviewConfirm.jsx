import React, { useState } from 'react';
import { CheckCircle, Edit2, User, Briefcase, Building, CreditCard, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use'; // Need to install or implement simple hook

const ReviewConfirm = ({ data, onBack, onComplete, onEditStep }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [privacyAgreed, setPrivacyAgreed] = useState(false);

    const handleSubmit = async () => {
        if (!privacyAgreed) return;

        setIsSubmitting(true);
        try {
            await onComplete(); // Call parent submit handler
            setShowConfetti(true);
            // Navigate or show success screen is handled by parent or here?
            // Confetti usually implies success.
            // Assuming onComplete handles API and returns success.
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to create account. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const Section = ({ title, icon: Icon, step, children }) => (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-gray-800">{title}</h4>
                </div>
                <button
                    onClick={() => onEditStep(step)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-2 py-1 rounded"
                >
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                </button>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
                {children}
            </div>
        </div>
    );

    return (
        <div className="p-6 md:p-8 animate-fadeIn">
            {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Review & Confirm</h3>
                <p className="text-gray-500">Please review your details before completing setup.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Section title="Personal Info" icon={User} step={1}>
                    <p><span className="font-semibold">Name:</span> {data.personalInfo.fullName}</p>
                    <p><span className="font-semibold">Email:</span> {data.personalInfo.email}</p>
                    <p><span className="font-semibold">Phone:</span> {data.personalInfo.phoneNumber}</p>
                    <p><span className="font-semibold">DOB:</span> {data.personalInfo.dob} (Age: {data.personalInfo.age})</p>
                </Section>

                <Section title="Employment" icon={Briefcase} step={2}>
                    <p><span className="font-semibold">Status:</span> {data.employmentInfo.status}</p>
                    {!['Unemployed', 'Student'].includes(data.employmentInfo.status) && (
                        <>
                            <p><span className="font-semibold">Company:</span> {data.employmentInfo.companyName}</p>
                            <p><span className="font-semibold">Salary:</span> ₹{data.employmentInfo.monthlySalary}</p>
                        </>
                    )}
                </Section>

                <Section title="Bank Accounts" icon={Building} step={3}>
                    {data.bankAccounts.length > 0 ? (
                        <ul className="list-disc pl-4">
                            {data.bankAccounts.map((acc, i) => (
                                <li key={i}>{acc.bankName} - {acc.accountType} {acc.isPrimary ? '(Primary)' : ''}</li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-400 italic">No accounts added</p>}
                </Section>

                <Section title="Cards" icon={CreditCard} step={4}>
                    {data.cardDetails.length > 0 ? (
                        <ul className="list-disc pl-4">
                            {data.cardDetails.map((card, i) => (
                                <li key={i}>{card.cardType} - {card.bankName} (Ending {card.cardNumber.slice(-4)})</li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-400 italic">No cards added</p>}
                </Section>

                <Section title="Budget" icon={PieChart} step={5}>
                    <p><span className="font-semibold">Monthly Budget:</span> ₹{data.budget.totalBudget}</p>
                    <p><span className="font-semibold">Categories:</span> {data.budget.categories?.filter(c => c.amount > 0).length || 0} configured</p>
                </Section>
            </div>

            {/* Privacy Consent */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8">
                <label className="flex items-start cursor-pointer">
                    <input
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={(e) => setPrivacyAgreed(e.target.checked)}
                        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-blue-900">I agree to the Terms of Service and Privacy Policy</p>
                        <p className="text-xs text-blue-700 mt-1">
                            Your data is encrypted and stored securely. We do not share your personal information with third parties without your consent.
                        </p>
                    </div>
                </label>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all"
                    disabled={isSubmitting}
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!privacyAgreed || isSubmitting}
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center
                ${!privacyAgreed || isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 shadow-green-200 transform hover:-translate-y-0.5'
                        }
            `}
                >
                    {isSubmitting ? 'Setting up...' : 'Confirm & Complete Setup'}
                </button>
            </div>
        </div>
    );
};

export default ReviewConfirm;
