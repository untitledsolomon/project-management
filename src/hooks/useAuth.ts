import { useAuthStore } from './useAuthStore';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const { user, org, role, isLoading, setUser, setOrg, setRole, setLoading } = useAuthStore();

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrg(null);
    setRole(null);
  };

  return {
    user,
    org,
    role,
    isLoading,
    signOut,
  };
}
