
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
import { BookOpenCheck, Plus, Search } from 'lucide-react';
import { Course, Teacher } from '@/types';
import { toast } from 'sonner';

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Piano Iniciante',
    weeklyHours: 2,
    durationWeeks: 16,
    price: 480.00,
    teacherId: '1',
    teacherName: 'Roberto Almeida',
    students: 5,
    createdAt: '2024-09-15'
  },
  {
    id: '2',
    name: 'Violão Intermediário',
    weeklyHours: 3,
    durationWeeks: 20,
    price: 650.00,
    teacherId: '2',
    teacherName: 'Carla Souza',
    students: 3,
    createdAt: '2024-10-01'
  },
  {
    id: '3',
    name: 'Bateria Iniciante',
    weeklyHours: 2,
    durationWeeks: 12,
    price: 420.00,
    teacherId: '3',
    teacherName: 'Marcelo Santos',
    students: 4,
    createdAt: '2024-11-20'
  },
  {
    id: '4',
    name: 'Teoria Musical',
    weeklyHours: 1,
    durationWeeks: 8,
    price: 300.00,
    teacherId: '1',
    teacherName: 'Roberto Almeida',
    students: 8,
    createdAt: '2025-01-05'
  }
];

// Mock data for teachers (simplified for selection)
const mockTeachers: { id: string; name: string; instruments: string[] }[] = [
  { id: '1', name: 'Roberto Almeida', instruments: ['Piano', 'Teclado'] },
  { id: '2', name: 'Carla Souza', instruments: ['Violão', 'Guitarra'] },
  { id: '3', name: 'Marcelo Santos', instruments: ['Bateria'] }
];

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State for form inputs
  const [newCourse, setNewCourse] = useState({
    name: '',
    weeklyHours: 2,
    durationWeeks: 12,
    price: 0,
    teacherId: '',
    teacherName: ''
  });

  useEffect(() => {
    // Simulating data loading
    setTimeout(() => {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, courses]);

  const filterCourses = () => {
    if (!searchQuery) {
      setFilteredCourses(courses);
      return;
    }
    
    const filtered = courses.filter(
      course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredCourses(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ 
      ...prev, 
      [name]: name === 'weeklyHours' || name === 'durationWeeks' || name === 'price' 
        ? parseFloat(value) || 0
        : value 
    }));
  };
  
  const handleTeacherChange = (teacherId: string) => {
    const selectedTeacher = mockTeachers.find(teacher => teacher.id === teacherId);
    
    if (selectedTeacher) {
      setNewCourse(prev => ({ 
        ...prev, 
        teacherId,
        teacherName: selectedTeacher.name
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCourse.teacherId) {
      toast.error('Selecione um professor para o curso');
      return;
    }
    
    // Create new course with unique ID and current date
    const newCourseWithId: Course = {
      ...newCourse,
      id: `new-${Date.now()}`,
      students: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCourses(prev => [newCourseWithId, ...prev]);
    toast.success('Curso adicionado com sucesso!');
    
    // Reset form
    setNewCourse({
      name: '',
      weeklyHours: 2,
      durationWeeks: 12,
      price: 0,
      teacherId: '',
      teacherName: ''
    });
    
    setIsDialogOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Cursos" 
        description="Gerencie os cursos disponíveis na escola de música"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Curso</DialogTitle>
                <DialogDescription>
                  Preencha as informações do curso. Clique em salvar quando finalizar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do curso</Label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="Ex: Violão Iniciante"
                    value={newCourse.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="weeklyHours">Horas semanais</Label>
                    <Input 
                      id="weeklyHours"
                      name="weeklyHours"
                      type="number"
                      min="1"
                      step="0.5"
                      value={newCourse.weeklyHours}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="durationWeeks">Duração (semanas)</Label>
                    <Input 
                      id="durationWeeks"
                      name="durationWeeks"
                      type="number"
                      min="1"
                      value={newCourse.durationWeeks}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="price">Valor do curso</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">R$</span>
                    <Input 
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-10"
                      value={newCourse.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="teacherId">Professor</Label>
                  <Select 
                    value={newCourse.teacherId}
                    onValueChange={handleTeacherChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um professor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} ({teacher.instruments.join(', ')})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou professor"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8"
                />
              </div>
            </div>
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
                      <TableHead>Professor</TableHead>
                      <TableHead className="hidden md:table-cell">Carga Horária</TableHead>
                      <TableHead className="hidden lg:table-cell">Duração</TableHead>
                      <TableHead>Alunos</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <BookOpenCheck className="h-8 w-8 text-muted-foreground mb-2" />
                            <p>Nenhum curso encontrado</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.name}</TableCell>
                          <TableCell>{course.teacherName}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {course.weeklyHours}h semanais
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {course.durationWeeks} semanas
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs">
                              {course.students} alunos
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(course.price)}
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
                  Mostrando {filteredCourses.length} de {courses.length} cursos
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
