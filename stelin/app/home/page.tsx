"use client";

import Link from "next/link";
import Navbar from "../_components/navbar";
import { FaStethoscope, FaRobot, FaChartLine, FaMapMarkerAlt, FaHospital, FaMicroscope, FaArrowRight } from 'react-icons/fa';
import Image from "next/image";

// Data for Feature Cards
const FEATURES = [
    {
        icon: FaMicroscope,
        title: "TBEarly Self-Screening AI",
        // Translation: Perform a TB risk screening in 4 quick steps. Get recommendations based on symptoms and medical history.
        description: "Perform a TB risk screening in 4 quick steps. Get recommendations based on symptoms and medical history.",
        link: "/chat",
        color: "text-blue-600",
    },
    {
    icon: FaRobot,
    title: "AI TB Chatbot",
    description: "Interact with an AI-powered chatbot to understand TB symptoms, screening results, and get health guidance instantly.",
    link: "/chatbot",
    color: "text-green-600",
    },
    {
        icon: FaHospital,
        title: "Health Guidance & Referral Info",
        // Translation: Get health guidance and find the nearest health facility (Community Health Center/Hospital) for follow-up.
        description: "Get health guidance and find the nearest health facility (Community Health Center/Hospital) for follow-up.",
        link: "/referral",
        color: "text-red-600",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 relative">
            <Navbar />
            
            <main className="pt-16">
                
                {/* 1. HERO SECTION (Modern, Bold, and Attractive Design) */}
                <section className="bg-white border-b-4 border-blue-600 shadow-xl">
                    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
                        
                        {/* Hero Text Content */}
                        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
                            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                                {/* Translation: Fast Diagnosis TB with the Power of AI */}
                                <span className="text-blue-600">Fast Diagnosis</span> TB with the Power of AI
                            </h1>
                            <p className="mt-4 text-xl text-gray-600 max-w-lg mx-auto md:mx-0">
                                {/* Translation: Get accurate Tuberculosis (TB) risk screening in seconds, powered by artificial intelligence technology. */}
                                Get accurate Tuberculosis (TB) risk screening in seconds, powered by artificial intelligence technology.
                            </p>
                            
                            {/* Primary CTA (Direct link to Screening) */}
                            <Link href="/chat" className="mt-8 inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-green-500 rounded-xl shadow-lg hover:bg-green-600 transform hover:scale-105 transition duration-300 ease-in-out group">
                                {/* Translation: Start Risk Screening Now */}
                                Start Risk Screening Now
                                <FaArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                            </Link>
                        </div>

                        {/* Hero Image/Illustration (Placeholder) */}
                        <div className="md:w-1/2 flex justify-center">
                            {/* Replace with a TB AI or Stethoscope illustration, or leave empty if you don't have a specific illustration */}
                            <div className="w-64 h-64 md:w-80 md:h-80 bg-blue-100 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
                                <FaStethoscope className="text-blue-600 text-8xl"/>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 2. FEATURES SECTION (3 Column Cards) */}
                <section className="py-16 md:py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12">
                            {/* Translation: Our Main Services */}
                            Our Main Services
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {FEATURES.map((feature, index) => (
                                <Link 
                                    key={index}
                                    href={feature.link}
                                    className="block p-6 bg-white rounded-xl shadow-2xl border-t-4 border-blue-500 hover:shadow-3xl transform hover:-translate-y-1 transition duration-300 group"
                                >
                                    <feature.icon className={`text-4xl mb-4 ${feature.color}`} />
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 mb-4">{feature.description}</p>
                                    <span className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition duration-300">
                                        {/* Translation: Start Now */}
                                        Start Now <FaArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform"/>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* 3. CTA BOTTOM (Transparency) */}
                <section className="py-16 bg-blue-50">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        {/* Translation: Important: Not a Substitute for Medical Diagnosis */}
                        <h2 className="text-3xl font-bold text-blue-800">Important: Not a Substitute for Medical Diagnosis</h2>
                        <p className="mt-4 text-lg text-gray-700">
                            {/* Translation: This service is a supporting screening tool. The results provided are NOT a definitive diagnosis. Always consult your results and health condition with a professional doctor or medical personnel. */}
                            This service is a supporting screening tool. The results provided are **NOT** a definitive diagnosis. Always consult your results and health condition with a professional doctor or medical personnel.
                        </p>
                        <Link href="/referral" className="mt-8 inline-flex items-center px-6 py-3 text-base font-bold text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300">
                            {/* Translation: Search for Nearest Clinic or Hospital */}
                            Search for Nearest Clinic or Hospital <FaMapMarkerAlt className="ml-2"/>
                        </Link>
                    </div>
                </section>

            </main>

            {/* FOOTER (Simple) */}
            <footer className="bg-gray-800 text-white py-4 mt-auto">
                <div className="max-w-6xl mx-auto text-center text-sm px-4">
                    © 2025 TBEarly AI. All rights reserved. | <Link href="#" className="hover:underline">Privacy Policy</Link>
                </div>
            </footer>
        </div>
    );
}