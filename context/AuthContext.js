'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, setToken } from '@/lib/api';
import * as authApi from '@/lib/auth-api';
import * as storeApi from '@/lib/store-api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setStore(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await authApi.getProfile();
      setUser(profile);

      if (profile.role === 'admin') {
        setStore(null);
      } else {
        const storeData = profile.storeId
          ? typeof profile.storeId === 'object'
            ? profile.storeId
            : await storeApi.getStore()
          : null;
        setStore(storeData);
      }
    } catch {
      setToken(null);
      setUser(null);
      setStore(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const applyAuth = useCallback((data) => {
    if (data.accessToken) setToken(data.accessToken);
    if (data.user) setUser(data.user);
    if (data.store) setStore(data.store);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.loginUser(email, password);
    applyAuth(data);
    if (data.user?.role !== 'admin') {
      const storeData = await storeApi.getStore();
      setStore(storeData);
    } else {
      setStore(null);
    }
    return data;
  }, [applyAuth]);

  const register = useCallback(async (payload) => {
    const data = await authApi.registerUser(payload);
    applyAuth(data);
    return data;
  }, [applyAuth]);

  const logout = useCallback(async (redirectTo) => {
    const destination =
      redirectTo ?? (user?.role === 'admin' ? '/admin/login' : '/login');

    try {
      await authApi.logoutUser();
    } catch {
      // Clear local session even if API call fails
    }
    setToken(null);
    setUser(null);
    setStore(null);
    router.push(destination);
  }, [router, user]);

  const refreshStore = useCallback(async () => {
    const storeData = await storeApi.getStore();
    setStore(storeData);
    return storeData;
  }, []);

  const updateStore = useCallback(async (payload, logoFile = null) => {
    const updated = await storeApi.updateStoreSettings(payload, logoFile);
    setStore(updated);
    return updated;
  }, []);

  const value = useMemo(
    () => ({
      user,
      store,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshStore,
      updateStore,
      reloadSession: loadSession,
    }),
    [user, store, loading, login, register, logout, refreshStore, updateStore, loadSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
