
import { Session } from '@supabase/supabase-js';
import { UserRole } from '@/types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  teacherId?: string;
  studentId?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  canAccessRoute: (route: string) => boolean;
}
