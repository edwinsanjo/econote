
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ResourceCard from '../components/ResourceCard';
import { motion } from 'framer-motion';
import { User, Mail, School, BookOpen, Trash2 } from 'lucide-react';

export default function Profile() {
  const { user, token } = useAuth();
  const [myResources, setMyResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchMyResources();
    }
  }, [user, token]);

  const fetchMyResources = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter logic assumes backend returns simple user ID or object.
      // Adjusting to handle both cases safely
      const mine = data.filter((res: any) => 
        (res.uploader?._id === user._id) || (res.uploader === user._id) || (res.uploader?.email === user.email)
      );
      setMyResources(mine);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/resources/${resourceId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setMyResources(myResources.filter((res: any) => res._id !== resourceId));
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  }

  if (!user) return <div className="p-20 text-center text-gray-500">Please login to view profile.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user.name.charAt(0)}
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-1">
                    <School size={16} />
                    <span>{user.college}</span>
                </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                 <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Mail size={14} /> {user.email}
                 </span>
                 <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <BookOpen size={14} /> {user.branch} • Sem {user.semester}
                 </span>
            </div>
        </div>
      </motion.div>

      {/* Uploads Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Uploads</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">{myResources.length}</span>
        </div>

        {loading ? (
             <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        ) : myResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myResources.map((res: any) => (
                <div key={res._id} className="relative group">
                    <ResourceCard resource={res} />
                    <button 
                        onClick={() => handleDelete(res._id)}
                        className="absolute top-4 right-4 bg-white/90 p-2 text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200"
                        title="Delete Resource"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg mb-4">You haven't uploaded any resources yet.</p>
                <Link href="/upload" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition">
                    Upload Your First Note
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}
