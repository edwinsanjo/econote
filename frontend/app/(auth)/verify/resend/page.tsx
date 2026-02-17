
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const ResendOtpPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/verify/resend`, { email });
            // Redirect to verify page with email
            router.push(`/verify?email=${encodeURIComponent(email)}`);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to resend OTP');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
            >
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <RefreshCw size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Resend Verification</h1>
                    <p className="text-gray-500">Enter your email to receive a new code</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
                         <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="student@college.edu"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                </form>

                 <p className="mt-6 text-center text-sm text-gray-500">
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                        Back to Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ResendOtpPage;
