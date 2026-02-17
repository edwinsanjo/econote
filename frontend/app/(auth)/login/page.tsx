
'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, User, Lock } from 'lucide-react';

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();

  const onSubmit = async (data: any) => {
    try {
      await login(data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to access your college resources</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="student@college.edu"
                    required
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    {...register('password')}
                    type="password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                    required
                />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
