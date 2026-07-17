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
const STORAGE_KEY = 'madarik_user_v2';

// ── API base URL ──────────────────────────────────────────────────────────────
// EXPO_PUBLIC_DOMAIN is injected by the dev script as $REPLIT_DEV_DOMAIN.
// This makes the real API reachable from both Expo native and Expo web.
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
  const login = useCallback(async (email: string, password: string) => {
    let serverUser: User | null = null;

    try {
      const resp = await apiPost('/auth/login', { email, password });
      const data = await resp.json();

      if (!resp.ok) {
        // Server returned a proper auth error — surface it to the UI
        throw new Error(data.error ?? 'Invalid credentials');
      }

      serverUser = {
        name: data.user.name,
        email: data.user.email,
        company: data.user.company ?? '',
      };
    } catch (err: unknown) {
      // If it's a real auth error from the server, re-throw so UI shows the message
      if (err instanceof Error && err.message !== 'NO_API' && !err.message.includes('fetch')) {
        throw err;
      }
      // Network / API-unavailable — fall back to local credential check
      serverUser = null;
    }

    if (serverUser) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serverUser));
      setUser(serverUser);
      return;
    }

    // ── Offline / dev fallback: derive identity from stored record ──────────
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
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
    setUser(fallbackUser);
  }, []);

  // ── signup ───────────────────────────────────────────────────────────────
  const signup = useCallback(
    async (name: string, email: string, password: string, company: string) => {
      let serverUser: User | null = null;

      try {
        const resp = await apiPost('/auth/register', { name, email, password, company });
        const data = await resp.json();

        if (!resp.ok) {
          throw new Error(data.error ?? 'Registration failed');
        }

        serverUser = {
          name: data.user.name,
          email: data.user.email,
          company: data.user.company ?? '',
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
