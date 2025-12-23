"use client";

import React, { useState, useCallback, useMemo } from 'react';
import Navbar from '../_components/navbar';
import { predictBrainTumor } from '../_components/axios';
import { FaFileUpload, FaCloudUploadAlt, FaSpinner, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaCamera, FaLightbulb } from 'react-icons/fa';

interface BrainTumorResult {
  success: boolean;
  prediction: string;
  confidence: number;
  all_predictions: {
    [key: string]: number;
  };
  error?: string;
}

// --- MAIN COMPONENT ---
export default function XRayAnalyzer() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [resultConfidence, setResultConfidence] = useState<number | null>(null);
    const [allPredictions, setAllPredictions] = useState<{ [key: string]: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // --- Handlers ---

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult(null); // Reset result on new file selection
            setResultConfidence(null);
            setAllPredictions(null);
            setError(null);
        } else {
            setSelectedFile(null);
            setPreviewUrl(null);
            alert("Please select a valid image file (PNG, JPG).");
        }
    };

    const handleUploadAndAnalyze = async () => {
        if (!selectedFile) {
            alert("Please upload an image first.");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisResult(null);
        setError(null);

        try {
            const result: BrainTumorResult = await predictBrainTumor(selectedFile);
            
            if (result.success) {
                setAnalysisResult(result.prediction);
                setResultConfidence(result.confidence);
                setAllPredictions(result.all_predictions);
            } else {
                setError(result.error || 'Analysis failed');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to analyze image. Please try again.');
            setAnalysisResult('Error');
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    // --- Helper for Result Display ---
    const renderResultDisplay = useMemo(() => {
        if (!analysisResult) return null;

        let icon: React.ReactNode;
        let title: string;
        let message: string;
        let color: string;

        const tumorClassifications: { [key: string]: { severity: 'high' | 'medium' | 'low'; icon: React.ReactNode; message: string } } = {
            'Glioma': {
                severity: 'high',
                icon: <FaExclamationTriangle className="text-6xl text-red-600 mb-4" />,
                message: 'Glioma detected - a type of brain tumor originating from glial cells. IMMEDIATE medical consultation is mandatory.'
            },
            'Meningioma': {
                severity: 'medium',
                icon: <FaExclamationTriangle className="text-6xl text-orange-600 mb-4" />,
                message: 'Meningioma detected - a tumor of the meninges (brain protective membrane). Medical evaluation is required.'
            },
            'Pituitary': {
                severity: 'medium',
                icon: <FaExclamationTriangle className="text-6xl text-yellow-600 mb-4" />,
                message: 'Pituitary tumor detected - a tumor of the pituitary gland. Professional medical assessment is necessary.'
            },
            'No Tumor': {
                severity: 'low',
                icon: <FaCheckCircle className="text-6xl text-green-600 mb-4" />,
                message: 'No tumor detected in the MRI scan. However, this is not a definitive diagnosis. Clinical evaluation is still recommended.'
            },
            'Error': {
                severity: 'low',
                icon: <FaTimesCircle className="text-6xl text-gray-500 mb-4" />,
                message: 'The AI model encountered an error or the image quality was insufficient for analysis.'
            }
        };

        const classification = tumorClassifications[analysisResult] || tumorClassifications['Error'];

        const colorMap = {
            high: 'border-red-600 bg-red-50',
            medium: 'border-orange-600 bg-orange-50',
            low: analysisResult === 'No Tumor' ? 'border-green-600 bg-green-50' : 'border-gray-500 bg-gray-100'
        };

        return (
            <div className={`mt-8 p-6 rounded-xl border-4 ${colorMap[classification.severity]} text-center shadow-lg transition-all duration-500 animate-fade-in`}>
                {classification.icon}
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{analysisResult}</h3>
                <p className="text-lg text-gray-700 leading-relaxed">{classification.message}</p>
                
                {analysisResult !== 'Error' && (
                    <div className="mt-4">
                        <div className="text-sm font-semibold text-gray-600 mb-3">
                            AI Confidence Score: <span className="text-lg text-blue-700">{resultConfidence ? (resultConfidence * 100).toFixed(1) : 0}%</span>
                        </div>

                        {allPredictions && (
                            <div className="bg-white rounded-lg p-4 mt-4">
                                <p className="font-bold text-gray-700 mb-2">Prediction Breakdown:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(allPredictions).map(([className, score]) => (
                                        <div key={className} className="text-left text-sm">
                                            <p className="font-semibold text-gray-700">{className}</p>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                    style={{width: `${score * 100}%`}}
                                                ></div>
                                            </div>
                                            <p className="text-gray-500">{(score * 100).toFixed(1)}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <p className="mt-4 text-xs text-gray-500">
                    Disclaimer: This is a pre-analysis tool, NOT a definitive medical diagnosis. Always rely on a certified doctor or radiologist.
                </p>
            </div>
        );
    }, [analysisResult, resultConfidence, allPredictions]);


    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar/>

            <div className='pt-20 p-4'>
                <div className='max-w-3xl mx-auto'>

                    {/* HEADER */}
                    <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border-b-4 border-purple-600">
                        <FaChartLine className="text-5xl text-purple-600 mb-3"/>
                        <h1 className='text-3xl font-extrabold text-gray-900'>Brain MRI & X-Ray AI Analysis</h1>
                        <p className='text-gray-600 mt-2'>AI-powered analysis of medical images including brain tumors and chest X-rays.</p>
                    </div>

                    {/* DEVELOPMENT NOTE */}
                    <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 mb-8 rounded-lg flex items-start">
                        <FaLightbulb className="text-xl mt-1 mr-3 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Important Notice</p>
                            <p className="text-sm">This tool assists healthcare professionals by providing AI-driven pre-screening. Results should always be reviewed by qualified medical personnel.</p>
                        </div>
                    </div>

                    {/* ERROR ALERT */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-lg">
                            <p className="font-bold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* UPLOAD SECTION */}
                    <section className="p-6 bg-white rounded-xl shadow-xl">
                        <h2 className="text-2xl font-bold text-purple-700 mb-4 border-b pb-2 flex items-center">
                            <FaCloudUploadAlt className="mr-2"/> Upload Medical Image
                        </h2>

                        {/* File Input Area */}
                        <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center hover:border-blue-500 transition duration-200 cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isAnalyzing}
                            />
                            {previewUrl ? (
                                <div className="flex flex-col items-center">
                                    <FaCamera className="text-4xl text-blue-500 mb-3" />
                                    <p className="text-lg font-semibold text-gray-800">{selectedFile?.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">Click to change image (JPG/PNG)</p>
                                    <img 
                                        src={previewUrl} 
                                        alt="Medical Image Preview" 
                                        className="mt-4 max-h-40 w-auto object-contain border border-gray-200 rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <FaFileUpload className="text-5xl mx-auto mb-3" />
                                    <p className="font-semibold">Drag and drop medical image here, or click to browse</p>
                                    <p className="text-sm mt-1">Supported formats: JPG, PNG (Brain MRI, Chest X-Ray)</p>
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
                                    <FaSpinner className="animate-spin mr-2"/> Analyzing Image...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <FaChartLine className="mr-2"/> Run AI Analysis
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