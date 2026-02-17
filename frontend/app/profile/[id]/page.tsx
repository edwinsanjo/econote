'use client';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ResourceCard from '../../components/ResourceCard';
import { motion } from 'framer-motion';
import { User, Mail, School, BookOpen } from 'lucide-react';

export default function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const { token, user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userResources, setUserResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  useEffect(() => {
    if (userId && token) {
      fetchUserProfile();
      fetchUserResources();
    }
  }, [userId, token]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserResources = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources?uploader=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserResources(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" /></div>;
  if (!profileUser) return <div className="p-20 text-center text-gray-500">User not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
                 {profileUser.profilePicture ? (
                    <img src={profileUser.profilePicture} alt={profileUser.name} className="w-full h-full object-cover" />
                ) : (
                    profileUser.name.charAt(0)
                )}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4 w-full">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profileUser.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-1">
                        <School size={16} />
                        <span>{profileUser.college}</span>
                    </div>
                </div>

                {profileUser.bio && <p className="text-gray-600 italic">"{profileUser.bio}"</p>}

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <Mail size={14} /> {profileUser.email}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <BookOpen size={14} /> {profileUser.branch} • Sem {profileUser.semester} {profileUser.year ? `• Year ${profileUser.year}` : ''}
                    </span>
                </div>
            </div>
        </div>
      </motion.div>

      {/* Uploads Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Uploads by {profileUser.name}</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">{userResources.length}</span>
        </div>

        {userResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userResources.map((res: any) => (
                <div key={res._id} className="relative group">
                    <ResourceCard resource={res} />
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No public uploads found.</p>
            </div>
        )}
      </div>
    </div>
  );
}
