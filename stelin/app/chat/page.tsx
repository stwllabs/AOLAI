"use client";
import Link from "next/link";
import Navbar from "../_components/navbar";
import { useState } from "react";
import { FaChevronRight, FaCheckCircle, FaUser, FaStethoscope, FaChartBar, FaSpinner } from 'react-icons/fa';
import { TbPredictionRequest } from "../_model/tbModel";
import { predictTbRisk } from "../_components/axios";

// --- TYPE DEFINITIONS ---
interface FormData {
    age: number | '';
    gender: 'male' | 'female' | '';
    height: number | '';
}

interface SymptomState {
    prolongedCough: boolean;
    fever: boolean;
    nightSweats: boolean;
    weightLoss: boolean;
}

interface RiskFactorState {
    tbContact: 'yes' | 'no'; // Radio button choice
    healthHistory: 'hiv' | 'diabetes' | 'other' | 'none'; // Select choice
    smokingStatus: 'active' | 'passive' | 'no';
}

interface RiskResult {
    category: 'Healthy' | 'Low' | 'Moderate' | 'High';
    rekomendasi: React.ReactNode;
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
    const [formData, setFormData] = useState<FormData>({ age: '', gender: '', height: '' });
    const [symptoms, setSymptoms] = useState<SymptomState>({
        prolongedCough: false,
        fever: false,
        nightSweats: false,
        weightLoss: false,
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

    const handleInputChangeHeight = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'height' ? (value ? parseInt(value) : '') : value,
        }));
    };

    const handleSymptomChange = (id: keyof SymptomState) => {
        setResult(null);
        setSymptoms(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };


    const goToNextStep = () => {
        if (currentStep === 1) {
            if (!formData.age || formData.age < 1 || !formData.height || formData.height < 1) {
                alert("Please fill in your Age and Gender correctly.");
                return;
            }
        }
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const goToPrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setResult(null);
        }
    };

    // --- CORE AI LOGIC SIMULATION ---
    const analyzeSymptoms = async () => {
        setIsLoading(true);
        setResult(null);
        setCurrentStep(3);
        try {
            const payload: TbPredictionRequest = {
                tinggi_badan_cm: Number(formData.height),            // map from your form
                umur_tahun: Number(formData.age),
                batuk_lama: symptoms.prolongedCough,
                demam: symptoms.fever,
                keringat_malam: symptoms.nightSweats,
                penurunan_berat_badan: symptoms.weightLoss,
            };
            const data = await predictTbRisk(payload);
            console.log("data received : ", data);
            setResult({
                category: data.result.kategori === "Low Risk" ? "Low" :
                    data.result.kategori === "Medium Risk" ? "Moderate" : "High",
                rekomendasi: data.result.rekomendasi_pemeriksaan_dokter
                    ? "Consult a doctor for further examination."
                    : "Monitor your symptoms and stay healthy.",
                color: data.result.kategori === "High Risk"
                    ? "bg-red-600 border-red-700"
                    : data.result.kategori === "Medium Risk"
                        ? "bg-yellow-500 border-yellow-600"
                        : "bg-green-500 border-green-600",
            });
        } catch (err) {
            console.error("Predict error", err);
            alert("Failed to analyze. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER FUNCTIONS: Step Indicator (KONSISTEN) ---
    const renderStepIndicator = () => {
        const steps = [
            { id: 1, label: 'Basic Data', icon: FaUser },
            { id: 2, label: 'Core Symptoms', icon: FaStethoscope },
            { id: 3, label: 'Result', icon: FaChartBar },
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
                    <div key={step.id} className="flex flex-col items-center relative z-10 w-1/3">
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
                    <label htmlFor="height" className="block text-sm font-semibold text-gray-900 mb-2">Height (cm):</label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChangeHeight}
                        min="1"
                        placeholder="e.g., 170"
                        // Ditambah: text-gray-900
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
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
                    onClick={analyzeSymptoms}
                    className="w-1/2 py-3 flex items-center justify-center font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300"
                >
                    Calculate Risk <FaChevronRight className="ml-2 w-4 h-4" />
                </button>
            </div>
        </div>
    );

    // --- RENDER FUNCTIONS: Step 3 (Result) ---
    const renderStepThree = () => (
        <div className="p-8 rounded-xl shadow-xl border-4 border-blue-700 bg-white animate-fade-in">
            <h2 className="text-3xl font-extrabold mb-6 text-blue-900 text-center">TB Risk Analysis Result</h2>
            <p className="text-base text-gray-700 mb-8 text-center">Based on your input, here is your estimated risk:</p>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-10 text-blue-700">
                    <FaSpinner className="animate-spin text-4xl mb-3" />
                    <p className="text-sm font-semibold">Analyzing your data...</p>
                </div>
            )}

            {!isLoading && result && (
                <div className={`p-6 rounded-xl border-4 ${result.color.replace('bg-', 'border-')} bg-white shadow-inner`}>
                    <p className="text-lg font-semibold text-center text-gray-700 mb-2">Your Risk Category:</p>
                    <p className={`text-5xl font-extrabold text-center mt-1 mb-6 ${
                        result.category === 'Healthy' ? 'text-blue-900' :
                        result.category === 'Low' ? 'text-green-800' :
                        result.category === 'Moderate' ? 'text-yellow-800' : 'text-red-800'
                    } drop-shadow-md uppercase`}>
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
                                setIsLoading(false);
                                setFormData({ age: '', gender: '', height: '' });
                                setSymptoms({ prolongedCough: false, fever: false, nightSweats: false, weightLoss: false });
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
                        <p className="text-gray-600 mt-2">Analyze your risk more accurately in 3 easy steps.</p>
                    </div>

                    {renderStepIndicator()}

                    {/* STEP CONTENT */}
                    <div className="relative">
                        {currentStep === 1 && renderStepOne()}
                        {currentStep === 2 && renderStepTwo()}
                        {currentStep === 3 && renderStepThree()}
                    </div>

                </div>
            </div>
        </div>
    );
}