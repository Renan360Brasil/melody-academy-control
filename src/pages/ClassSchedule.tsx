
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/context/AuthContext';
import { Class, User } from '@/types';
import { format, isEqual, isWeekend, getDay, addDays, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

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
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  
  // Filter classes based on user role
  const filteredClasses = filterClassesByUserRole(MOCK_CLASSES, user);
  
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
        // If weekend, show no classes
        if (isWeekend(date)) {
          classesToDisplay = [];
        } else {
          // Filter classes for the current day of week
          classesToDisplay = filteredClasses.filter(cls => cls.dayOfWeek === selectedDayOfWeek);
        }
        break;
        
      case 'week':
        // Show all classes for the week
        classesToDisplay = filteredClasses;
        break;
        
      case 'month':
        // Show all classes
        classesToDisplay = filteredClasses;
        break;
    }
    
    setDisplayClasses(classesToDisplay);
  }, [date, filteredClasses, view]);
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
              modifiers={{
                hasEvents: (day) => {
                  const dayOfWeek = getDay(day);
                  return filteredClasses.some(cls => cls.dayOfWeek === dayOfWeek) && !isWeekend(day);
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
                {displayClasses.length > 0 ? (
                  <div className="space-y-3">
                    {displayClasses.map((cls) => (
                      <div key={cls.id} className="p-3 border rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{cls.courseName}</h4>
                          <Badge className="bg-music-primary">
                            {cls.startTime} - {cls.endTime}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-1">
                          <p className="text-muted-foreground">Professor: {cls.teacherName}</p>
                          <p className="text-muted-foreground">Local: {cls.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Nenhuma aula encontrada para este dia</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="week" className="space-y-4">
                <h3 className="text-lg font-medium">Aulas da semana</h3>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {[0, 1, 2, 3, 4].map((dayOffset) => {
                    const weekday = addDays(startOfWeek(date, { weekStartsOn: 1 }), dayOffset);
                    const weekdayClasses = filteredClasses.filter(cls => cls.dayOfWeek === getDay(weekday));
                    
                    return (
                      <div key={dayOffset} className="border rounded-md p-3">
                        <h4 className="font-medium border-b pb-2 mb-2 capitalize">
                          {format(weekday, 'EEEE', { locale: ptBR })}
                        </h4>
                        
                        {weekdayClasses.length > 0 ? (
                          <div className="space-y-2">
                            {weekdayClasses.map(cls => (
                              <div key={cls.id} className="text-sm border-l-2 border-music-primary pl-2">
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
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredClasses.map((cls) => (
                    <div key={cls.id} className="p-3 border rounded-md shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{cls.courseName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {getDayName(cls.dayOfWeek)}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Horário:</p>
                          <p>{cls.startTime} - {cls.endTime}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Professor:</p>
                          <p>{cls.teacherName}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Local:</p>
                          <p>{cls.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
