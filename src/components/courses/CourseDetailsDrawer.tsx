
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
import { Course } from '@/types';
import { Pen, Trash2 } from 'lucide-react';

interface CourseDetailsDrawerProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export function CourseDetailsDrawer({ 
  course, 
  open, 
  onOpenChange,
  onEdit,
  onDelete
}: CourseDetailsDrawerProps) {
  if (!course) return null;
  
  // Format date to local format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pb-6">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="pt-6">
            <DrawerTitle className="text-2xl">{course.name}</DrawerTitle>
            <DrawerDescription>Informações detalhadas do curso</DrawerDescription>
          </DrawerHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Professor</h4>
                <p>{course.teacherName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Valor</h4>
                <p className="font-medium">{formatCurrency(course.price)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Carga Horária</h4>
                <p>{course.weeklyHours} horas semanais</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Duração</h4>
                <p>{course.durationWeeks} semanas</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Alunos Matriculados</h4>
                <p>{course.students} alunos</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Criação</h4>
                <p>{formatDate(course.createdAt)}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Carga Horária Total</h4>
              <p>{course.weeklyHours * course.durationWeeks} horas</p>
            </div>
          </div>
          
          <DrawerFooter className="pt-6 flex flex-row space-x-2">
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
            {onEdit && (
              <Button 
                variant="secondary" 
                onClick={() => course && onEdit(course)}
              >
                <Pen className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                onClick={() => course && onDelete(course)}
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
