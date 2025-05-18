
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Student } from '@/types';
import { StudentDetailsDrawer } from './StudentDetailsDrawer';

interface StudentsTableProps {
  students: Student[];
  isLoading: boolean;
}

export function StudentsTable({ students, isLoading }: StudentsTableProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDetailsClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Carregando...</div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">Cursos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground mb-2" />
                  <p>Nenhum aluno encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">Cursos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell className="hidden md:table-cell">{student.phone}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {student.courses.length > 0 
                    ? student.courses.join(", ") 
                    : "Nenhum curso"}
                </TableCell>
                <TableCell>
                  <div className={
                    student.status === 'active' 
                      ? 'status-active' 
                      : student.status === 'inactive' 
                        ? 'status-inactive' 
                        : 'status-pending'
                  }>
                    {student.status === 'active' 
                      ? 'Ativo' 
                      : student.status === 'inactive' 
                        ? 'Inativo' 
                        : 'Suspenso'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDetailsClick(student)}
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StudentDetailsDrawer 
        student={selectedStudent}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </>
  );
}
