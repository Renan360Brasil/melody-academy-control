
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  teacherId?: string;
  studentId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error?: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
  canAccessRoute: (route: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define route permissions for each role
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['/', '/students', '/teachers', '/courses', '/enrollments', '/financial', '/schedule', '/settings'],
  teacher: ['/', '/schedule', '/settings'],
  student: ['/', '/schedule', '/settings']
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our database
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('Error fetching profile:', error);
                toast.error('Erro ao carregar perfil do usuário');
                return;
              }

              if (profile) {
                const authUser: AuthUser = {
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role as UserRole,
                  avatar: profile.avatar || undefined
                };

                // If user is teacher or student, get their specific IDs
                if (profile.role === 'teacher') {
                  const { data: teacher } = await supabase
                    .from('teachers')
                    .select('id')
                    .eq('profile_id', profile.id)
                    .single();
                  if (teacher) {
                    authUser.teacherId = teacher.id;
                  }
                } else if (profile.role === 'student') {
                  const { data: student } = await supabase
                    .from('students')
                    .select('id')
                    .eq('profile_id', profile.id)
                    .single();
                  if (student) {
                    authUser.studentId = student.id;
                  }
                }

                setUser(authUser);
              }
            } catch (error) {
              console.error('Error in auth state change:', error);
            }
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // The onAuthStateChange will handle setting the session and user
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error('Credenciais inválidas');
        return { error: error.message };
      }

      toast.success('Login realizado com sucesso!');
      return {};
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login');
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        console.error('SignUp error:', error);
        toast.error('Erro ao criar conta');
        return { error: error.message };
      }

      toast.success('Conta criada com sucesso! Verifique seu email.');
      return {};
    } catch (error: any) {
      console.error('SignUp error:', error);
      toast.error('Erro ao criar conta');
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.info('Você saiu do sistema');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao sair do sistema');
    }
  };

  const canAccessRoute = (route: string): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(route);
  };

  const value = {
    user,
    session,
    login,
    logout,
    signUp,
    isAuthenticated: !!session?.user,
    isLoading,
    canAccessRoute
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
