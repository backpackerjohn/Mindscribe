import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

const CURRENT_USER_KEY = 'mindscribe-currentUser';

// --- START: DEVELOPMENT-ONLY CHANGE TO DISABLE LOGIN ---
const MOCK_USER: User = {
    id: 'dev-user-01',
    email: 'dev@mindscribe.app',
    passwordHash: '',
    createdAt: new Date().toISOString(),
};
// --- END: DEVELOPMENT-ONLY CHANGE TO DISABLE LOGIN ---

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // --- START: DEVELOPMENT-ONLY CHANGE TO DISABLE LOGIN ---
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [isLoading, setIsLoading] = useState(false);
  
  const login = async (email: string, password: string) => {
    console.warn("Login is disabled for development.");
  };

  const signup = async (email: string, password: string) => {
    console.warn("Signup is disabled for development.");
  };

  const logout = () => {
    console.warn("Logout is disabled for development. User state will not be cleared.");
  };
  // --- END: DEVELOPMENT-ONLY CHANGE TO DISABLE LOGIN ---


  // --- START: PRODUCTION AUTH LOGIC (CURRENTLY DISABLED) ---
  /*
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
      if (currentUserId) {
        const loggedInUser = authService.getUserById(currentUserId);
        if (loggedInUser) {
          setUser(loggedInUser);
        } else {
          localStorage.removeItem(CURRENT_USER_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to load user session", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    localStorage.setItem(CURRENT_USER_KEY, loggedInUser.id);
  };
  
  const signup = async (email: string, password: string) => {
    const newUser = await authService.signup(email, password);
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, newUser.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };
  */
  // --- END: PRODUCTION AUTH LOGIC (CURRENTLY DISABLED) ---

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
