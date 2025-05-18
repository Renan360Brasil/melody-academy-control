
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
import { Teacher } from '@/types';
import { Trash2, Pen } from 'lucide-react';

interface TeacherDetailsDrawerProps {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (teacher: Teacher) => void;
  onDelete?: (teacher: Teacher) => void;
}

export function TeacherDetailsDrawer({ 
  teacher, 
  open, 
  onOpenChange,
  onEdit,
  onDelete
}: TeacherDetailsDrawerProps) {
  if (!teacher) return null;
  
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
            <DrawerTitle className="text-2xl">{teacher.name}</DrawerTitle>
            <DrawerDescription>Informações detalhadas do professor</DrawerDescription>
          </DrawerHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                <p>{teacher.email}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Telefone</h4>
                <p>{teacher.phone}</p>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Instrumentos</h4>
                <div className="flex flex-wrap gap-1">
                  {teacher.instruments.map((instrument) => (
                    <span
                      key={instrument}
                      className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs"
                    >
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Disponibilidade</h4>
              {teacher.availability.length > 0 ? (
                <div className="space-y-2">
                  {teacher.availability.map((slot, index) => {
                    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                    return (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{days[slot.dayOfWeek]}: </span>
                        {slot.startTime} - {slot.endTime}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma disponibilidade registrada</p>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Cursos Ministrados</h4>
              {teacher.courses.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {teacher.courses.map((course, index) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nenhum curso ministrado</p>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Cadastro</h4>
              <p>{formatDate(teacher.createdAt)}</p>
            </div>
          </div>
          
          <DrawerFooter className="pt-6 flex flex-row space-x-2">
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
            {onEdit && (
              <Button 
                variant="secondary" 
                onClick={() => teacher && onEdit(teacher)}
              >
                <Pen className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                onClick={() => teacher && onDelete(teacher)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
