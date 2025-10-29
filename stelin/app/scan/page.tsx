"use client";

import React, { useState, useCallback, useMemo } from 'react';
import Navbar from '../_components/navbar';
import { FaFileUpload, FaCloudUploadAlt, FaSpinner, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaCamera, FaLightbulb } from 'react-icons/fa';

// --- MAIN COMPONENT ---
export default function XRayAnalyzer() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<'TB Indication' | 'Low Risk' | 'Error' | null>(null);
    const [resultConfidence, setResultConfidence] = useState<number | null>(null);

    // --- Handlers ---

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult(null); // Reset result on new file selection
            setResultConfidence(null);
        } else {
            setSelectedFile(null);
            setPreviewUrl(null);
            alert("Please select a valid image file (PNG, JPG, DICOM simulation).");
        }
    };

    const handleUploadAndAnalyze = () => {
        if (!selectedFile) {
            alert("Please upload a Chest X-Ray image first.");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisResult(null);

        // --- AI Model Simulation (Mock Function) ---
        setTimeout(() => {
            // Simulate AI decision logic (e.g., 60% chance of Low Risk, 30% chance of TB Indication, 10% chance of Error)
            const random = Math.random();
            let result: 'TB Indication' | 'Low Risk' | 'Error';
            let confidence: number;

            if (random < 0.3) {
                // High Risk / TB Indication
                result = 'TB Indication';
                confidence = parseFloat((Math.random() * (0.98 - 0.75) + 0.75).toFixed(2)); // High confidence
            } else if (random < 0.9) {
                // Low Risk
                result = 'Low Risk';
                confidence = parseFloat((Math.random() * (0.70 - 0.55) + 0.55).toFixed(2)); // Moderate confidence
            } else {
                // Error (Simulation of API/Model failure)
                result = 'Error';
                confidence = 0;
            }

            setAnalysisResult(result);
            setResultConfidence(confidence);
            setIsAnalyzing(false);
        }, 3000); // 3-second simulation delay
    };
    
    // --- Helper for Result Display ---
    const renderResultDisplay = useMemo(() => {
        if (!analysisResult) return null;

        let icon: React.ReactNode;
        let title: string;
        let message: string;
        let color: string;

        switch (analysisResult) {
            case 'TB Indication':
                icon = <FaExclamationTriangle className="text-6xl text-red-600 mb-4"/>;
                title = "HIGH ALERT: Potential TB Indication Detected";
                message = `The AI model detected features consistent with possible TB (e.g., infiltrates, cavities) with a confidence level of ${resultConfidence ? (resultConfidence * 100).toFixed(0) : 0}%. **IMMEDIATE medical follow-up is mandatory.**`;
                color = "border-red-600 bg-red-50";
                break;
            case 'Low Risk':
                icon = <FaCheckCircle className="text-6xl text-green-600 mb-4"/>;
                title = "Low AI Indication of TB";
                message = `The AI model did not detect significant TB-related patterns with a confidence level of ${resultConfidence ? (resultConfidence * 100).toFixed(0) : 0}%. **However, this is not a diagnosis.** Clinical evaluation is still necessary, especially if symptoms persist.`;
                color = "border-green-600 bg-green-50";
                break;
            case 'Error':
            default:
                icon = <FaTimesCircle className="text-6xl text-gray-500 mb-4"/>;
                title = "Analysis Error";
                message = "The AI model encountered an error or the image quality was insufficient for analysis. Please try re-uploading the image or consult a radiologist directly.";
                color = "border-gray-500 bg-gray-100";
                break;
        }

        return (
            <div className={`mt-8 p-6 rounded-xl border-4 ${color} text-center shadow-lg transition-all duration-500 animate-fade-in`}>
                {icon}
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
                <p className="text-lg text-gray-700 leading-relaxed">{message}</p>
                
                {analysisResult !== 'Error' && (
                    <div className="mt-4 text-sm font-semibold text-gray-600">
                        AI Confidence Score: <span className="text-lg text-blue-700">{resultConfidence ? (resultConfidence * 100).toFixed(0) : 0}%</span>
                    </div>
                )}
                <p className="mt-4 text-xs text-gray-500">
                    Disclaimer: This is a pre-analysis tool, NOT a definitive medical diagnosis. Always rely on a certified doctor or radiologist.
                </p>
            </div>
        );
    }, [analysisResult, resultConfidence]);


    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar/>

            <div className='pt-20 p-4'>
                <div className='max-w-3xl mx-auto'>

                    {/* HEADER */}
                    <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border-b-4 border-purple-600">
                        <FaChartLine className="text-5xl text-purple-600 mb-3"/>
                        <h1 className='text-3xl font-extrabold text-gray-900'>X-Ray AI Pre-Analysis</h1>
                        <p className='text-gray-600 mt-2'>Leveraging AI for rapid screening of TB indications on Chest X-Rays (Future Development).</p>
                    </div>

                    {/* DEVELOPMENT NOTE */}
                    <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 mb-8 rounded-lg flex items-start">
                        <FaLightbulb className="text-xl mt-1 mr-3 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Future Feature (Mockup):</p>
                            <p className="text-sm">This feature is planned for advanced development after MVP. It aims to assist healthcare workers in resource-limited settings by providing an AI-driven pre-screen result.</p>
                        </div>
                    </div>


                    {/* UPLOAD SECTION */}
                    <section className="p-6 bg-white rounded-xl shadow-xl">
                        <h2 className="text-2xl font-bold text-purple-700 mb-4 border-b pb-2 flex items-center">
                            <FaCloudUploadAlt className="mr-2"/> Upload Chest X-Ray Image
                        </h2>

                        {/* File Input Area */}
                        <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center hover:border-blue-500 transition duration-200 cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {previewUrl ? (
                                <div className="flex flex-col items-center">
                                    <FaCamera className="text-4xl text-blue-500 mb-3" />
                                    <p className="text-lg font-semibold text-gray-800">{selectedFile?.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">Click to change image (JPG/PNG)</p>
                                    <img 
                                        src={previewUrl} 
                                        alt="X-Ray Preview" 
                                        className="mt-4 max-h-40 w-auto object-contain border border-gray-200 rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <FaFileUpload className="text-5xl mx-auto mb-3" />
                                    <p className="font-semibold">Drag and drop X-Ray image here, or click to browse</p>
                                    <p className="text-sm mt-1">Supported formats: JPG, PNG (Simulating DICOM support)</p>
                                </div>
                            )}
                        </div>

                        {/* Analyze Button */}
                        <button
                            onClick={handleUploadAndAnalyze}
                            disabled={!selectedFile || isAnalyzing}
                            className={`w-full mt-6 py-3 flex items-center justify-center font-bold text-white rounded-lg shadow-md transition duration-300 transform hover:scale-[1.01]
                                        ${!selectedFile || isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                        >
                            {isAnalyzing ? (
                                <span className="flex items-center">
                                    <FaSpinner className="animate-spin mr-2"/> Analyzing X-Ray...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <FaChartLine className="mr-2"/> Run AI Pre-Analysis
                                </span>
                            )}
                        </button>
                    </section>

                    {/* ANALYSIS RESULT SECTION */}
                    {analysisResult && renderResultDisplay}

                </div>
            </div>
        </div>
    );
}