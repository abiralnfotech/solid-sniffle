import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRead } from '../types/api';
import { api } from '../api/client';

// Simple storage simulation or use SecureStore if needed
// For now we will use a state and later maybe persist it
interface AuthContextType {
  user: UserRead | null;
  isLoading: boolean;
  login: (phoneNumber: string, fullName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRead | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (phoneNumber: string, fullName: string) => {
    setIsLoading(true);
    try {
      const newUser = await api.users.create({ phone_number: phoneNumber, full_name: fullName });
      setUser(newUser);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
