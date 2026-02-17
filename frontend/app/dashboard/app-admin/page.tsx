
'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Building, MapPin, UserCheck } from 'lucide-react';

const AppAdminDashboard = () => {
  const { user, token } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  
  const onRegisterCollege = async (data: any) => {
    try {
        // Implement college registration logic here. 
        // For now, let's assume we are creating a 'college_admin' user who represents the college.
        // OR we need a separate 'College' model. 
        // Given complexity, let's stick to creating a user with role 'college_admin'.
        // But the prompt says "create a page for college regisitration".
        
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register-college`, data, {
             headers: { Authorization: `Bearer ${token}` }
        });
        alert('College registered successfully!');
        reset();
    } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to register college');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">App Admin Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Building size={24} className="text-blue-600" />
            Register New College
        </h2>
        <form onSubmit={handleSubmit(onRegisterCollege)} className="space-y-4 max-w-lg">
            <div>
                <label className="block text-sm font-medium mb-1">College Name</label>
                <input {...register('collegeName')} className="w-full p-2 border rounded" required />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input {...register('location')} className="w-full p-2 border rounded" required />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">Admin Name</label>
                <input {...register('name')} className="w-full p-2 border rounded" required />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">Admin Email</label>
                <input {...register('email')} type="email" className="w-full p-2 border rounded" required />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">Admin Password</label>
                <input {...register('password')} type="password" className="w-full p-2 border rounded" required />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Register College
            </button>
        </form>
      </div>
    </div>
  );
};

export default AppAdminDashboard;
