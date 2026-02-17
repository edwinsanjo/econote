
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceCard from './components/ResourceCard';
import { useAuth } from './context/AuthContext';
import { Search, Filter, BookOpen, Lock, ShieldCheck, Users, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';



// Debounce hook implementation within file since we don't have usage/hooks
function useDebounce(value: any, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return [debouncedValue];
}

export default function Home() {
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [filterType, setFilterType] = useState('');
  const { token, user, loading: authLoading } = useAuth(); // Now using auth loading

  const [debouncedKeyword] = useDebounce(keyword, 500);

  const fetchResources = async () => {
    setLoadingResources(true);
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const params = new URLSearchParams();
      if (debouncedKeyword) params.append('keyword', debouncedKeyword);
      if (filterType) params.append('type', filterType);
      
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources?${params.toString()}`, config);
      setResources(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    if (user) {
        fetchResources();
    }
  }, [token, user, debouncedKeyword, filterType]); // Fetch on debounce keyword or filter type change

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // fetchResources is handled by useEffect
  };

  if (authLoading) {
      return (
          <div className="flex h-[80vh] items-center justify-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
          </div>
      );
  }

  // GUEST VIEW (Restricted)
  if (!user) {
      return (
        <div className="space-y-16 py-10">
          <section className="text-center space-y-8 max-w-4xl mx-auto px-4">
               <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block bg-orange-100 text-orange-700 font-semibold px-4 py-1.5 rounded-full text-sm mb-6">
                        🎓 The #1 Platform for College Students
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
                        Unlock Your Academic <span className="text-orange-600">Potential.</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Access thousands of notes, question papers, and study materials shared by top students from your college and beyond.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                        <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-700 hover:-translate-y-1 transition text-lg">
                            Get Started Free
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition text-lg">
                            Log In
                        </Link>
                    </div>
                    <div className="mt-8">
                        <Link href="/register-college" className="text-slate-500 hover:text-orange-600 font-medium transition flex items-center justify-center gap-2 group">
                            <Building size={18} />
                            Register as a College
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-600"></span>
                        </Link>
                    </div>
                </motion.div>
          </section>

          {/* Features Grid */}
          <section className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
              <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mx-auto mb-4">
                      <Lock size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">College-Locked Content</h3>
                  <p className="text-slate-500">View notes specific to your college branch and semester, ensuring perfect syllabus alignment.</p>
              </div>
               <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4">
                      <ShieldCheck size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Verified Resources</h3>
                  <p className="text-slate-500">Quality checked notes and papers. Rate and review materials to help others find the best content.</p>
              </div>
               <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                      <Users size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Community Driven</h3>
                  <p className="text-slate-500">Join a network of thousands of students sharing knowledge and helping each other succeed.</p>
              </div>
          </section>
        </div>
      );
  }

  // LOGGED IN VIEW (Original Logic)
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/20 p-8 md:p-16 text-center">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/20 rounded-full mix-blend-overlay filter blur-3xl translate-x-1/2 translate-y-1/2" />

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl mx-auto"
        >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                Welcome back, <span className="text-orange-100">{user.name.split(' ')[0]}</span>.
            </h1>
            <p className="text-lg md:text-xl text-orange-50 mb-10 max-w-2xl mx-auto leading-relaxed">
                What are you studying today? Find the best notes for your next exam.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto bg-white/10 backdrop-blur-lg p-2 rounded-2xl border border-white/20 shadow-2xl">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-200" size={20} />
                    <input
                        type="text"
                        placeholder="Search for subjects, topics..."
                        className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-orange-200 focus:outline-none focus:placeholder-white/50 font-medium"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="relative md:w-48">
                     <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-200" size={18} />
                     <select 
                        className="w-full pl-10 pr-8 py-4 bg-transparent text-white focus:outline-none appearance-none font-medium cursor-pointer"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="" className="text-gray-900">All Types</option>
                        <option value="Notes" className="text-gray-900">Notes</option>
                        <option value="Question Papers" className="text-gray-900">Papers</option>
                        <option value="Solutions" className="text-gray-900">Solutions</option>
                        <option value="Project Reports" className="text-gray-900">Projects</option>
                    </select>
                </div>
                <button type="submit" className="bg-white text-orange-700 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 transition shadow-lg whitespace-nowrap">
                    Search
                </button>
            </form>
        </motion.div>
      </section>

      {/* Resources Grid */}
      <section className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-orange-600" />
                Latest Resources
            </h2>
            <span className="text-sm text-gray-500 font-medium">
                {resources.length} results found
            </span>
        </div>

        {loadingResources ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
            </div>
        ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((res: any) => (
                <ResourceCard key={res._id} resource={res} />
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No resources found matching your criteria.</p>
                <button 
                    onClick={() => {setKeyword(''); setFilterType(''); /* fetch triggered by effect */}}
                    className="mt-4 text-orange-600 font-medium hover:underline"
                >
                    Clear filters
                </button>
            </div>
        )}
      </section>
    </div>
  );
}
