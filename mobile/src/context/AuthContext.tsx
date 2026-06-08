import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/api/client';

interface User {
  id: string;
  full_name: string;
  phone_number: string;
  profile_picture_url: string;
  credit_balance: number;
  is_verified: boolean;
  rating: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const userData = await apiClient.getUser();
        setUser(userData);
      }
    } catch (e) {
      console.error('Failed to load auth state', e);
    } finally {
      setIsLoading(false);
    }
  }

  const login = async (phone: string, otp: string) => {
    const response = await apiClient.verifyOtp(phone, otp);
    await AsyncStorage.setItem('userToken', response.access_token);
    const userData = await apiClient.getUser();
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
