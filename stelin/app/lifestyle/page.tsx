"use client";

import React from 'react';
import Navbar from '../_components/navbar';
import { FaHeartbeat, FaSearchLocation, FaSyringe, FaShieldAlt, FaMapMarkerAlt, FaClock, FaPhone } from 'react-icons/fa';

// --- DUMMY DATA: Nearest Health Facilities (Faskes) ---
const FASKES_DATA = [
    {
        name: "Cempaka Putih Community Health Center (Puskesmas)",
        address: "Jl. Cempaka Putih Raya No. 12, Central Jakarta",
        hours: "Monday - Saturday (08:00 AM - 02:00 PM WIB)",
        phone: "(021) 1234 5678",
        isPrioritized: true,
    },
    {
        name: "Persahabatan Pulmonary Hospital",
        address: "Jl. Persahabatan Raya No. 1, East Jakarta",
        hours: "Daily (24 Hours)",
        phone: "(021) 4567 8901",
        isPrioritized: true,
    },
    {
        name: "Pratama Sehat Selalu Clinic",
        address: "Jl. Jend. Sudirman Kav. 52-53, South Jakarta",
        hours: "Monday - Friday (09:00 AM - 05:00 PM WIB)",
        phone: "(021) 9876 5432",
        isPrioritized: false,
    },
];

// --- Faskes Card Component for Reusability ---
interface FaskesCardProps {
    name: string;
    address: string;
    hours: string;
    phone: string;
    isPrioritized: boolean;
}

const FaskesCard: React.FC<FaskesCardProps> = ({ name, address, hours, phone, isPrioritized }) => (
    <div className={`p-4 rounded-xl shadow-lg transition duration-300 ${isPrioritized ? 'bg-blue-100 border-l-4 border-blue-600' : 'bg-white border border-gray-200 hover:shadow-md'}`}>
        <h3 className={`text-lg font-bold ${isPrioritized ? 'text-blue-800' : 'text-gray-900'} mb-1`}>
            {name}
            {isPrioritized && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Recommended</span>}
        </h3>
        <p className="flex items-center text-sm text-gray-700 mt-2">
            <FaMapMarkerAlt className="mr-2 text-red-500" /> {address}
        </p>
        <p className="flex items-center text-sm text-gray-700 mt-1">
            <FaClock className="mr-2 text-green-600" /> {hours}
        </p>
        <p className="flex items-center text-sm text-gray-700 mt-1">
            <FaPhone className="mr-2 text-gray-500" /> {phone}
        </p>
        <a 
            href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-3 inline-block text-blue-600 font-semibold text-sm hover:underline"
        >
            Contact Now &rarr;
        </a>
    </div>
);

// --- MAIN COMPONENT ---
export default function TBEarlyReferralInfo() {
    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar/>

            <div className='pt-20 p-4'>
                <div className='max-w-3xl mx-auto'>

                    {/* HEADER */}
                    <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border-b-4 border-blue-600">
                        <FaHeartbeat className="text-5xl text-blue-600 mb-3"/>
                        <h1 className='text-3xl font-extrabold text-gray-900'>Health Guidance & Referral Info</h1>
                        <p className='text-gray-600 mt-2'>Essential information about TB and a list of recommended health facilities.</p>
                    </div>

                    {/* SECTION 1: HEALTH GUIDANCE */}
                    <section className="mb-10 p-6 bg-white rounded-xl shadow-xl">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2 flex items-center">
                            <FaShieldAlt className="mr-2"/> Understanding Tuberculosis (TB)
                        </h2>
                        
                        <div className="space-y-6 text-gray-800">
                            {/* Cause & Transmission */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center"><FaSyringe className="mr-2 text-red-500"/> Cause & Transmission</h3>
                                <p className="text-base mt-1">
                                    TB is caused by the bacterium **Mycobacterium tuberculosis**, primarily affecting the lungs. 
                                    It spreads through the air when a person with active TB coughs, sneezes, or talks, releasing droplets containing the bacteria.
                                </p>
                            </div>

                            {/* Prevention */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center"><FaShieldAlt className="mr-2 text-green-600"/> Prevention</h3>
                                <ul className="list-disc list-inside ml-4 space-y-1 mt-1">
                                    <li>Practicing proper **cough etiquette** (covering mouth and nose).</li>
                                    <li>Ensuring **good ventilation** by opening windows.</li>
                                    <li>Boosting immunity with **balanced nutrition** and exercise.</li>
                                    <li>**BCG vaccination** for infants.</li>
                                </ul>
                            </div>

                            {/* Importance of Treatment */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center"><FaHeartbeat className="mr-2 text-blue-500"/> Importance of Treatment</h3>
                                <p className="text-base mt-1">
                                    TB is **completely curable** if treatment is completed thoroughly. **Medication must be taken routinely for at least 6 months** without interruption 
                                    to prevent the bacteria from developing drug resistance (MDR-TB), which is much harder and longer to treat.
                                </p>
                            </div>
                        </div>
                    </section>
                    
                    {/* SECTION 2: REFERRAL INFORMATION */}
                    <section className="p-6 bg-white rounded-xl shadow-xl">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2 flex items-center">
                            <FaSearchLocation className="mr-2"/> Nearest Health Facilities for Check-up
                        </h2>
                        <p className="text-gray-700 mb-6">
                            If your screening result indicates a **MODERATE** or **HIGH** risk, you should immediately visit one of the nearest health facilities below for further examination (e.g., sputum test and/or Chest X-ray).
                        </p>

                        <div className="space-y-4">
                            {FASKES_DATA.map((faskes, index) => (
                                <FaskesCard 
                                    key={index}
                                    name={faskes.name}
                                    address={faskes.address}
                                    hours={faskes.hours}
                                    phone={faskes.phone}
                                    isPrioritized={faskes.isPrioritized}
                                />
                            ))}
                        </div>

                        <p className="text-sm text-gray-500 mt-6 text-center">
                            *The data above is for simulation purposes only. Please contact the respective facility for exact service hours.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}