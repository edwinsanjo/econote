
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck } from 'lucide-react';

const VerifyOtpPage = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth(); // We might not need login if verify returns token, but we need to set state

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/verify`, {
                email,
                otp
            });
            
            // If verification successful, data contains token and user info
            // We can manually set it or ask user to login.
            // Let's manually set it via localStorage and reload/redirect, or better:
            // use a custom method in AuthContext. ideally verifyOtp
            
            // For now, let's just save to local storage and redirect to home, letting AuthContext pick it up
            localStorage.setItem('x-auth-token', data.token);
            // We should really update the context state too, but force reload works for MVP
            window.location.href = '/'; 
            
        } catch (error: any) {
            alert(error.response?.data?.message || 'Verification failed');
            setLoading(false);
        }
    };

    if (!email) return <div className="p-10 text-center">Invalid verification link.</div>;

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center"
            >
                <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck size={32} />
                </div>

                <h1 className="text-2xl font-bold mb-2">Verify Your Account</h1>
                <p className="text-gray-500 mb-8">
                    We sent a 6-digit code to <span className="font-semibold text-gray-800">{email}</span>.
                    <br />(Check your server console for the code in dev mode)
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full text-center text-3xl tracking-widest p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition font-mono"
                        placeholder="000000"
                        required
                    />

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyOtpPage;
