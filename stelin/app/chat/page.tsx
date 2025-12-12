"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../_components/navbar";
import { useState } from "react";
import { FaChevronRight, FaCheckCircle, FaUser, FaStethoscope, FaChartBar, FaSpinner, FaHistory } from 'react-icons/fa';

// --- TYPE DEFINITIONS ---
interface FormData {
    age: number | '';
    gender: 'male' | 'female' | '';
}

interface SymptomState {
    prolongedCough: boolean;
    fever: boolean;
    nightSweats: boolean;
    weightLoss: boolean;
    shortnessOfBreath: boolean;
}

interface RiskFactorState {
    tbContact: 'yes' | 'no'; // Radio button choice
    healthHistory: 'hiv' | 'diabetes' | 'other' | 'none'; // Select choice
    smokingStatus: 'active' | 'passive' | 'no';
}

interface RiskResult {
    category: 'Healthy' | 'Low' | 'Moderate' | 'High';
    rekomendasi: string;
    color: string;
}

// Symptom data for Step 2
const SYMPTOMS_DATA = [
    { id: 'prolongedCough', label: 'Cough lasting > 2 weeks' },
    { id: 'fever', label: 'Intermittent/prolonged fever' },
    { id: 'nightSweats', label: 'Night sweats (unrelated to activity)' },
    { id: 'weightLoss', label: 'Drastic weight loss/Poor appetite' }
];

export default function Chat() {
    // --- STATE MANAGEMENT ---
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({ age: '', gender: '' });
    const [symptoms, setSymptoms] = useState<SymptomState>({
        prolongedCough: false, fever: false, nightSweats: false,
        weightLoss: false, shortnessOfBreath: false,
    });
    const [riskFactors, setRiskFactors] = useState<RiskFactorState>({
        tbContact: 'no',
        healthHistory: 'none',
        smokingStatus: 'no',
    });
    const [result, setResult] = useState<RiskResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- HANDLERS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? (value ? parseInt(value) : '') : value,
        }));
    };

    const handleSymptomChange = (id: keyof SymptomState) => {
        setResult(null);
        setSymptoms(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleRiskFactorChange = (name: keyof RiskFactorState, value: any) => {
        setRiskFactors(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const goToNextStep = () => {
        if (currentStep === 1) {
            if (!formData.age || formData.age < 1 || !formData.gender) {
                alert("Please fill in your Age and Gender correctly.");
                return;
            }
        }
        setCurrentStep(currentStep + 1);
    };

    const goToPrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setResult(null);
        }
    };

    // --- CORE AI LOGIC SIMULATION ---
    const analyzeSymptoms = () => {
        setIsLoading(true);
        setResult(null);

        // 1. Calculate Core Symptom Score
        const activeSymptomsCount = Object.values(symptoms).filter(v => v).length;
        let riskScore = activeSymptomsCount * 1.5;

        // 2. Add Risk Factor Score (Step 3)
        if (riskFactors.tbContact === 'yes') riskScore += 3;

        // High-risk comorbidities (HIV/Diabetes)
        if (riskFactors.healthHistory === 'hiv' || riskFactors.healthHistory === 'diabetes') riskScore += 4;

        // Smoking Status
        if (riskFactors.smokingStatus === 'active') riskScore += 1.5;
        if (riskFactors.smokingStatus === 'passive') riskScore += 0.5;

        // 3. Modify Score Based on Basic Data (Step 1)
        const age = formData.age as number;
        // Extreme ages (<5 and >65)
        if (age < 5 || age > 65) riskScore += 2;

        // --- CATEGORY DETERMINATION ---
        let risk: RiskResult;

        if (riskScore === 0) {
            risk = {
                category: 'Healthy',
                rekomendasi: 'No major symptoms or TB risk factors detected. Maintain a healthy lifestyle.',
                color: 'bg-blue-500 border-blue-600',
            };
        } else if (riskScore <= 3) {
            risk = {
                category: 'Low',
                rekomendasi: 'Low TB risk detected based on current data. Monitor your health and seek advice if symptoms persist.',
                color: 'bg-green-500 border-green-600',
            };
        } else if (riskScore <= 7) {
            risk = {
                category: 'Moderate',
                rekomendasi: 'Moderate risk. **Strongly recommended** to consult a doctor and consider further testing (e.g., Chest X-ray).',
                color: 'bg-yellow-500 border-yellow-600',
            };
        } else {
            risk = {
                category: 'High',
                rekomendasi: 'Indication of **HIGH TB Risk**. **Must seek immediate check-up** at the nearest health facility for definitive diagnosis and treatment.',
                color: 'bg-red-600 border-red-700',
            };
        }

        setTimeout(() => {
            setResult(risk);
            setIsLoading(false);
            setCurrentStep(4);
        }, 2000);
    };

    // --- RENDER FUNCTIONS: Step Indicator (KONSISTEN) ---
    const renderStepIndicator = () => {
        const steps = [
            { id: 1, label: 'Basic Data', icon: FaUser },
            { id: 2, label: 'Core Symptoms', icon: FaStethoscope },
            { id: 4, label: 'Result', icon: FaChartBar },
        ];

        return (
            <div className="flex justify-between items-center mb-10 px-4 relative">
                {/* Background line (gray) */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full" />

                {/* Progress line (green/blue) */}
                <div
                    className={`absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-400 to-green-500 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out`}
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center relative z-10 w-1/4">
                        {/* Icon Container */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform scale-100 ${currentStep > step.id ? 'bg-green-500 text-white shadow-md' :
                            currentStep === step.id ? 'bg-blue-600 text-white shadow-xl scale-110' :
                                'bg-white border-2 border-gray-300 text-gray-500 shadow-sm'
                            }`}>
                            {currentStep > step.id ? <FaCheckCircle className="text-lg" /> : <step.icon className="text-md" />}
                        </div>
                        {/* Label */}
                        <p className={`mt-2 text-xs font-semibold text-center transition-colors duration-300 ${currentStep >= step.id ? 'text-blue-800' : 'text-gray-500'
                            }`}>{step.label}</p>
                    </div>
                ))}
            </div>
        );
    };

    // --- RENDER FUNCTIONS: Step 1 (Input Font Diubah) ---
    const renderStepOne = () => (
        <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-extrabold mb-6 text-blue-800 border-b pb-3">Step 1: Basic Information</h2>

            <div className="space-y-5">
                {/* Age Input */}
                <div>
                    <label htmlFor="age" className="block text-sm font-semibold text-gray-900 mb-2">Age (Years):</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="e.g., 35"
                        // Ditambah: text-gray-900
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                </div>

                {/* Gender Select */}
                <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-gray-900 mb-2">Gender:</label>
                    <div className="relative">
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            // Ditambah: text-gray-900
                            className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-200 pr-10"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-800">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={goToNextStep}
                className="w-full mt-10 py-3 flex items-center justify-center font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300"
            >
                Next: Core Symptoms <FaChevronRight className="ml-2 w-4 h-4" />
            </button>
        </div>
    );

    // --- RENDER FUNCTIONS: Step 2 (KONSISTEN) ---
    const renderStepTwo = () => (
        <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-extrabold mb-6 text-blue-800 border-b pb-3">Step 2: Core Symptoms</h2>
            <p className="text-sm text-gray-700 mb-8">Please select all core symptoms you have experienced recently.</p>

            <div className="space-y-4">
                {SYMPTOMS_DATA.map((symptom) => (
                    <div
                        key={symptom.id}
                        className={`flex items-center p-4 rounded-xl transition duration-200 cursor-pointer border-2 ${(symptoms as any)[symptom.id] ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                        onClick={() => handleSymptomChange(symptom.id as keyof SymptomState)}
                    >
                        <FaCheckCircle className={`text-xl mr-4 ${(symptoms as any)[symptom.id] ? 'text-blue-600' : 'text-gray-500'
                            }`} />
                        <label className="text-base font-medium text-gray-900 select-none">
                            {symptom.label}
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-10 space-x-4">
                <button
                    onClick={goToPrevStep}
                    className="w-1/2 py-3 font-bold text-gray-800 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transform hover:scale-105 transition duration-300"
                >
                    &larr; Previous
                </button>
                <button
                    onClick={goToNextStep}
                    className="w-1/2 py-3 flex items-center justify-center font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300"
                >
                    Calculate Risk Factors <FaChevronRight className="ml-2 w-4 h-4" />
                </button>
            </div>
        </div>
    );

    // --- RENDER FUNCTIONS: Step 4 (Result - KONSISTEN) ---
    const renderStepFour = () => (
        <div className="p-8 rounded-xl shadow-xl border-4 border-blue-700 bg-white animate-fade-in">
            <h2 className="text-3xl font-extrabold mb-6 text-blue-900 text-center">TB Risk Analysis Result</h2>
            <p className="text-base text-gray-700 mb-8 text-center">Based on your input, here is your estimated risk:</p>

            {result && (
                <div className={`p-6 rounded-xl border-4 ${result.color.replace('bg-', 'border-')} bg-white shadow-inner`}>
                    <p className="text-lg font-semibold text-center text-gray-700 mb-2">Your Risk Category:</p>
                    <p className={`text-5xl font-extrabold text-center mt-1 mb-6 ${result.color.replace('bg-', 'text-').replace('500', '700').replace('600', '700')} drop-shadow-md`}>
                        {result.category}
                    </p>

                    <div className="border-t border-gray-200 pt-5 mt-5">
                        <p className="text-base font-semibold text-gray-900 mb-3">Detailed Recommendation:</p>
                        <p className="text-lg text-gray-800 leading-relaxed">
                            {result.rekomendasi}
                        </p>
                    </div>

                    <div className="flex flex-col space-y-4 mt-8">
                        <Link href={"/referral"} className="w-full py-3 text-center text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg transform hover:scale-105">
                            Find Nearest Health Facility &rarr;
                        </Link>
                        <button
                            onClick={() => {
                                setCurrentStep(1);
                                setResult(null);
                                // Reset all states
                                setFormData({ age: '', gender: '' });
                                setSymptoms({ prolongedCough: false, fever: false, nightSweats: false, weightLoss: false, shortnessOfBreath: false });
                                setRiskFactors({ tbContact: 'no', healthHistory: 'none', smokingStatus: 'no' });
                            }}
                            className="w-full py-3 text-center text-gray-800 font-semibold bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 transform hover:scale-105"
                        >
                            Start New Screening
                        </button>
                    </div>
                </div>
            )}
        </div>
    );


    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-gray-50 relative">
            <Navbar />

            {/* CONTENT CONTAINER: pt-20 added for Navbar clearance */}
            <div className="pt-20 p-4">
                {/* Lebar Kontainer Konsisten (max-w-3xl) */}
                <div className="max-w-3xl mx-auto">

                    {/* HEADER - KONSISTEN */}
                    <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border-b-4 border-blue-600">
                        <FaStethoscope className="text-5xl text-blue-600 mb-3" />
                        <h1 className="text-3xl font-extrabold text-gray-900">TBEarly Self-Screening AI</h1>
                        <p className="text-gray-600 mt-2">Analyze your risk more accurately in 4 easy steps.</p>
                    </div>

                    {renderStepIndicator()}

                    {/* STEP CONTENT */}
                    <div className="relative">
                        {currentStep === 1 && renderStepOne()}
                        {currentStep === 2 && renderStepTwo()}
                        {currentStep === 3 && renderStepFour()}
                    </div>

                </div>
            </div>
        </div>
    );
}