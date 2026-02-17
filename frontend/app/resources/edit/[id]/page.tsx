'use client';

import { useState, useEffect, use } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Book, Calendar, Globe, Lock, Tag, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { register, handleSubmit, reset } = useForm();
  const { token, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Unwrap params
  const resolvedParams = use(params);
  const resourceId = resolvedParams.id;

  useEffect(() => {
    if (resourceId && token) {
      fetchResource();
    }
  }, [resourceId, token]);

  const fetchResource = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources/${resourceId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      
      // Check ownership
      if (user && data.uploader._id !== user._id && data.uploader !== user._id) {
          alert("You are not authorized to edit this resource.");
          router.push('/');
          return;
      }

      // Pre-fill form
      reset({
        title: data.title,
        subject: data.subject,
        type: data.type,
        semester: data.semester,
        year: data.year,
        description: data.description,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags,
        privacy: data.privacy
      });
      setFetching(false);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch resource details.");
      router.push('/');
    }
  };

  const onSubmit = async (data: any) => {
    if (!token) return;

    setIsLoading(true);

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/resources/${resourceId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Resource updated successfully!');
      router.push('/dashboard'); // Perform redirect to dashboard or previous page
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6 transition">
        <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8 text-white text-center">
            <FileText size={48} className="mx-auto mb-4 text-orange-100" />
            <h1 className="text-3xl font-bold">Edit Resource</h1>
            <p className="text-orange-100 mt-2">Update details for your shared resource.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <FileText size={18} className="text-orange-600" /> 
                Resource Details
             </h3>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input {...register('title')} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" required />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <div className="relative">
                        <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input {...register('subject')} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" required />
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                     <select {...register('type')} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" required>
                        <option value="Notes">Notes</option>
                        <option value="Question Papers">Question Papers</option>
                        <option value="Solutions">Solutions</option>
                        <option value="Project Reports">Project Reports</option>
                        <option value="Study Material">Study Material</option>
                    </select>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <input {...register('semester')} type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input {...register('year')} type="number" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" required />
                    </div>
                </div>
             </div>
          </div>

          {/* Section 2: Details & Context */}
           <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <Globe size={18} className="text-orange-600" /> 
                Visibility & Context
             </h3>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register('description')} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" rows={4} />
             </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input {...register('tags')} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                <div className="grid grid-cols-2 gap-4">
                     <label className="relative flex flex-col p-4 bg-gray-50 border-2 border-transparent rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-200 transition has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                        <input {...register('privacy')} type="radio" value="Public" className="peer sr-only" />
                        <span className="flex items-center gap-2 font-semibold text-gray-900">
                             <Globe size={18} className="text-green-500" /> Public
                        </span>
                        <span className="text-xs text-gray-500 mt-1">Visible to everyone</span>
                     </label>
                     <label className="relative flex flex-col p-4 bg-gray-50 border-2 border-transparent rounded-xl cursor-pointer hover:bg-red-50 hover:border-red-200 transition has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                        <input {...register('privacy')} type="radio" value="Private" className="peer sr-only" />
                        <span className="flex items-center gap-2 font-semibold text-gray-900">
                             <Lock size={18} className="text-red-500" /> Private
                        </span>
                        <span className="text-xs text-gray-500 mt-1">Only my college ({user?.college})</span>
                     </label>
                </div>
            </div>
          </div>

          <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-0.5 flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
           >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                </>
            ) : (
                <>
                    <Save size={20} />
                    Save Changes
                </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
