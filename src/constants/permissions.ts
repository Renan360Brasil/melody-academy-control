
import { UserRole } from '@/types';

// Define route permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['/', '/students', '/teachers', '/courses', '/enrollments', '/financial', '/schedule', '/settings'],
  teacher: ['/', '/schedule', '/settings'],
  student: ['/', '/schedule', '/settings']
};
