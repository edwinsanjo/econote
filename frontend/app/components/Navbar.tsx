
'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, Upload, User, BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-orange-600 tracking-tight hover:opacity-80 transition">
            <div className="bg-orange-600 text-white p-1.5 rounded-lg">
                <BookOpen size={20} />
            </div>
            Econote
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                 <Link href="/" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition">
                  Browse
                </Link>
                <Link href="/upload" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition">
                  <Upload size={16} />
                  Upload
                </Link>
                <div className="h-6 w-px bg-gray-200" />
                <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition">
                  <User size={16} />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button 
                    onClick={logout} 
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition">
                  Login
                </Link>
                <Link href="/register" className="bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition transform hover:-translate-y-0.5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="p-4 space-y-3 flex flex-col">
              {user ? (
                <>
                  <Link href="/" onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-50 rounded-md font-medium text-gray-700">Browse Resources</Link>
                  <Link href="/upload" onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-50 rounded-md font-medium text-gray-700">Upload Resource</Link>
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-50 rounded-md font-medium text-gray-700">My Profile</Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="p-2 text-left hover:bg-red-50 rounded-md font-medium text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-50 rounded-md font-medium text-gray-700">Login</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="p-2 bg-orange-600 text-white rounded-md font-medium text-center">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
