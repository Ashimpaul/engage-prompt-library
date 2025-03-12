import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
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
      name: supaUser.user_metadata.name || 'User',
      email: supaUser.email || '',
      avatar: supaUser.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(supaUser.user_metadata.name || 'User')}&background=random`,
      username: supaUser.user_metadata.username || '',
      bio: supaUser.user_metadata.bio || '',
      joinedDate: supaUser.created_at || new Date().toISOString(),
      contributions: 0
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

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(`Login error: ${error.message}`);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('Signup successful! Check your email to confirm your account.');
    } catch (error: any) {
      toast.error(`Signup error: ${error.message}`);
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Successfully logged out');
    } catch (error: any) {
      toast.error(`Logout error: ${error.message}`);
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        signup,
        logout
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
