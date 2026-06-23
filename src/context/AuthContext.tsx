import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User as AppUser } from '../types';

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to fetch profile data and merge with session metadata
  const getProfile = async (userId: string, email: string, metadata: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return {
        id: userId,
        email: email || '',
        name: profile?.name || metadata?.name || 'User',
        phone: profile?.phone || metadata?.phone || '',
        address: profile?.address || metadata?.address || '',
        photourl: profile?.photourl || metadata?.photourl || '',
        role: profile?.role || 'customer',
        password: '',
      } as AppUser;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        id: userId,
        email: email || '',
        name: metadata?.name || 'User',
        role: 'customer',
      } as AppUser;
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = await getProfile(session.user.id, session.user.email!, session.user.user_metadata);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const initAuth = async () => {
      try {
        // STEP 1: Get existing session FIRST
        const { data: { session } } = await supabase.auth.getSession();

        if (!isSubscribed) return;

        if (session?.user) {
          // Set basic user info immediately to avoid stuck loading
          const basicUser: AppUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'User',
            role: 'customer',
          };
          setCurrentUser(basicUser);
          
          // Then fetch full profile in background
          getProfile(session.user.id, session.user.email!, session.user.user_metadata)
            .then(fullUser => {
              if (isSubscribed) setCurrentUser(fullUser);
            });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Initial auth error:", error);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    initAuth();

    // STEP 2: Listen for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isSubscribed) return;

      try {
        if (session?.user) {
          // Set basic user info immediately to stop loading spinner
          const basicUser: AppUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'User',
            role: 'customer',
          };
          if (isSubscribed) {
            setCurrentUser(basicUser);
            setLoading(false); // STOP LOADING HERE
          }
          
          // Then fetch full profile in background
          getProfile(session.user.id, session.user.email!, session.user.user_metadata)
            .then(fullUser => {
              if (isSubscribed) setCurrentUser(fullUser);
            });
        } else {
          if (isSubscribed) {
            setCurrentUser(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Auth change error during event:", error);
        if (isSubscribed) {
          setCurrentUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
