
import { useState, useEffect } from 'react';
import { Student } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase
  const loadStudents = async () => {
    try {
      setIsLoading(true);
      
      const { data: studentsData, error } = await supabase
        .from('students')
        .select(`
          id,
          phone,
          address,
          birth_date,
          guardian,
          status,
          email,
          created_at,
          profiles!students_profile_id_fkey (
            name,
            email
          )
        `);

      if (error) {
        console.error('Error loading students:', error);
        toast.error('Erro ao carregar alunos');
        return;
      }

      // Transform the data to match our Student interface
      const transformedStudents: Student[] = studentsData?.map(student => ({
        id: student.id,
        name: student.profiles?.name || 'Nome não encontrado',
        email: student.email,
        phone: student.phone,
        address: student.address,
        birthDate: student.birth_date,
        guardian: student.guardian || undefined,
        status: student.status as 'active' | 'inactive' | 'suspended',
        courses: [], // We'll load this separately if needed
        createdAt: student.created_at
      })) || [];

      setStudents(transformedStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Erro ao carregar alunos');
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadStudents();
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

  const addStudent = async (newStudent: Student) => {
    // In a real implementation, this would create both the profile and student records
    toast.info('Funcionalidade de adicionar aluno será implementada em breve');
  };

  const updateStudent = async (updatedStudent: Student) => {
    // In a real implementation, this would update the student record
    toast.info('Funcionalidade de editar aluno será implementada em breve');
  };

  const deleteStudent = async (studentToDelete: Student) => {
    // In a real implementation, this would delete the student record
    toast.info('Funcionalidade de excluir aluno será implementada em breve');
  };

  return {
    students,
    filteredStudents,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents: loadStudents
  };
}
