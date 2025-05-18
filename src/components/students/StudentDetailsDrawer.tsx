
import React from 'react';
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle 
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Student } from '@/types';

interface StudentDetailsDrawerProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsDrawer({ student, open, onOpenChange }: StudentDetailsDrawerProps) {
  if (!student) return null;
  
  // Format date to local format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pb-6">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="pt-6">
            <DrawerTitle className="text-2xl">{student.name}</DrawerTitle>
            <DrawerDescription>Informações detalhadas do aluno</DrawerDescription>
          </DrawerHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                <p>{student.email}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Telefone</h4>
                <p>{student.phone}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Nascimento</h4>
                <p>{formatDate(student.birthDate)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  student.status === 'active' ? 'bg-green-100 text-green-800' : 
                  student.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {student.status === 'active' ? 'Ativo' : 
                   student.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Endereço</h4>
                <p>{student.address || "Não informado"}</p>
              </div>
              
              {student.guardian && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Responsável</h4>
                  <p>{student.guardian}</p>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Cursos Matriculados</h4>
              {student.courses.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {student.courses.map((course, index) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nenhum curso matriculado</p>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Cadastro</h4>
              <p>{formatDate(student.createdAt)}</p>
            </div>
          </div>
          
          <DrawerFooter className="pt-6">
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
