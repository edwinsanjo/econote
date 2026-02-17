'use client';

import Link from 'next/link';
import { Book, Eye, School, Calendar, Edit, ArrowBigUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Resource {
  _id: string;
  title: string;
  subject: string;
  semester: number;
  type: string;
  privacy: string;
  uploader?: any; // strict typing can be tricky with populate, keep it flexible or use union string | object
  collegeOfOrigin: string;
  score: number;
  updatedAt: string;
}

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const { user } = useAuth();
  const isPrivate = resource.privacy === 'Private';

  // Determine if current user is the uploader
  // resource.uploader can be an ID string or an object depending on populate
  const uploaderId = typeof resource.uploader === 'string' 
    ? resource.uploader 
    : resource.uploader?._id;
  
  const isOwner = user && uploaderId === user._id;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
      {/* Stripe / Header */}
      <div className={`h-2 w-full ${isPrivate ? 'bg-red-500' : 'bg-green-500'}`} />
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPrivate ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20' : 'bg-green-50 text-green-700 ring-1 ring-green-600/20'}`}>
                {resource.privacy}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} />
                {new Date(resource.updatedAt).toLocaleDateString()}
            </span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-600 transition-colors">
            {resource.title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <Book size={14} className="text-gray-400" />
            {resource.subject} • Sem {resource.semester}
        </p>

        <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                    <School size={14} />
                    <span className="truncate max-w-[120px]">{resource.collegeOfOrigin}</span>
                </div>
                <div className="flex items-center gap-1 text-orange-600 font-bold">
                    <ArrowBigUp size={20} fill="currentColor" />
                    <span>{resource.score || 0}</span>
                </div>
            </div>
            
            <div className="flex gap-2">
                <Link 
                    href={`/resources/${resource._id}`}
                    className="flex-1 inline-flex justify-center items-center py-2.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white rounded-lg transition-colors gap-2"
                >
                    View
                    <Eye size={16} />
                </Link>
                
                {isOwner && (
                    <Link 
                        href={`/resources/edit/${resource._id}`}
                        className="inline-flex justify-center items-center px-3 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors"
                        title="Edit Resource"
                    >
                        <Edit size={16} />
                    </Link>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
