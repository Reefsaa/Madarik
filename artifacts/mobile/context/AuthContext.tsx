import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// ─── ApiError carries an optional field name for form-level error placement ───
export class ApiError extends Error {
  field?: string;
  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ApiError';
    this.field = field;
  }
}

export interface User {
  name: string;
  email: string;
  company: string;
  mobile?: string;
  nationalId?: string;
  crNumber?: string;
  taxNumber?: string;
  industry?: string;
  address?: string;
}

export interface SignupExtras {
  nationalId?: string;
  mobile?: string;
  username?: string;
  crNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, company: string, extras?: SignupExtras) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'madarik_user_v2';

// ── API base URL ──────────────────────────────────────────────────────────────
function getApiBase(): string | null {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}`;
  return null;
}

async function apiPost(path: string, body: Record<string, string>): Promise<Response> {
  const base = getApiBase();
  if (!base) throw new Error('NO_API');
  const url = `${base}/api${path}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function apiPatch(path: string, body: Record<string, unknown>): Promise<Response> {
  const base = getApiBase();
  if (!base) throw new Error('NO_API');
  const url = `${base}/api${path}`;
  return fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val) setUser(JSON.parse(val) as User);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // ── login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string, crNumber?: string) => {
    let serverUser: User | null = null;

    try {
      const body = crNumber ? { crNumber, password } : { email, password };
      const resp = await apiPost('/auth/login', body);
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error ?? 'Invalid credentials');
      }

      serverUser = {
        name: data.user.name,
        email: data.user.email,
        company: data.user.company ?? '',
        mobile: data.user.mobile ?? '',
        nationalId: data.user.nationalId ?? '',
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.message !== 'NO_API' && !err.message.includes('fetch')) {
        throw err;
      }
      serverUser = null;
    }

    if (serverUser) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serverUser));
      setUser(serverUser);
      return;
    }

    // ── Offline / dev fallback ─────────────────────────────────────────────
    let existing: User | null = null;
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEY);
      if (val) existing = JSON.parse(val) as User;
    } catch {}

    const raw = email.includes('@') ? email.split('@')[0] : email;
    const derivedName = raw
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const fallbackUser: User = {
      name: existing?.name ?? derivedName,
      email,
      company: existing?.company ?? '',
      mobile: existing?.mobile ?? '',
      nationalId: existing?.nationalId ?? '',
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
    setUser(fallbackUser);
  }, []);

  // ── signup ───────────────────────────────────────────────────────────────
  const signup = useCallback(
    async (name: string, email: string, password: string, company: string, extras?: SignupExtras) => {
      let serverUser: User | null = null;

      try {
        const resp = await apiPost('/auth/register', {
          name, email, password, company,
          nationalId: extras?.nationalId ?? '',
          mobile:     extras?.mobile     ?? '',
          username:   extras?.username   ?? '',
          crNumber:   extras?.crNumber   ?? '',
        });
        const data = await resp.json();

        if (!resp.ok) {
          // Throw ApiError with optional field so the UI can highlight the right input
          throw new ApiError(data.error ?? 'Registration failed', data.field);
        }

        serverUser = {
          name:    data.user.name,
          email:   data.user.email,
          company: data.user.company ?? '',
        };
      } catch (err: unknown) {
        if (err instanceof ApiError) throw err; // always re-throw our typed errors
        if (err instanceof Error && err.message !== 'NO_API' && !err.message.includes('fetch')) {
          throw err;
        }
        serverUser = null;
      }

      if (serverUser) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serverUser));
        setUser(serverUser);
        return;
      }

      const fallbackUser: User = { name, email, company };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
      setUser(fallbackUser);
    },
    [],
  );

  // ── logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  // ── updateUser ────────────────────────────────────────────────────────────
  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const updated: User = { ...user, ...updates };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);

    // Best-effort sync to API
    try {
      await apiPatch('/auth/profile', { email: user.email, ...updates });
    } catch {
      // Silently ignore — local state is already updated
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
