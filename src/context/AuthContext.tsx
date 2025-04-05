import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Database } from "@/integrations/supabase/types";

// Define user types
export type UserRole = 'user' | 'admin' | 'fixer' | 'operator' | 'collector';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string; // Add phone as an optional property
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        setUser(null);
        return;
      }
      
      const supabaseUser = session.session.user;
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
          avatar: profile.avatar_url,
          phone: profile.phone,
        });
      }
    } catch (error) {
      console.error('Error getting profile:', error);
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      setLoading(true);
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await getProfile();
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            await getProfile();
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        }
      );
      
      setLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    setupAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Try to sign in using Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // For demo purposes, if login fails, we'll simulate a login with hardcoded credentials
        if (email === "admin@sala7li.com" && password === "admin123") {
          const adminUser = {
            id: "admin-1",
            name: "Admin User",
            email: email,
            role: 'admin' as UserRole,
          };
          
          setUser(adminUser);
          localStorage.setItem('sala7liUser', JSON.stringify(adminUser));
          setLoading(false);
          return true;
        }
        
        if (email === "fixer@sala7li.com" && password === "fixer123") {
          const fixerUser = {
            id: "fixer-1",
            name: "Fixer User",
            email: email,
            role: 'fixer' as UserRole,
          };
          
          setUser(fixerUser);
          localStorage.setItem('sala7liUser', JSON.stringify(fixerUser));
          setLoading(false);
          return true;
        }
        
        if (email === "operator@sala7li.com" && password === "operator123") {
          const operatorUser = {
            id: "operator-1",
            name: "Operator User",
            email: email,
            role: 'operator' as UserRole,
          };
          
          setUser(operatorUser);
          localStorage.setItem('sala7liUser', JSON.stringify(operatorUser));
          setLoading(false);
          return true;
        }
        
        if (email === "collector@sala7li.com" && password === "collector123") {
          const collectorUser = {
            id: "collector-1",
            name: "Collector User",
            email: email,
            role: 'collector' as UserRole,
          };
          
          setUser(collectorUser);
          localStorage.setItem('sala7liUser', JSON.stringify(collectorUser));
          setLoading(false);
          return true;
        }
        
        const regularUser = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          name: "John Doe",
          email: email,
          role: 'user' as UserRole,
        };
        
        setUser(regularUser);
        localStorage.setItem('sala7liUser', JSON.stringify(regularUser));
        setLoading(false);
        return true;
      }
      
      // If login was successful in Supabase
      if (data.user) {
        await getProfile();
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('sala7liUser');
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
