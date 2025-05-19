
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/context/AuthContext';
import { Class, User } from '@/types';
import { format, isEqual, isWeekend, getDay, addDays, startOfWeek, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { OneTimeClassDialog } from '@/components/class-schedule/OneTimeClassDialog';
import { ClassAttendanceDialog } from '@/components/class-schedule/ClassAttendanceDialog'; 
import { ClassList } from '@/components/class-schedule/ClassList';
import { toast } from 'sonner';

// Mock data for class schedules
const MOCK_CLASSES: Class[] = [
  {
    id: '1',
    courseId: 'course-1',
    courseName: 'Piano - Iniciante',
    teacherId: 'teacher-1',
    teacherName: 'Teacher User',
    startTime: '08:00',
    endTime: '09:00',
    dayOfWeek: 1, // Monday
    location: 'Sala 101'
  },
  {
    id: '2',
    courseId: 'course-2',
    courseName: 'Violão - Intermediário',
    teacherId: 'teacher-2',
    teacherName: 'John Smith',
    startTime: '10:00',
    endTime: '11:30',
    dayOfWeek: 2, // Tuesday
    location: 'Sala 102'
  },
  {
    id: '3',
    courseId: 'course-3',
    courseName: 'Canto - Avançado',
    teacherId: 'teacher-1',
    teacherName: 'Teacher User',
    startTime: '14:00',
    endTime: '15:30',
    dayOfWeek: 3, // Wednesday
    location: 'Sala 103'
  },
  {
    id: '4',
    courseId: 'course-4',
    courseName: 'Bateria - Iniciante',
    teacherId: 'teacher-3',
    teacherName: 'Maria Santos',
    startTime: '16:00',
    endTime: '17:30',
    dayOfWeek: 4, // Thursday
    location: 'Sala 104'
  },
  {
    id: '5',
    courseId: 'course-5',
    courseName: 'Teoria Musical',
    teacherId: 'teacher-1',
    teacherName: 'Teacher User',
    startTime: '09:00',
    endTime: '10:30',
    dayOfWeek: 5, // Friday
    location: 'Sala 105'
  }
];

// Mock student enrollment data
const STUDENT_CLASSES = {
  'student-1': ['1', '3'] // IDs of classes the student is enrolled in
};

// Mock teachers data
const MOCK_TEACHERS = [
  { id: 'teacher-1', name: 'Teacher User' },
  { id: 'teacher-2', name: 'John Smith' },
  { id: 'teacher-3', name: 'Maria Santos' }
];

// Function to filter classes based on user role
function filterClassesByUserRole(classes: Class[], user: User | null): Class[] {
  if (!user) return [];
  
  if (user.role === 'admin') {
    return classes;
  }
  
  if (user.role === 'teacher' && user.teacherId) {
    return classes.filter(cls => cls.teacherId === user.teacherId);
  }
  
  if (user.role === 'student' && user.studentId) {
    const studentClassIds = STUDENT_CLASSES[user.studentId] || [];
    return classes.filter(cls => studentClassIds.includes(cls.id));
  }
  
  return [];
}

export default function ClassSchedule() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [displayClasses, setDisplayClasses] = useState<Class[]>([]);
  const [allClasses, setAllClasses] = useState<Class[]>([...MOCK_CLASSES]);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [oneTimeClassDialogOpen, setOneTimeClassDialogOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  
  // Filter classes based on user role and update when allClasses changes
  const filteredClasses = filterClassesByUserRole(allClasses, user);
  
  // Filter classes based on the selected date and view
  useEffect(() => {
    if (!date) {
      setDisplayClasses([]);
      return;
    }

    const selectedDayOfWeek = getDay(date);
    
    let classesToDisplay: Class[] = [];
    
    switch (view) {
      case 'day':
        // Show recurring classes for the current day of week and one-time classes for this specific date
        classesToDisplay = filteredClasses.filter(cls => {
          if (cls.isOneTime && cls.date) {
            // For one-time classes, check if the date matches
            return format(date, 'yyyy-MM-dd') === cls.date;
          } else {
            // For recurring classes, check if the day of week matches and it's not a weekend
            return cls.dayOfWeek === selectedDayOfWeek && !isWeekend(date);
          }
        });
        break;
        
      case 'week':
        // Show all classes for the week
        classesToDisplay = filteredClasses.filter(cls => {
          if (cls.isOneTime && cls.date) {
            // For one-time classes, check if the date is in the current week
            const classDate = parseISO(cls.date);
            const weekStart = startOfWeek(date, { weekStartsOn: 1 });
            const weekEnd = addDays(weekStart, 6);
            return classDate >= weekStart && classDate <= weekEnd;
          } else {
            // Include all recurring classes
            return true;
          }
        });
        break;
        
      case 'month':
        // Show all classes
        classesToDisplay = filteredClasses;
        break;
    }
    
    setDisplayClasses(classesToDisplay);
  }, [date, filteredClasses, view, allClasses]);
  
  // Get day name
  const getDayName = (dayOfWeek: number): string => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayOfWeek];
  };

  const handleTabChange = (value: string) => {
    setView(value as 'day' | 'week' | 'month');
  };

  const formatSelectedDate = (date: Date): string => {
    return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
  };
  
  // Calendar day styles - add badges to days with classes
  function getDayClassNames(day: Date) {
    const dayOfWeek = getDay(day);
    const hasClasses = filteredClasses.some(cls => cls.dayOfWeek === dayOfWeek);
    
    if (hasClasses && !isWeekend(day)) {
      return "relative has-classes";
    }
    
    return "";
  }

  // Handle creating a new one-time class
  const handleCreateOneTimeClass = (classData: Partial<Class>) => {
    const newClass: Class = {
      id: `one-time-${Date.now()}`,
      courseId: `course-one-time-${Date.now()}`,
      courseName: classData.courseName || 'Aula Avulsa',
      teacherId: classData.teacherId || '',
      teacherName: classData.teacherName || '',
      startTime: classData.startTime || '09:00',
      endTime: classData.endTime || '10:00',
      dayOfWeek: classData.date ? getDay(new Date(classData.date)) : 1,
      location: classData.location || 'Sala 101',
      isOneTime: true,
      date: classData.date
    };
    
    setAllClasses(prev => [...prev, newClass]);
    toast.success('Aula avulsa criada com sucesso!');
  };

  // Handle opening attendance dialog
  const handleAttendanceClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setAttendanceDialogOpen(true);
  };

  // Handle updating class attendance
  const handleUpdateAttendance = (classId: string, attended: boolean) => {
    setAllClasses(prev => 
      prev.map(cls => 
        cls.id === classId 
          ? { ...cls, attended } 
          : cls
      )
    );
    
    toast.success(`Presença ${attended ? 'confirmada' : 'não registrada'} com sucesso!`);
  };

  // Handle rescheduling a class
  const handleReschedule = (classId: string, newDate: string, startTime: string, endTime: string) => {
    // Get the original class
    const originalClass = allClasses.find(cls => cls.id === classId);
    if (!originalClass) return;
    
    // Mark the original class as not attended if it wasn't already
    const updatedClasses = allClasses.map(cls => 
      cls.id === classId 
        ? { ...cls, attended: false, rescheduledTo: `rescheduled-${Date.now()}` } 
        : cls
    );
    
    // Create a new rescheduled class
    const rescheduledClass: Class = {
      id: `rescheduled-${Date.now()}`,
      courseId: originalClass.courseId,
      courseName: originalClass.courseName,
      teacherId: originalClass.teacherId,
      teacherName: originalClass.teacherName,
      startTime: startTime,
      endTime: endTime,
      dayOfWeek: getDay(new Date(newDate)),
      location: originalClass.location,
      isOneTime: true,
      date: newDate,
      rescheduledFrom: classId
    };
    
    setAllClasses([...updatedClasses, rescheduledClass]);
    toast.success('Aula remarcada com sucesso!');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Quadro de Aulas" 
        description={
          user?.role === 'admin' 
            ? "Visualize todas as aulas agendadas"
            : user?.role === 'teacher'
            ? "Visualize suas aulas agendadas"
            : "Visualize suas aulas"
        }
      />
      
      {/* New One Time Class Dialog */}
      <OneTimeClassDialog 
        open={oneTimeClassDialogOpen}
        onOpenChange={setOneTimeClassDialogOpen}
        onSave={handleCreateOneTimeClass}
        teachers={MOCK_TEACHERS}
      />
      
      {/* Class Attendance Dialog */}
      <ClassAttendanceDialog
        open={attendanceDialogOpen}
        onOpenChange={setAttendanceDialogOpen}
        classData={selectedClass}
        onUpdateAttendance={handleUpdateAttendance}
        onReschedule={handleReschedule}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Calendário</h3>
              {(user?.role === 'admin' || user?.role === 'teacher') && (
                <Button 
                  size="sm" 
                  onClick={() => setOneTimeClassDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Aula Avulsa
                </Button>
              )}
            </div>
            
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
              modifiers={{
                hasEvents: (day) => {
                  // Check for regular classes by day of week
                  const dayOfWeek = getDay(day);
                  const hasRegularClass = filteredClasses.some(cls => 
                    !cls.isOneTime && cls.dayOfWeek === dayOfWeek && !isWeekend(day)
                  );
                  
                  // Check for one-time classes on this specific date
                  const formattedDay = format(day, 'yyyy-MM-dd');
                  const hasOneTimeClass = filteredClasses.some(cls => 
                    cls.isOneTime && cls.date === formattedDay
                  );
                  
                  return hasRegularClass || hasOneTimeClass;
                }
              }}
              modifiersStyles={{
                hasEvents: { 
                  fontWeight: 'bold', 
                  textDecoration: 'underline', 
                  color: 'var(--primary)'
                }
              }}
            />
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Legenda:</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-accent text-accent-foreground">Hoje</Badge>
                <span className="text-xs">Dia atual</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-primary text-primary-foreground">Selecionado</Badge>
                <span className="text-xs">Dia selecionado</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-green-500 text-white">Realizada</Badge>
                <span className="text-xs">Aula confirmada</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-red-500 text-white">Não realizada</Badge>
                <span className="text-xs">Aula não realizada</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="day" className="space-y-4" onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="day">Dia</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
              </TabsList>
              
              <TabsContent value="day" className="space-y-4">
                <h3 className="text-lg font-medium">
                  Aulas do dia {formatSelectedDate(date)}
                </h3>
                <ClassList 
                  classes={displayClasses} 
                  view="day"
                  onAttendanceClick={handleAttendanceClick} 
                />
              </TabsContent>
              
              <TabsContent value="week" className="space-y-4">
                <h3 className="text-lg font-medium">Aulas da semana</h3>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {[0, 1, 2, 3, 4].map((dayOffset) => {
                    const weekday = addDays(startOfWeek(date, { weekStartsOn: 1 }), dayOffset);
                    const weekdayClasses = filteredClasses.filter(cls => {
                      if (cls.isOneTime && cls.date) {
                        return format(weekday, 'yyyy-MM-dd') === cls.date;
                      } else {
                        return cls.dayOfWeek === getDay(weekday);
                      }
                    });
                    
                    return (
                      <div key={dayOffset} className="border rounded-md p-3">
                        <h4 className="font-medium border-b pb-2 mb-2 capitalize">
                          {format(weekday, 'EEEE', { locale: ptBR })}
                        </h4>
                        
                        {weekdayClasses.length > 0 ? (
                          <div className="space-y-2">
                            {weekdayClasses.map(cls => (
                              <div 
                                key={cls.id} 
                                className={`text-sm border-l-2 pl-2 ${
                                  cls.attended === true ? 'border-green-500' : 
                                  cls.attended === false ? 'border-red-500' : 
                                  'border-music-primary'
                                }`}
                                onClick={() => handleAttendanceClick(cls)}
                              >
                                <p className="font-medium">{cls.courseName}</p>
                                <p className="text-xs text-muted-foreground">{cls.startTime} - {cls.endTime}</p>
                                <p className="text-xs text-muted-foreground">Sala: {cls.location}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground text-center py-4">Sem aulas</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="month" className="space-y-4">
                <h3 className="text-lg font-medium">Aulas do mês</h3>
                <ClassList 
                  classes={displayClasses} 
                  view="month"
                  onAttendanceClick={handleAttendanceClick} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
