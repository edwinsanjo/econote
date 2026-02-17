
'use client';

import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
        if (user.role === 'app_admin') {
            router.push('/dashboard/app-admin');
        } else if (user.role === 'college_admin') {
            router.push('/dashboard/college-admin');
        } else {
            router.push('/dashboard/student'); // or just '/'
        }
    }
  }, [user, loading, router]);

  return <div className="p-10 text-center">Redirecting to dashboard...</div>;
};

export default DashboardRedirect;
