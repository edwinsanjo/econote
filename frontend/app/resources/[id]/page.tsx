
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'next/navigation';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Book, Calendar, School, Download, Share2 } from 'lucide-react';

export default function ResourceDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [resource, setResource] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState<number>(0); // 0, 1, -1

  useEffect(() => {
    if (id) {
      fetchResource();
      fetchComments();
    }
  }, [id, token]);

  const fetchResource = async () => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources/${id}`, config);
      setResource(data);
      
      // Check user vote if logged in
      if (user && data.voters) {
          // voters is a Map object from backend, might come as object in JSON
          const vote = data.voters[user._id] || 0;
          setUserVote(vote);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources/${id}/comments`);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!token) return alert('Please login to vote');
    
    // Optimistic UI update
    const voteValue = type === 'upvote' ? 1 : -1;
    let newScore = resource.score;
    let newUserVote = userVote;

    if (userVote === voteValue) {
        // Toggle off
        newUserVote = 0;
        newScore -= voteValue;
    } else {
        // Change vote or new vote
        newScore -= userVote; // Remove old vote effect
        newScore += voteValue; // Add new vote effect
        newUserVote = voteValue;
    }

    setResource({ ...resource, score: newScore });
    setUserVote(newUserVote);

    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/resources/${id}/vote`, 
            { voteType: type },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        // Sync with server response to be sure
        setResource({ ...resource, score: data.score, upvotes: data.upvotes, downvotes: data.downvotes });
        setUserVote(data.userVote || 0);
    } catch (error) {
        console.error(error);
        // Revert on error could be implemented here
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert('Please login to comment');
    if (!newComment.trim()) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/resources/${id}/comments`, 
        { content: newComment }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Comment failed');
    }
  };

    const getFileUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        
        const cleanPath = path.replace(/\\/g, '/'); // Fix Windows paths
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
        return `${baseUrl}/${cleanPath}`;
    };

    if (loading) return <div className="p-10 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto"></div></div>;
    if (!resource) return <div className="p-10 text-center">Resource not found or access denied.</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 flex gap-6">
        {/* Left Side: Voting (Desktop) */}
        <div className="hidden md:flex flex-col items-center gap-2 pt-2">
            <button 
                onClick={() => handleVote('upvote')}
                className={`p-2 rounded hover:bg-gray-100 transition ${userVote === 1 ? 'text-orange-600 bg-orange-50' : 'text-gray-400'}`}
            >
                <ArrowBigUp size={32} fill={userVote === 1 ? 'currentColor' : 'none'} />
            </button>
            <span className={`text-lg font-bold ${userVote === 1 ? 'text-orange-600' : userVote === -1 ? 'text-blue-600' : 'text-gray-700'}`}>
                {resource.score || 0}
            </span>
            <button 
                onClick={() => handleVote('downvote')}
                className={`p-2 rounded hover:bg-gray-100 transition ${userVote === -1 ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
            >
                <ArrowBigDown size={32} fill={userVote === -1 ? 'currentColor' : 'none'} />
            </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
            <div className="p-8">
                {/* Mobile Voting Header */}
                <div className="md:hidden flex items-center gap-4 mb-4 bg-gray-50 p-3 rounded-lg w-fit">
                    <button onClick={() => handleVote('upvote')} className={userVote === 1 ? 'text-orange-600' : 'text-gray-400'}>
                         <ArrowBigUp size={28} fill={userVote === 1 ? 'currentColor' : 'none'} />
                    </button>
                    <span className="font-bold">{resource.score || 0}</span>
                    <button onClick={() => handleVote('downvote')} className={userVote === -1 ? 'text-blue-600' : 'text-gray-400'}>
                         <ArrowBigDown size={28} fill={userVote === -1 ? 'currentColor' : 'none'} />
                    </button>
                </div>

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-3 text-gray-900">{resource.title}</h1>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"><Book size={14} /> {resource.subject}</span>
                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"><Calendar size={14} /> Sem {resource.semester}</span>
                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"><School size={14} /> {resource.collegeOfOrigin}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-2 border-b pb-2">About this resource</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">{resource.description || 'No description provided.'}</p>
                    
                    {/* Resource Preview Section */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-3 border-b border-gray-200 bg-gray-100 font-medium text-gray-700 flex justify-between items-center">
                            <span>Preview</span>
                            <a href={getFileUrl(resource.fileUrl)} target="_blank" className="text-xs text-orange-600 hover:underline">Open in new tab</a>
                        </div>
                        <div className="p-4 flex justify-center bg-gray-50 min-h-[200px] items-center">
                             {resource.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                <img 
                                    src={getFileUrl(resource.fileUrl)} 
                                    alt="Resource Preview" 
                                    className="max-w-full max-h-[600px] rounded shadow-sm" 
                                />
                            ) : resource.fileUrl.match(/\.pdf$/i) ? (
                                <object 
                                    data={getFileUrl(resource.fileUrl)} 
                                    type="application/pdf" 
                                    className="w-full h-[600px] rounded border border-gray-200"
                                >
                                    <div className="text-center py-10">
                                        <p>Your browser does not support PDF preview.</p>
                                        <a href={getFileUrl(resource.fileUrl)} target="_blank" className="text-orange-600 underline">Download PDF</a>
                                    </div>
                                </object>
                             ) : (
                                <div className="text-center text-gray-500 py-10">
                                    <p className="mb-2">Preview not available for this file type.</p>
                                    <Download size={48} className="mx-auto opacity-20" />
                                </div>
                             )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mb-10">
                    <a 
                        href={getFileUrl(resource.fileUrl)} 
                        target="_blank" 
                        download // Note: Cross-origin download might be ignored by browsers
                        className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 font-bold flex items-center gap-2 shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-0.5"
                    >
                        <Download size={20} />
                        Download Resource
                    </a>
                </div>

                <div className="border-t pt-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <MessageSquare size={24} />
                        Discussion ({comments.length})
                    </h3>
                    
                    {user && (
                        <form onSubmit={submitComment} className="mb-10">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Join the discussion</label>
                            <textarea
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition resize-none bg-gray-50 focus:bg-white"
                                rows={3}
                                placeholder="What are your thoughts?"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                            />
                            <div className="mt-2 flex justify-end">
                                <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition">Comment</button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-6">
                        {comments.length > 0 ? comments.map((comment: any) => (
                            <div key={comment._id} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0 flex items-center justify-center font-bold text-gray-600 overflow-hidden">
                                     {comment.user?.profilePicture ? <img src={comment.user.profilePicture} alt="" className="w-full h-full object-cover"/> : comment.user?.name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-50 p-4 rounded-xl rounded-tl-none">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-gray-900 text-sm">{comment.user?.name}</span>
                                            <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{comment.content}</p>
                                    </div>
                                    <div className="flex gap-4 mt-1 pl-2">
                                        <button className="text-xs text-gray-500 font-medium hover:text-orange-600">Reply</button>
                                        <button className="text-xs text-gray-500 font-medium hover:text-orange-600">Share</button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
