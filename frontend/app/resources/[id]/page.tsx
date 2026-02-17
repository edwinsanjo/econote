
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ResourceDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [resource, setResource] = useState<any>(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (id) {
      fetchResource();
      fetchReviews();
    }
  }, [id, token]);

  const fetchResource = async () => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources/${id}`, config);
      setResource(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources/${id}/reviews`);
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert('Please login to review');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/resources/${id}/reviews`, newReview, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
      fetchResource(); // Update average rating
      setNewReview({ rating: 5, comment: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Review failed');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!resource) return <div className="p-10 text-center">Resource not found or access denied.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6">
      <div className="p-6">
        <div className="flex justify-between items-start border-b pb-4 mb-4">
            <div>
                <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
                <p className="text-gray-600 space-x-2">
                    <span>{resource.subject}</span>
                    <span>•</span>
                    <span>Sem {resource.semester}</span>
                    <span>•</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">{resource.type}</span>
                </p>
            </div>
            <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${resource.privacy === 'Private' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {resource.privacy}
                </span>
                <p className="text-sm text-gray-500 mt-1">Uploaded by {resource.uploader?.name}</p>
                <p className="text-xs text-gray-400">{new Date(resource.createdAt).toLocaleDateString()}</p>
            </div>
        </div>

        <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700">{resource.description || 'No description provided.'}</p>
        </div>

        <div className="flex gap-4 mb-8">
             <a 
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${resource.fileUrl}`} 
                target="_blank" 
                download
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold flex items-center gap-2"
            >
                Download / View File
            </a>
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
                 ★ {resource.averageRating?.toFixed(1) || '0.0'}
            </div>
        </div>

        <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Reviews</h3>
            
            {user && (
                <form onSubmit={submitReview} className="mb-8 bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold mb-2">Write a Review</h4>
                    <div className="flex gap-4 mb-2">
                        <select 
                            value={newReview.rating} 
                            onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                            className="p-2 border rounded"
                        >
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Your comment..." 
                            className="flex-1 p-2 border rounded"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                            required
                        />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((rev: any) => (
                    <div key={rev._id} className="border-b pb-2">
                        <div className="flex justify-between">
                            <span className="font-semibold">{rev.user?.name}</span>
                            <span className="text-yellow-500">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-gray-700">{rev.comment}</p>
                    </div>
                )) : (
                    <p className="text-gray-500">No reviews yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
