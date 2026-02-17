
'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Book, Calendar, Eye, Lock, Globe, Tag } from 'lucide-react';

export default function UploadPage() {
  const { register, handleSubmit, watch } = useForm();
  const { token, user } = useAuth();
  const router = useRouter();

  const fileRef = watch('file');
  const fileName = fileRef?.[0]?.name;

  const onSubmit = async (data: any) => {
    if (!token) {
        alert('You must be logged in to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('subject', data.subject);
    formData.append('semester', data.semester);
    formData.append('type', data.type);
    formData.append('year', data.year);
    formData.append('description', data.description || '');
    formData.append('privacy', data.privacy);
    formData.append('tags', data.tags);
    formData.append('file', data.file[0]);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/resources`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Resource uploaded successfully!');
      router.push('/');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Upload failed');
    }
  };

  if (!user) {
      return <div className="p-20 text-center text-gray-500">Please log in to upload resources.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
            <UploadCloud size={48} className="mx-auto mb-4 text-blue-100" />
            <h1 className="text-3xl font-bold">Share Your Knowledge</h1>
            <p className="text-blue-100 mt-2">Upload notes, papers, and projects to help your peers.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> 
                Resource Details
             </h3>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input {...register('title')} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. Data Structures Mid-Term Notes" required />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <div className="relative">
                        <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input {...register('subject')} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Computer Science" required />
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                     <select {...register('type')} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" required>
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
                    <input {...register('semester')} type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="3" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input {...register('year')} type="number" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="2024" required />
                    </div>
                </div>
             </div>
          </div>

          {/* Section 2: Details & File */}
           <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <Globe size={18} className="text-blue-600" /> 
                Visibility & Context
             </h3>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register('description')} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" rows={4} placeholder="Briefly describe what this resource covers..." />
             </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input {...register('tags')} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="calculus, exam, cheat-sheet" />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                <div className="grid grid-cols-2 gap-4">
                     <label className="relative flex flex-col p-4 bg-gray-50 border-2 border-transparent rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                        <input {...register('privacy')} type="radio" value="Public" className="peer sr-only" defaultChecked />
                        <span className="flex items-center gap-2 font-semibold text-gray-900">
                             <Globe size={18} className="text-blue-500" /> Public
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

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer relative">
                    <input 
                        {...register('file')} 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        required 
                    />
                    <UploadCloud size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                        {fileName ? fileName : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PPT, JPG supported</p>
                </div>
            </div>
          </div>

          <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5"
           >
            Upload Resource
          </button>
        </form>
      </motion.div>
    </div>
  );
}
