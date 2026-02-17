
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Building, MapPin, User, Check, X, Loader } from 'lucide-react';

const AppAdminDashboard = () => {
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/colleges/requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRequests();
        }
    }, [token]);

    const handleApprove = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to approve ${name}?`)) return;
        
        setActionLoading(id);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/colleges/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('College approved successfully!');
            fetchRequests();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to approve');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('Are you sure you want to reject this request?')) return;

        setActionLoading(id);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/colleges/reject/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Request rejected');
            fetchRequests();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to reject');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">App Admin Dashboard</h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Building size={24} className="text-blue-600" />
                        Pending College Registrations
                    </h2>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {requests.length} Pending
                    </span>
                </div>

                {loading ? (
                     <div className="flex justify-center py-10">
                        <Loader className="animate-spin text-blue-600" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No pending requests at the moment.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req: any) => (
                            <div key={req._id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition bg-gray-50">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-gray-900">{req.collegeName}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1"><MapPin size={16} /> {req.location}</span>
                                            <span className="flex items-center gap-1"><User size={16} /> {req.adminName}</span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Email: <span className="font-medium text-gray-700">{req.adminEmail}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleApprove(req._id, req.collegeName)}
                                            disabled={actionLoading === req._id}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {actionLoading === req._id ? <Loader className="animate-spin" size={16} /> : <Check size={16} />}
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleReject(req._id)}
                                            disabled={actionLoading === req._id}
                                            className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition flex items-center gap-2 disabled:opacity-50"
                                        >
                                           {actionLoading === req._id ? <Loader className="animate-spin" size={16} /> : <X size={16} />}
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppAdminDashboard;
