
'use client';

import { useAuth } from '../../context/AuthContext';

const CollegeAdminDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">College Admin Dashboard</h1>
      <p>Welcome, Admin of {user?.college}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Manage Students</h2>
            <p className="text-gray-600">View and manage students registered under your college.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">College Resources</h2>
            <p className="text-gray-600">Oversee resources uploaded by your students.</p>
        </div>
      </div>
    </div>
  );
};

export default CollegeAdminDashboard;
