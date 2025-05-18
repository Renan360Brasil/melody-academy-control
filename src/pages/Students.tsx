
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
import { Plus, Search, User } from 'lucide-react';
import { Student } from '@/types';
import { toast } from 'sonner';

// Dados de demonstração
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    phone: '(11) 98765-4321',
    address: 'Av. Paulista, 1000, São Paulo, SP',
    birthDate: '1998-05-15',
    status: 'active',
    courses: ['Piano Intermediário', 'Teoria Musical'],
    createdAt: '2024-12-10'
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    phone: '(11) 91234-5678',
    address: 'Rua Augusta, 500, São Paulo, SP',
    birthDate: '2000-10-20',
    status: 'active',
    courses: ['Violão Avançado'],
    createdAt: '2025-01-05'
  },
  {
    id: '3',
    name: 'Marina Costa',
    email: 'marina.costa@email.com',
    phone: '(11) 99876-5432',
    address: 'Rua Oscar Freire, 300, São Paulo, SP',
    birthDate: '1999-02-28',
    status: 'inactive',
    courses: ['Bateria Iniciante'],
    createdAt: '2024-11-15'
  },
  {
    id: '4',
    name: 'Paulo Rodrigues',
    email: 'paulo.rodrigues@email.com',
    phone: '(11) 97654-3210',
    address: 'Rua da Consolação, 800, São Paulo, SP',
    birthDate: '2005-07-12',
    guardian: 'Maria Rodrigues',
    status: 'active',
    courses: ['Canto Coral', 'Piano Iniciante'],
    createdAt: '2025-02-20'
  },
  {
    id: '5',
    name: 'Juliana Martins',
    email: 'juliana.martins@email.com',
    phone: '(11) 98877-6655',
    address: 'Alameda Santos, 1200, São Paulo, SP',
    birthDate: '1997-12-03',
    status: 'active',
    courses: ['Violino Intermediário'],
    createdAt: '2025-03-10'
  }
];

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state for new student
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    guardian: '',
    status: 'active' as 'active' | 'inactive' | 'suspended' // Fix 1: Type assertion to ensure status is properly typed
  });

  useEffect(() => {
    // Simulando carregamento de dados
    setTimeout(() => {
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setIsLoading(false);
    }, 500);
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setNewStudent(prev => ({ 
      ...prev, 
      status: value as 'active' | 'inactive' | 'suspended'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar novo aluno com ID único e data atual
    const newStudentWithId: Student = {
      ...newStudent,
      id: `new-${Date.now()}`,
      courses: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setStudents(prev => [newStudentWithId, ...prev]);
    toast.success('Aluno adicionado com sucesso!');
    
    // Resetar form
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
      guardian: '',
      status: 'active' as 'active' | 'inactive' | 'suspended'
    });
    
    setIsDialogOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Alunos" 
        description="Gerencie os alunos da escola de música"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Aluno</DialogTitle>
                <DialogDescription>
                  Preencha as informações do aluno. Clique em salvar quando finalizar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={newStudent.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={newStudent.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={newStudent.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input 
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={newStudent.birthDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={newStudent.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="guardian">Responsável (se menor de idade)</Label>
                    <Input 
                      id="guardian"
                      name="guardian"
                      value={newStudent.guardian}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newStudent.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="suspended">Suspenso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <div className="flex items-center w-full sm:max-w-sm">
              {/* Fix 2: Remove the icon prop and use a container with positioning instead */}
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail"
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
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
                <SelectItem value="suspended">Suspensos</SelectItem>
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
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Telefone</TableHead>
                      <TableHead className="hidden lg:table-cell">Cursos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <User className="h-8 w-8 text-muted-foreground mb-2" />
                            <p>Nenhum aluno encontrado</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
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
                  Mostrando {filteredStudents.length} de {students.length} alunos
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
