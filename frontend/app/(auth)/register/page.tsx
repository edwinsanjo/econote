
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Building, GraduationCap, BookOpen, Layers } from 'lucide-react';

const RegisterPage = () => {
    const { register, handleSubmit } = useForm();
    const { register: registerUser } = useAuth(); // rename to avoid conflict with hook form
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await registerUser(data); 
            // registerUser in context currently redirects to home, we need to change that logic
            // Actually, wait. The context function `register` does the redirect. 
            // We need to modify the context function or not use it here.
            // Let's modify the context function to return the response data instead of auto-redirecting?
            // Or better: Let's just use axios here directly since the context `register` assumes immediate login which is no longer true.
            // Or I can update the context `register` to handle the new flow.
            
            // Let's update the context `register` function in the next step. 
            // But for now let's assume `registerUser` (renamed from `register` in the component) returns the email or we pass it.
        } catch (err: any) {
            console.error(err);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join your college community to share and learn</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name</label>
                             <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input {...register('name')} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="John Doe" required />
                             </div>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email</label>
                             <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input {...register('email')} type="email" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="you@college.edu" required />
                             </div>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input {...register('password')} type="password" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="••••••••" required />
                              </div>
                        </div>

                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">College Name</label>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input {...register('college')} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Institute of Technology" required />
                              </div>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Branch/Dept</label>
                              <div className="relative">
                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input {...register('branch')} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Computer Science" required />
                              </div>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Current Semester</label>
                              <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input {...register('semester')} type="number" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="3" required />
                              </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-0.5 flex justify-center items-center gap-2 mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <UserPlus size={20} />
                        )}
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-orange-600 font-semibold hover:underline">
                        Log In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
