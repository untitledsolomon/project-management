"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/hooks/useAuthStore';

const AuthContext = createContext({});

interface ProfileData {
  org_id: string | null;
  role: 'owner' | 'admin' | 'member' | 'guest' | null;
  organisations: {
    id: string;
    name: string;
    logo_url: string | null;
  } | null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setOrg, setRole, setLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
    }, 0);

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
          const typedProfile = profile as unknown as ProfileData;
          setRole(typedProfile.role);
          if (typedProfile.organisations) {
            setOrg({
              id: typedProfile.organisations.id,
              name: typedProfile.organisations.name,
              logo_url: typedProfile.organisations.logo_url || undefined
            });
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
      clearTimeout(t);
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
