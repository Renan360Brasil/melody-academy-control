
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
import { Plus, Search, UserPlus } from 'lucide-react';
import { Teacher } from '@/types';
import { toast } from 'sonner';

// Mock data for teachers
const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@email.com',
    phone: '(11) 97654-3210',
    instruments: ['Piano', 'Teclado'],
    availability: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '14:00', endTime: '18:00' }
    ],
    courses: ['Piano Iniciante', 'Piano Intermediário', 'Teoria Musical'],
    createdAt: '2024-09-15'
  },
  {
    id: '2',
    name: 'Carla Souza',
    email: 'carla.souza@email.com',
    phone: '(11) 98765-4321',
    instruments: ['Violão', 'Guitarra'],
    availability: [
      { dayOfWeek: 2, startTime: '09:00', endTime: '12:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '12:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '12:00' }
    ],
    courses: ['Violão Iniciante', 'Guitarra Avançada'],
    createdAt: '2024-10-01'
  },
  {
    id: '3',
    name: 'Marcelo Santos',
    email: 'marcelo.santos@email.com',
    phone: '(11) 91234-5678',
    instruments: ['Bateria'],
    availability: [
      { dayOfWeek: 1, startTime: '18:00', endTime: '21:00' },
      { dayOfWeek: 3, startTime: '18:00', endTime: '21:00' },
      { dayOfWeek: 5, startTime: '18:00', endTime: '21:00' }
    ],
    courses: ['Bateria Iniciante', 'Bateria Intermediário'],
    createdAt: '2024-11-20'
  }
];

// List of available instruments
const instrumentOptions = [
  'Piano', 'Teclado', 'Violão', 'Guitarra', 'Bateria', 
  'Violino', 'Viola', 'Violoncelo', 'Contrabaixo', 'Flauta', 
  'Saxofone', 'Trompete', 'Trombone', 'Canto', 'Percussão'
];

// Days of the week
const daysOfWeek = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 
  'Quinta', 'Sexta', 'Sábado'
];

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State for form inputs
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    instruments: [] as string[],
    availability: [] as { dayOfWeek: number; startTime: string; endTime: string }[]
  });
  
  // State for availability form inputs
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  // Instrument selection state
  const [selectedInstrument, setSelectedInstrument] = useState('');

  useEffect(() => {
    // Simulating data loading
    setTimeout(() => {
      setTeachers(mockTeachers);
      setFilteredTeachers(mockTeachers);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [searchQuery, teachers]);

  const filterTeachers = () => {
    if (!searchQuery) {
      setFilteredTeachers(teachers);
      return;
    }
    
    const filtered = teachers.filter(
      teacher => 
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.instruments.some(instrument => 
          instrument.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    
    setFilteredTeachers(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({ ...prev, [name]: value }));
  };

  const addInstrument = () => {
    if (!selectedInstrument || newTeacher.instruments.includes(selectedInstrument)) return;
    
    setNewTeacher(prev => ({
      ...prev,
      instruments: [...prev.instruments, selectedInstrument]
    }));
    
    setSelectedInstrument('');
  };

  const removeInstrument = (instrument: string) => {
    setNewTeacher(prev => ({
      ...prev,
      instruments: prev.instruments.filter(i => i !== instrument)
    }));
  };

  const addAvailability = () => {
    // Validate times
    if (startTime >= endTime) {
      toast.error('Horário de término deve ser após o horário de início');
      return;
    }
    
    // Check for overlapping times
    const hasOverlap = newTeacher.availability.some(
      avail => avail.dayOfWeek === dayOfWeek && 
        ((startTime >= avail.startTime && startTime < avail.endTime) || 
         (endTime > avail.startTime && endTime <= avail.endTime) ||
         (startTime <= avail.startTime && endTime >= avail.endTime))
    );
    
    if (hasOverlap) {
      toast.error('Este horário se sobrepõe a outro já adicionado');
      return;
    }
    
    setNewTeacher(prev => ({
      ...prev,
      availability: [
        ...prev.availability, 
        { dayOfWeek, startTime, endTime }
      ].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
    }));
  };

  const removeAvailability = (index: number) => {
    setNewTeacher(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTeacher.instruments.length === 0) {
      toast.error('Adicione pelo menos um instrumento');
      return;
    }
    
    if (newTeacher.availability.length === 0) {
      toast.error('Adicione pelo menos um horário de disponibilidade');
      return;
    }
    
    // Create new teacher with unique ID and current date
    const newTeacherWithId: Teacher = {
      ...newTeacher,
      id: `new-${Date.now()}`,
      courses: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTeachers(prev => [newTeacherWithId, ...prev]);
    toast.success('Professor adicionado com sucesso!');
    
    // Reset form
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      instruments: [],
      availability: []
    });
    
    setIsDialogOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Professores" 
        description="Gerencie os professores da escola de música"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Professor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Professor</DialogTitle>
                <DialogDescription>
                  Preencha as informações do professor. Adicione instrumentos e disponibilidade de horários.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={newTeacher.name}
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
                      value={newTeacher.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={newTeacher.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                {/* Instruments section */}
                <div className="grid gap-2">
                  <Label>Instrumentos</Label>
                  <div className="flex gap-2">
                    <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                      <SelectTrigger className="flex-grow">
                        <SelectValue placeholder="Selecionar instrumento" />
                      </SelectTrigger>
                      <SelectContent>
                        {instrumentOptions.map(instrument => (
                          <SelectItem key={instrument} value={instrument}>
                            {instrument}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addInstrument}>
                      Adicionar
                    </Button>
                  </div>
                  
                  {newTeacher.instruments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newTeacher.instruments.map(instrument => (
                        <div 
                          key={instrument} 
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {instrument}
                          <button 
                            type="button" 
                            className="text-secondary-foreground hover:text-primary-foreground"
                            onClick={() => removeInstrument(instrument)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Availability section */}
                <div className="grid gap-2">
                  <Label>Disponibilidade</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={dayOfWeek.toString()} onValueChange={value => setDayOfWeek(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day, index) => (
                          <SelectItem key={day} value={index.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="grid gap-1">
                      <Label htmlFor="startTime" className="text-xs">Início</Label>
                      <Input 
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="endTime" className="text-xs">Término</Label>
                      <Input 
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-1" 
                    onClick={addAvailability}
                  >
                    Adicionar Horário
                  </Button>
                  
                  {newTeacher.availability.length > 0 && (
                    <div className="mt-2 border rounded-md p-2">
                      <p className="text-sm font-medium mb-2">Horários adicionados:</p>
                      <div className="space-y-1">
                        {newTeacher.availability.map((avail, index) => (
                          <div key={index} className="flex justify-between items-center text-sm border-b pb-1">
                            <span>{daysOfWeek[avail.dayOfWeek]}: {avail.startTime} - {avail.endTime}</span>
                            <button 
                              type="button" 
                              className="text-destructive hover:text-destructive/80"
                              onClick={() => removeAvailability(index)}
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                  placeholder="Buscar por nome, e-mail ou instrumento"
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
                      <TableHead>Contato</TableHead>
                      <TableHead className="hidden md:table-cell">Instrumentos</TableHead>
                      <TableHead className="hidden lg:table-cell">Cursos</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <UserPlus className="h-8 w-8 text-muted-foreground mb-2" />
                            <p>Nenhum professor encontrado</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>
                            <div>{teacher.email}</div>
                            <div className="text-sm text-muted-foreground">{teacher.phone}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
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
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {teacher.courses.length > 0 
                              ? teacher.courses.join(", ") 
                              : "Nenhum curso"}
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
                  Mostrando {filteredTeachers.length} de {teachers.length} professores
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
