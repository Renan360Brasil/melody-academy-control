
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
    console.log('Configurando auth listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our database
          setTimeout(async () => {
            try {
              console.log('Buscando perfil para usuário:', session.user.id);
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('Erro ao buscar perfil:', error);
                if (error.code === 'PGRST116') {
                  console.log('Perfil não encontrado, o trigger deve criar automaticamente');
                } else {
                  toast.error('Erro ao carregar perfil do usuário');
                }
                return;
              }

              if (profile) {
                console.log('Perfil encontrado:', profile);
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
                console.log('Usuário autenticado:', authUser);
              }
            } catch (error) {
              console.error('Erro no auth state change:', error);
            }
          }, 100);
        } else {
          setUser(null);
          console.log('Usuário deslogado');
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão existente encontrada:', session?.user?.email);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => {
      console.log('Removendo auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      console.log('Iniciando login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        console.error('Erro de login:', error);
        let errorMessage = 'Erro ao fazer login';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado';
        }
        
        toast.error(errorMessage);
        return { error: error.message };
      }

      if (data.user) {
        console.log('Login bem-sucedido para:', data.user.email);
        toast.success('Login realizado com sucesso!');
      }
      
      return {};
    } catch (error: any) {
      console.error('Erro inesperado no login:', error);
      toast.error('Erro inesperado ao fazer login');
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      console.log('Iniciando cadastro para:', email, 'como', role);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name.trim(),
            role
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        let errorMessage = 'Erro ao criar conta';
        
        if (error.message.includes('already registered')) {
          errorMessage = 'Este email já está cadastrado';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        }
        
        toast.error(errorMessage);
        return { error: error.message };
      }

      if (data.user) {
        console.log('Cadastro bem-sucedido para:', data.user.email);
        
        // Se o usuário foi confirmado automaticamente, já faz login
        if (data.user.email_confirmed_at) {
          toast.success('Conta criada e login realizado com sucesso!');
        } else {
          toast.success('Conta criada! Verifique seu email para confirmar.');
        }
      }
      
      return {};
    } catch (error: any) {
      console.error('Erro inesperado no cadastro:', error);
      toast.error('Erro inesperado ao criar conta');
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Fazendo logout...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.info('Você saiu do sistema');
    } catch (error) {
      console.error('Erro no logout:', error);
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
