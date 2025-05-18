
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
import { Enrollment } from '@/types';
import { Pen, Trash2 } from 'lucide-react';

interface EnrollmentDetailsDrawerProps {
  enrollment: Enrollment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (enrollment: Enrollment) => void;
  onDelete?: (enrollment: Enrollment) => void;
}

export function EnrollmentDetailsDrawer({ 
  enrollment, 
  open, 
  onOpenChange,
  onEdit,
  onDelete
}: EnrollmentDetailsDrawerProps) {
  if (!enrollment) return null;
  
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

  // Get status in Portuguese
  const getStatusText = (status: 'active' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pb-6">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="pt-6">
            <DrawerTitle className="text-2xl">Matrícula: {enrollment.courseName}</DrawerTitle>
            <DrawerDescription>Informações detalhadas da matrícula</DrawerDescription>
          </DrawerHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Aluno</h4>
                <p>{enrollment.studentName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Curso</h4>
                <p>{enrollment.courseName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Início</h4>
                <p>{formatDate(enrollment.startDate)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Término</h4>
                <p>{formatDate(enrollment.endDate)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Valor Total</h4>
                <p className="font-medium">{formatCurrency(enrollment.price)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  enrollment.status === 'active' ? 'bg-green-100 text-green-800' : 
                  enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {getStatusText(enrollment.status)}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Plano de Pagamento</h4>
              <div>
                <p>{enrollment.installments} parcelas de {formatCurrency(enrollment.price / enrollment.installments)}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Matrícula</h4>
              <p>{formatDate(enrollment.createdAt)}</p>
            </div>
          </div>
          
          <DrawerFooter className="pt-6 flex flex-row space-x-2">
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
            {onEdit && (
              <Button 
                variant="secondary" 
                onClick={() => enrollment && onEdit(enrollment)}
              >
                <Pen className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                onClick={() => enrollment && onDelete(enrollment)}
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
