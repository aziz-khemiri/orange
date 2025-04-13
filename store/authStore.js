// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: async () => {
        await AsyncStorage.removeItem('auth-storage');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage', // مفتاح التخزين في AsyncStorage
      getStorage: () => AsyncStorage,
    }
  )
);

export default useAuthStore;
