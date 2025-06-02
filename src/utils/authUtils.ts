
import { ROLE_PERMISSIONS } from '@/constants/permissions';
import { AuthUser } from '@/types/auth';

export const canAccessRoute = (user: AuthUser | null, route: string): boolean => {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role].includes(route);
};
