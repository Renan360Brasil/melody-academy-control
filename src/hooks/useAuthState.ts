
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthUser } from '@/types/auth';
import { UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (sessionUser: User) => {
    try {
      console.log('Buscando perfil para usuário:', sessionUser.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        if (error.code === 'PGRST116') {
          console.log('Perfil não encontrado, o trigger deve criar automaticamente');
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
      console.error('Erro no fetchUserProfile:', error);
    }
  };

  useEffect(() => {
    console.log('Configurando auth listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our database
          setTimeout(() => {
            fetchUserProfile(session.user);
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

  return {
    user,
    session,
    isLoading,
    setUser,
    setSession,
    setIsLoading
  };
}
