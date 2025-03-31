
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

// Define user types
export type UserRole = 'user' | 'admin' | 'fixer' | 'operator' | 'collector';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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

  // Check for user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('sala7liUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call - in a real app this would be a backend call
    try {
      // Check for admin credentials
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
      
      // Check for fixer credentials
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
      
      // Check for operator credentials
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
      
      // Check for collector credentials
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
      
      // Default to regular user for any other login
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
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sala7liUser');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
