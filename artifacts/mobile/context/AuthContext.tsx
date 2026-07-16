import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface User {
  name: string;
  email: string;
  company: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, company: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'madarik_user_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val) setUser(JSON.parse(val) as User);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const u: User = { name: 'Abdulrahman Al-Rashidi', email, company: 'Madarik Holdings' };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const signup = useCallback(
    async (name: string, email: string, _password: string, company: string) => {
      const u: User = { name, email, company };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
    },
    [],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
