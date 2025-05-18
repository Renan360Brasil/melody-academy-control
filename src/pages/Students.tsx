
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { AddStudentDialog } from '@/components/students/AddStudentDialog';
import { StudentsFilter } from '@/components/students/StudentsFilter';
import { StudentsTable } from '@/components/students/StudentsTable';
import { useStudents } from '@/hooks/use-students';

export default function Students() {
  const {
    filteredStudents,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    students,
    addStudent
  } = useStudents();

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Alunos" 
        description="Gerencie os alunos da escola de música"
      >
        <AddStudentDialog onAddStudent={addStudent} />
      </PageHeader>
      
      <Card>
        <CardContent className="pt-6">
          <StudentsFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
          
          <StudentsTable 
            students={filteredStudents}
            isLoading={isLoading}
          />
          
          <div className="flex justify-end mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredStudents.length} de {students.length} alunos
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
