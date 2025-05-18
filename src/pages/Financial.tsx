import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Plus, Search, Calendar as CalendarIcon, Check } from 'lucide-react';
import { Payment } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PaymentDetailsDrawer } from '@/components/financial/PaymentDetailsDrawer';

// Mock data for payments
const mockPayments: Payment[] = [
  {
    id: '1',
    enrollmentId: '1',
    studentName: 'Ana Silva',
    courseName: 'Piano Iniciante',
    amount: 120.00,
    dueDate: '2025-02-15',
    paidDate: '2025-02-10',
    status: 'paid',
    createdAt: '2025-01-15'
  },
  {
    id: '2',
    enrollmentId: '1',
    studentName: 'Ana Silva',
    courseName: 'Piano Iniciante',
    amount: 120.00,
    dueDate: '2025-03-15',
    status: 'pending',
    createdAt: '2025-01-15'
  },
  {
    id: '3',
    enrollmentId: '1',
    studentName: 'Ana Silva',
    courseName: 'Piano Iniciante',
    amount: 120.00,
    dueDate: '2025-04-15',
    status: 'pending',
    createdAt: '2025-01-15'
  },
  {
    id: '4',
    enrollmentId: '1',
    studentName: 'Ana Silva',
    courseName: 'Piano Iniciante',
    amount: 120.00,
    dueDate: '2025-05-15',
    status: 'pending',
    createdAt: '2025-01-15'
  },
  {
    id: '5',
    enrollmentId: '2',
    studentName: 'Carlos Mendes',
    courseName: 'Violão Intermediário',
    amount: 130.00,
    dueDate: '2025-02-01',
    paidDate: '2025-02-01',
    status: 'paid',
    createdAt: '2025-01-10'
  },
  {
    id: '6',
    enrollmentId: '2',
    studentName: 'Carlos Mendes',
    courseName: 'Violão Intermediário',
    amount: 130.00,
    dueDate: '2025-03-01',
    status: 'pending',
    createdAt: '2025-01-10'
  },
  {
    id: '7',
    enrollmentId: '3',
    studentName: 'Marina Costa',
    courseName: 'Bateria Iniciante',
    amount: 140.00,
    dueDate: '2025-01-05',
    paidDate: '2025-01-03',
    status: 'paid',
    createdAt: '2024-12-05'
  },
  {
    id: '8',
    enrollmentId: '3',
    studentName: 'Marina Costa',
    courseName: 'Bateria Iniciante',
    amount: 140.00,
    dueDate: '2024-12-05',
    status: 'overdue',
    createdAt: '2024-11-05'
  }
];

// Mock data for enrollments (simplified for selection)
const mockEnrollments = [
  { id: '1', studentName: 'Ana Silva', courseName: 'Piano Iniciante' },
  { id: '2', studentName: 'Carlos Mendes', courseName: 'Violão Intermediário' },
  { id: '3', studentName: 'Marina Costa', courseName: 'Bateria Iniciante' }
];

export default function Financial() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  
  // State for new payment
  const [newPayment, setNewPayment] = useState({
    enrollmentId: '',
    studentName: '',
    courseName: '',
    amount: 0,
    dueDate: '',
    status: 'pending' as 'paid' | 'pending' | 'overdue'
  });
  
  // State for dates
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [paidDate, setPaidDate] = useState<Date | undefined>(undefined);

  // Financial summary
  const [financialSummary, setFinancialSummary] = useState({
    totalReceived: 0,
    pendingPayments: 0,
    overduePayments: 0
  });

  useEffect(() => {
    // Simulating data loading
    setTimeout(() => {
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      
      // Calculate summary
      const received = mockPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const pending = mockPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const overdue = mockPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);
      
      setFinancialSummary({
        totalReceived: received,
        pendingPayments: pending,
        overduePayments: overdue
      });
      
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchQuery, statusFilter, payments]);

  const filterPayments = () => {
    let filtered = payments;
    
    if (searchQuery) {
      filtered = filtered.filter(
        payment => 
          payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    setFilteredPayments(filtered);
  };

  const handleEnrollmentChange = (enrollmentId: string) => {
    const selectedEnrollment = mockEnrollments.find(e => e.id === enrollmentId);
    
    if (selectedEnrollment) {
      setNewPayment(prev => ({ 
        ...prev, 
        enrollmentId,
        studentName: selectedEnrollment.studentName,
        courseName: selectedEnrollment.courseName
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPayment.enrollmentId || !newPayment.dueDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    // Create new payment with unique ID and current date
    const newPaymentWithId: Payment = {
      ...newPayment,
      id: `new-${Date.now()}`,
      paidDate: newPayment.status === 'paid' ? format(new Date(), 'yyyy-MM-dd') : undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setPayments(prev => [newPaymentWithId, ...prev]);
    
    // Update financial summary
    if (newPaymentWithId.status === 'paid') {
      setFinancialSummary(prev => ({
        ...prev,
        totalReceived: prev.totalReceived + newPaymentWithId.amount
      }));
    } else if (newPaymentWithId.status === 'pending') {
      setFinancialSummary(prev => ({
        ...prev,
        pendingPayments: prev.pendingPayments + newPaymentWithId.amount
      }));
    } else {
      setFinancialSummary(prev => ({
        ...prev,
        overduePayments: prev.overduePayments + newPaymentWithId.amount
      }));
    }
    
    toast.success('Pagamento registrado com sucesso!');
    
    // Reset form
    setNewPayment({
      enrollmentId: '',
      studentName: '',
      courseName: '',
      amount: 0,
      dueDate: '',
      status: 'pending'
    });
    setDueDate(undefined);
    
    setIsDialogOpen(false);
  };

  const handleMarkAsPaid = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayment) return;
    
    // Update payment status
    const updatedPayments = payments.map(payment => {
      if (payment.id === selectedPayment.id) {
        return {
          ...payment,
          status: 'paid' as const,
          paidDate: format(paidDate || new Date(), 'yyyy-MM-dd')
        };
      }
      return payment;
    });
    
    setPayments(updatedPayments);
    
    // Update financial summary
    setFinancialSummary(prev => {
      let newSummary = { ...prev };
      
      // Remove from pending or overdue
      if (selectedPayment.status === 'pending') {
        newSummary.pendingPayments -= selectedPayment.amount;
      } else if (selectedPayment.status === 'overdue') {
        newSummary.overduePayments -= selectedPayment.amount;
      }
      
      // Add to received
      newSummary.totalReceived += selectedPayment.amount;
      
      return newSummary;
    });
    
    toast.success('Pagamento registrado com sucesso!');
    setSelectedPayment(null);
    setPaidDate(undefined);
    setIsPaymentDialogOpen(false);
  };

  const openPaymentDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentDialogOpen(true);
  };

  const handleDetailsClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsDrawerOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Financeiro" 
        description="Gerencie os pagamentos e mensalidades"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Pagamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Registrar Novo Pagamento</DialogTitle>
                <DialogDescription>
                  Registre um pagamento para matrícula existente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="enrollmentId">Matrícula</Label>
                  <Select 
                    value={newPayment.enrollmentId}
                    onValueChange={handleEnrollmentChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma matrícula" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEnrollments.map((enrollment) => (
                        <SelectItem key={enrollment.id} value={enrollment.id}>
                          {enrollment.studentName} - {enrollment.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="amount">Valor</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">R$</span>
                    <Input 
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-10"
                      value={newPayment.amount || ''}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Data de vencimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "dd/MM/yyyy") : "Selecione a data de vencimento"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => {
                          setDueDate(date);
                          if (date) {
                            setNewPayment(prev => ({
                              ...prev,
                              dueDate: format(date, 'yyyy-MM-dd')
                            }));
                          }
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newPayment.status}
                    onValueChange={(value) => setNewPayment(prev => ({ 
                      ...prev, 
                      status: value as 'paid' | 'pending' | 'overdue'
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="overdue">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Registrar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Dialog for marking payments as paid */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleMarkAsPaid}>
              <DialogHeader>
                <DialogTitle>Registrar Pagamento</DialogTitle>
                <DialogDescription>
                  {selectedPayment && `Confirme o pagamento de ${formatCurrency(selectedPayment.amount)} para ${selectedPayment.studentName}.`}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Data do pagamento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !paidDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paidDate ? format(paidDate, "dd/MM/yyyy") : "Selecione a data do pagamento"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={paidDate || new Date()}
                        onSelect={setPaidDate}
                        defaultMonth={new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Confirmar Pagamento</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <div className="grid gap-6">
        {/* Financial summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(financialSummary.totalReceived)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de pagamentos recebidos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
              <CalendarIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(financialSummary.pendingPayments)}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor total pendente de pagamento
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamentos Atrasados</CardTitle>
              <CreditCard className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(financialSummary.overduePayments)}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor total em atraso
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="payments" className="w-full">
          <TabsList>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="flex items-center w-full sm:max-w-sm">
                    <div className="relative w-full">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por aluno ou curso"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8"
                      />
                    </div>
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filtrar status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="paid">Pagos</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="overdue">Atrasados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div>Carregando...</div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Vencimento</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                <div className="flex flex-col items-center justify-center">
                                  <CreditCard className="h-8 w-8 text-muted-foreground mb-2" />
                                  <p>Nenhum pagamento encontrado</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredPayments.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium">{payment.studentName}</TableCell>
                                <TableCell>{payment.courseName}</TableCell>
                                <TableCell>{formatDate(payment.dueDate)}</TableCell>
                                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                <TableCell>
                                  <div className={cn(
                                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                    {
                                      "bg-green-100 text-green-800": payment.status === "paid",
                                      "bg-blue-100 text-blue-800": payment.status === "pending",
                                      "bg-red-100 text-red-800": payment.status === "overdue",
                                    }
                                  )}>
                                    {payment.status === 'paid' ? 'Pago' : 
                                    payment.status === 'pending' ? 'Pendente' : 
                                    'Atrasado'}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex gap-2 justify-end">
                                    {payment.status !== 'paid' && (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => openPaymentDialog(payment)}
                                      >
                                        Registrar Pagamento
                                      </Button>
                                    )}
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDetailsClick(payment)}
                                    >
                                      Detalhes
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end mt-4">
                      <div className="text-sm text-muted-foreground">
                        Mostrando {filteredPayments.length} de {payments.length} pagamentos
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 items-center justify-center py-12">
                  <p className="text-muted-foreground">Relatórios serão implementados em breve.</p>
                  <Button className="mt-2">Gerar Relatório</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <PaymentDetailsDrawer
        payment={selectedPayment}
        open={isDetailsDrawerOpen}
        onOpenChange={setIsDetailsDrawerOpen}
      />
    </div>
  );
}
