
'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Building, MapPin, User, Mail, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const RegisterCollegePage = () => {
    const [formData, setFormData] = useState({
        collegeName: '',
        location: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/colleges/request`, formData);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-140px)] p-4">
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-green-100"
                >
                    <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for registering <strong>{formData.collegeName}</strong>. 
                        Your request has been sent to our administrators for verification. 
                        You will receive an email once your college is approved.
                    </p>
                    <Link href="/" className="inline-block w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
                        Return Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)] py-10 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-6">
                        <Building size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Register Your College</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Join the Econote network. Submit your college details for verification and get access to a dedicated admin dashboard.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">College Name</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="collegeName"
                                    value={formData.collegeName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="e.g. Stanford University"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="City, State"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Admin Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="adminName"
                                    value={formData.adminName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        name="adminEmail"
                                        value={formData.adminEmail}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        placeholder="admin@college.edu"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        name="adminPassword"
                                        value={formData.adminPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        placeholder="Create a strong password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 text-lg"
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterCollegePage;
