
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
import { Payment } from '@/types';
import { format } from 'date-fns';

interface PaymentDetailsDrawerProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailsDrawer({ payment, open, onOpenChange }: PaymentDetailsDrawerProps) {
  if (!payment) return null;

  // Format date to local format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  // Format currency to BRL
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
            <DrawerTitle className="text-2xl">Detalhes do Pagamento</DrawerTitle>
            <DrawerDescription>
              Pagamento de {payment.studentName} - {payment.courseName}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">ID do Pagamento</h4>
                <p className="font-mono">{payment.id}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">ID da Matrícula</h4>
                <p className="font-mono">{payment.enrollmentId}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Aluno</h4>
                <p>{payment.studentName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Curso</h4>
                <p>{payment.courseName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Valor</h4>
                <p className="font-semibold text-lg">{formatCurrency(payment.amount)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                  payment.status === 'pending' ? 'bg-blue-100 text-blue-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {payment.status === 'paid' ? 'Pago' : 
                   payment.status === 'pending' ? 'Pendente' : 'Atrasado'}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Vencimento</h4>
                <p>{formatDate(payment.dueDate)}</p>
              </div>
              
              {payment.paidDate && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Pagamento</h4>
                  <p>{formatDate(payment.paidDate)}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Criação</h4>
                <p>{formatDate(payment.createdAt)}</p>
              </div>
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
