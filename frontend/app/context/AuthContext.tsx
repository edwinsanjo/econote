
'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('x-auth-token');
      if (storedToken) {
        setToken(storedToken);
        await fetchUser(storedToken);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(data);
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  const login = async (userData: any) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, userData);
      localStorage.setItem('x-auth-token', data.token);
      setToken(data.token);
      setUser(data);
      router.push('/');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, userData);
      // Removed auto-login logic
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('x-auth-token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
