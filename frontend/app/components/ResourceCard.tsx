
import Link from 'next/link';
import { Book, FileText, Download, Eye, School, Calendar, Star } from 'lucide-react';

interface Resource {
  _id: string;
  title: string;
  subject: string;
  semester: number;
  type: string;
  privacy: string;
  uploader?: {
    name: string;
    college?: string;
  };
  collegeOfOrigin: string;
  averageRating: number;
  updatedAt: string;
}

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const isPrivate = resource.privacy === 'Private';

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

        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
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
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={14} fill="currentColor" />
                    <span>{resource.averageRating?.toFixed(1) || '0.0'}</span>
                </div>
            </div>
            
            <Link 
                href={`/resources/${resource._id}`}
                className="w-full mt-2 inline-flex justify-center items-center py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors gap-2"
            >
                View Details
                <Eye size={16} />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
