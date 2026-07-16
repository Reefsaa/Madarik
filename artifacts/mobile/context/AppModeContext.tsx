import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type AppMode = 'business' | 'personal';

interface AppModeContextType {
  mode: AppMode | null;
  isLoading: boolean;
  setMode: (m: AppMode) => Promise<void>;
  clearMode: () => Promise<void>;
}

const AppModeContext = createContext<AppModeContextType | null>(null);
const STORAGE_KEY = 'madarik_mode_v1';

export function AppModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val === 'business' || val === 'personal') setModeState(val);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const setMode = useCallback(async (m: AppMode) => {
    await AsyncStorage.setItem(STORAGE_KEY, m);
    setModeState(m);
  }, []);

  const clearMode = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setModeState(null);
  }, []);

  return (
    <AppModeContext.Provider value={{ mode, isLoading, setMode, clearMode }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const ctx = useContext(AppModeContext);
  if (!ctx) throw new Error('useAppMode must be used within AppModeProvider');
  return ctx;
}
