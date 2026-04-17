import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

interface Organisation {
  id: string;
  name: string;
  logo_url?: string;
}

interface AuthState {
  user: User | null;
  org: Organisation | null;
  role: 'owner' | 'admin' | 'member' | 'guest' | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setOrg: (org: Organisation | null) => void;
  setRole: (role: AuthState['role']) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  org: null,
  role: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setOrg: (org) => set({ org }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
}));
