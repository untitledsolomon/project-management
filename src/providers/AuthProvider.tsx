"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/hooks/useAuthStore';

const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setOrg, setRole, setLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata.full_name,
          avatar_url: session.user.user_metadata.avatar_url,
        });

        const { data: profile } = await supabase
          .from('users')
          .select('org_id, role, organisations(id, name, logo_url)')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setRole(profile.role as 'owner' | 'admin' | 'member' | 'guest');
          if (profile.organisations) {
            const orgData = profile.organisations as unknown as { id: string; name: string; logo_url?: string };
            setOrg(orgData);
          }
        }
      } else {
        setUser(null);
        setOrg(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setOrg, setRole, setLoading]);

  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
