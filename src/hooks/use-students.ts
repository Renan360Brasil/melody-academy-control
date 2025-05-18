
import { useState, useEffect } from 'react';
import { Student } from '@/types';

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    phone: '(11) 98765-4321',
    address: 'Av. Paulista, 1000, São Paulo, SP',
    birthDate: '1998-05-15',
    status: 'active',
    courses: ['Piano Intermediário', 'Teoria Musical'],
    createdAt: '2024-12-10'
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    phone: '(11) 91234-5678',
    address: 'Rua Augusta, 500, São Paulo, SP',
    birthDate: '2000-10-20',
    status: 'active',
    courses: ['Violão Avançado'],
    createdAt: '2025-01-05'
  },
  {
    id: '3',
    name: 'Marina Costa',
    email: 'marina.costa@email.com',
    phone: '(11) 99876-5432',
    address: 'Rua Oscar Freire, 300, São Paulo, SP',
    birthDate: '1999-02-28',
    status: 'inactive',
    courses: ['Bateria Iniciante'],
    createdAt: '2024-11-15'
  },
  {
    id: '4',
    name: 'Paulo Rodrigues',
    email: 'paulo.rodrigues@email.com',
    phone: '(11) 97654-3210',
    address: 'Rua da Consolação, 800, São Paulo, SP',
    birthDate: '2005-07-12',
    guardian: 'Maria Rodrigues',
    status: 'active',
    courses: ['Canto Coral', 'Piano Iniciante'],
    createdAt: '2025-02-20'
  },
  {
    id: '5',
    name: 'Juliana Martins',
    email: 'juliana.martins@email.com',
    phone: '(11) 98877-6655',
    address: 'Alameda Santos, 1200, São Paulo, SP',
    birthDate: '1997-12-03',
    status: 'active',
    courses: ['Violino Intermediário'],
    createdAt: '2025-03-10'
  }
];

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter students when search or filter changes
  useEffect(() => {
    filterStudents();
  }, [searchQuery, statusFilter, students]);

  const filterStudents = () => {
    let filtered = students;
    
    if (searchQuery) {
      filtered = filtered.filter(
        student => 
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }
    
    setFilteredStudents(filtered);
  };

  const addStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  return {
    students,
    filteredStudents,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    addStudent
  };
}
