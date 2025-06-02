
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

interface UseAuthActionsProps {
  setIsLoading: (loading: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  setSession: (session: Session | null) => void;
}

export function useAuthActions({ setIsLoading, setUser, setSession }: UseAuthActionsProps) {
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

  return {
    login,
    logout
  };
}
