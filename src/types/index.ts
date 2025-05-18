
export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  teacherId?: string; // ID for teacher-specific data
  studentId?: string; // ID for student-specific data
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  guardian?: string;
  status: 'active' | 'inactive' | 'suspended';
  courses: string[];
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  instruments: string[];
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  courses: string[];
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  weeklyHours: number;
  durationWeeks: number;
  price: number;
  teacherId: string;
  teacherName: string;
  students: number;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  startDate: string;
  endDate: string;
  price: number;
  installments: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Payment {
  id: string;
  enrollmentId: string;
  studentName: string;
  courseName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  createdAt: string;
}

export interface Class {
  id: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  location: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalCourses: number;
  upcomingClasses: number;
  monthlyRevenue: number;
  pendingPayments: number;
}
