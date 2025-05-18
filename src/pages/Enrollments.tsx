
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Plus, Search } from 'lucide-react';
import { Enrollment, Course, Student } from '@/types';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data for enrollments
const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Ana Silva',
    courseId: '1',
    courseName: 'Piano Iniciante',
    startDate: '2025-01-15',
    endDate: '2025-05-10',
    price: 480.00,
    installments: 4,
    status: 'active',
    createdAt: '2024-12-20'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Carlos Mendes',
    courseId: '2',
    courseName: 'Violão Intermediário',
    startDate: '2025-02-01',
    endDate: '2025-06-20',
    price: 650.00,
    installments: 5,
    status: 'active',
    createdAt: '2025-01-10'
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Marina Costa',
    courseId: '3',
    courseName: 'Bateria Iniciante',
    startDate: '2024-12-05',
    endDate: '2025-03-01',
    price: 420.00,
    installments: 3,
    status: 'completed',
    createdAt: '2024-11-20'
  }
];

// Mock data for students (simplified for selection)
const mockStudents: { id: string; name: string }[] = [
  { id: '1', name: 'Ana Silva' },
  { id: '2', name: 'Carlos Mendes' },
  { id: '3', name: 'Marina Costa' },
  { id: '4', name: 'Paulo Rodrigues' },
  { id: '5', name: 'Juliana Martins' }
];

// Mock data for courses (simplified for selection)
const mockCourses: { id: string; name: string; price: number; durationWeeks: number }[] = [
  { id: '1', name: 'Piano Iniciante', price: 480.00, durationWeeks: 16 },
  { id: '2', name: 'Violão Intermediário', price: 650.00, durationWeeks: 20 },
  { id: '3', name: 'Bateria Iniciante', price: 420.00, durationWeeks: 12 },
  { id: '4', name: 'Teoria Musical', price: 300.00, durationWeeks: 8 }
];

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State for form inputs
  const [newEnrollment, setNewEnrollment] = useState({
    studentId: '',
    studentName: '',
    courseId: '',
    courseName: '',
    startDate: '',
    endDate: '',
    price: 0,
    installments: 1,
    status: 'active' as 'active' | 'completed' | 'cancelled'
  });
  
  // State for calendar
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  
  // State for selected course
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    name: string;
    price: number;
    durationWeeks: number;
  } | null>(null);

  useEffect(() => {
    // Simulating data loading
    setTimeout(() => {
      setEnrollments(mockEnrollments);
      setFilteredEnrollments(mockEnrollments);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [searchQuery, statusFilter, enrollments]);

  useEffect(() => {
    // Update enrollment form when course changes
    if (selectedCourse) {
      setNewEnrollment(prev => ({
        ...prev,
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
        price: selectedCourse.price
      }));
    }
  }, [selectedCourse]);

  useEffect(() => {
    // Update end date when start date changes
    if (startDate && selectedCourse) {
      const endDateObj = new Date(startDate);
      endDateObj.setDate(endDateObj.getDate() + (selectedCourse.durationWeeks * 7));
      
      setNewEnrollment(prev => ({
        ...prev,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDateObj, 'yyyy-MM-dd')
      }));
    }
  }, [startDate, selectedCourse]);

  const filterEnrollments = () => {
    let filtered = enrollments;
    
    if (searchQuery) {
      filtered = filtered.filter(
        enrollment => 
          enrollment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          enrollment.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.status === statusFilter);
    }
    
    setFilteredEnrollments(filtered);
  };

  const handleStudentChange = (studentId: string) => {
    const selectedStudent = mockStudents.find(student => student.id === studentId);
    
    if (selectedStudent) {
      setNewEnrollment(prev => ({ 
        ...prev, 
        studentId,
        studentName: selectedStudent.name
      }));
    }
  };
  
  const handleCourseChange = (courseId: string) => {
    const course = mockCourses.find(course => course.id === courseId);
    
    if (course) {
      setSelectedCourse(course);
    }
  };

  const handleInstallmentsChange = (value: string) => {
    const installments = parseInt(value);
    setNewEnrollment(prev => ({ ...prev, installments }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEnrollment.studentId || !newEnrollment.courseId || !newEnrollment.startDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    // Create new enrollment with unique ID and current date
    const newEnrollmentWithId: Enrollment = {
      ...newEnrollment,
      id: `new-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setEnrollments(prev => [newEnrollmentWithId, ...prev]);
    toast.success('Matrícula realizada com sucesso!');
    
    // Reset form
    setNewEnrollment({
      studentId: '',
      studentName: '',
      courseId: '',
      courseName: '',
      startDate: '',
      endDate: '',
      price: 0,
      installments: 1,
      status: 'active'
    });
    setStartDate(undefined);
    setSelectedCourse(null);
    
    setIsDialogOpen(false);
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
        title="Matrículas" 
        description="Gerencie as matrículas dos alunos nos cursos"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Matrícula
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Realizar Nova Matrícula</DialogTitle>
                <DialogDescription>
                  Vincule um aluno a um curso específico.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="studentId">Aluno</Label>
                  <Select 
                    value={newEnrollment.studentId}
                    onValueChange={handleStudentChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="courseId">Curso</Label>
                  <Select 
                    value={newEnrollment.courseId}
                    onValueChange={handleCourseChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} - {formatCurrency(course.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Data de início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione a data de início"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {startDate && selectedCourse && (
                  <div className="grid gap-2">
                    <Label>Data de término (calculada automaticamente)</Label>
                    <Input 
                      value={newEnrollment.endDate ? formatDate(newEnrollment.endDate) : ''}
                      disabled
                    />
                  </div>
                )}
                
                {selectedCourse && (
                  <div className="grid gap-2">
                    <Label htmlFor="price">Valor</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">R$</span>
                      <Input 
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-10"
                        value={newEnrollment.price}
                        onChange={(e) => setNewEnrollment(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Valor padrão do curso: {formatCurrency(selectedCourse.price)}
                    </p>
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="installments">Parcelas</Label>
                  <Select 
                    value={newEnrollment.installments.toString()}
                    onValueChange={handleInstallmentsChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Número de parcelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'parcela' : 'parcelas'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {newEnrollment.price > 0 && newEnrollment.installments > 0 && (
                  <div className="p-3 bg-secondary/30 rounded-md">
                    <p className="text-sm font-medium">Resumo do pagamento:</p>
                    <p className="text-sm mt-1">
                      {newEnrollment.installments}x de {formatCurrency(newEnrollment.price / newEnrollment.installments)}
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Confirmar Matrícula</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
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
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
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
                      <TableHead className="hidden lg:table-cell">Período</TableHead>
                      <TableHead className="hidden md:table-cell">Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnrollments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                            <p>Nenhuma matrícula encontrada</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEnrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="font-medium">{enrollment.studentName}</TableCell>
                          <TableCell>{enrollment.courseName}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {formatDate(enrollment.startDate)} a {formatDate(enrollment.endDate)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatCurrency(enrollment.price)}
                            <div className="text-xs text-muted-foreground">
                              {enrollment.installments}x de {formatCurrency(enrollment.price / enrollment.installments)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn(
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              {
                                "bg-green-100 text-green-800": enrollment.status === "active",
                                "bg-blue-100 text-blue-800": enrollment.status === "completed",
                                "bg-red-100 text-red-800": enrollment.status === "cancelled",
                              }
                            )}>
                              {enrollment.status === 'active' ? 'Ativa' : 
                               enrollment.status === 'completed' ? 'Concluída' : 
                               'Cancelada'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Detalhes</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {filteredEnrollments.length} de {enrollments.length} matrículas
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
