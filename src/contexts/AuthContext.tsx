
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Supabase user to our User type
  const formatUser = (session: Session | null): User | null => {
    if (!session?.user) return null;

    const supaUser = session.user;
    return {
      id: supaUser.id,
      name: supaUser.user_metadata.name || supaUser.user_metadata.full_name || 'User',
      email: supaUser.email || '',
      avatar: supaUser.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(supaUser.user_metadata.name || 'User')}&background=random`,
      provider: supaUser.app_metadata.provider || 'email'
    };
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const formattedUser = formatUser(session);
        setUser(formattedUser);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const formattedUser = formatUser(session);
        setUser(formattedUser);
        toast.success('Successfully signed in!');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        toast.success('Successfully signed out');
      }
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    toast.success('Successfully logged in!');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Successfully logged out');
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) {
      toast.error(`Authentication error: ${error.message}`);
      console.error('Authentication error:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout,
        signInWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
