
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType, AuthUser } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import { canAccessRoute } from '@/utils/authUtils';
import { initializeAdmin } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, isLoading, setUser, setSession, setIsLoading } = useAuthState();
  const { login, logout } = useAuthActions({ setIsLoading, setUser, setSession });

  // Initialize admin user on mount
  React.useEffect(() => {
    initializeAdmin().then((result) => {
      if (result.success) {
        console.log('Admin inicializado:', result.message);
      } else {
        console.error('Erro ao inicializar admin:', result.error);
      }
    });
  }, []);

  const handleCanAccessRoute = (route: string): boolean => {
    return canAccessRoute(user, route);
  };

  const value = {
    user,
    session,
    login,
    logout,
    isAuthenticated: !!session?.user,
    isLoading,
    canAccessRoute: handleCanAccessRoute
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
