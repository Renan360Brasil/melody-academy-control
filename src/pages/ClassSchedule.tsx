
import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  CalendarCheck, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, parseISO, getDay } from 'date-fns';
import { Class } from '@/types';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Mock data for classes
const mockClasses: Class[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Piano Iniciante',
    teacherId: '1',
    teacherName: 'Roberto Almeida',
    startTime: '14:00',
    endTime: '16:00',
    dayOfWeek: 1, // Monday
    location: 'Sala 101'
  },
  {
    id: '2',
    courseId: '1',
    courseName: 'Piano Iniciante',
    teacherId: '1',
    teacherName: 'Roberto Almeida',
    startTime: '14:00',
    endTime: '16:00',
    dayOfWeek: 3, // Wednesday
    location: 'Sala 101'
  },
  {
    id: '3',
    courseId: '1',
    courseName: 'Piano Iniciante',
    teacherId: '1',
    teacherName: 'Roberto Almeida',
    startTime: '14:00',
    endTime: '16:00',
    dayOfWeek: 5, // Friday
    location: 'Sala 101'
  },
  {
    id: '4',
    courseId: '2',
    courseName: 'Violão Intermediário',
    teacherId: '2',
    teacherName: 'Carla Souza',
    startTime: '09:00',
    endTime: '12:00',
    dayOfWeek: 2, // Tuesday
    location: 'Sala 102'
  },
  {
    id: '5',
    courseId: '2',
    courseName: 'Violão Intermediário',
    teacherId: '2',
    teacherName: 'Carla Souza',
    startTime: '09:00',
    endTime: '12:00',
    dayOfWeek: 4, // Thursday
    location: 'Sala 102'
  },
  {
    id: '6',
    courseId: '3',
    courseName: 'Bateria Iniciante',
    teacherId: '3',
    teacherName: 'Marcelo Santos',
    startTime: '18:00',
    endTime: '20:00',
    dayOfWeek: 1, // Monday
    location: 'Sala 103'
  },
  {
    id: '7',
    courseId: '3',
    courseName: 'Bateria Iniciante',
    teacherId: '3',
    teacherName: 'Marcelo Santos',
    startTime: '18:00',
    endTime: '20:00',
    dayOfWeek: 3, // Wednesday
    location: 'Sala 103'
  },
  {
    id: '8',
    courseId: '4',
    courseName: 'Teoria Musical',
    teacherId: '1',
    teacherName: 'Roberto Almeida',
    startTime: '10:00',
    endTime: '11:00',
    dayOfWeek: 6, // Saturday
    location: 'Sala 104'
  }
];

// Horários de aula para o dia
const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

export default function ClassSchedule() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ref for scrolling to current time
  const currentTimeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulating data loading
    setTimeout(() => {
      setClasses(mockClasses);
      setIsLoading(false);
    }, 500);
  }, []);

  // Update current week when selected date changes
  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    setCurrentWeek(days);
  }, [selectedDate]);

  // Scroll to current time on initial render
  useEffect(() => {
    if (currentTimeRef.current && currentView === 'day') {
      const now = new Date();
      const currentHour = now.getHours();
      const scrollTarget = currentHour > 7 ? (currentHour - 7) * 100 : 0;
      currentTimeRef.current.scrollTop = scrollTarget;
    }
  }, [currentView, isLoading]);

  const goToPreviousPeriod = () => {
    const newDate = new Date(selectedDate);
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };

  const goToNextPeriod = () => {
    const newDate = new Date(selectedDate);
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatPeriodDisplay = () => {
    if (currentView === 'day') {
      return format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } else if (currentView === 'week') {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
      return `${format(weekStart, "dd/MM", { locale: ptBR })} - ${format(weekEnd, "dd/MM/yyyy", { locale: ptBR })}`;
    } else {
      return format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  // Get classes for a specific date
  const getClassesForDate = (date: Date) => {
    const dayOfWeek = getDay(date); // 0 is Sunday, 1 is Monday, etc.
    return classes.filter(classItem => classItem.dayOfWeek === dayOfWeek);
  };

  // Check if class is within the time range
  const isClassInTimeSlot = (classItem: Class, timeSlot: string) => {
    const [hour, minute] = timeSlot.split(':').map(Number);
    const [startHour, startMinute] = classItem.startTime.split(':').map(Number);
    const [endHour, endMinute] = classItem.endTime.split(':').map(Number);
    
    const slotTime = hour * 60 + minute;
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    return slotTime >= startTime && slotTime < endTime;
  };

  const openClassDetails = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsDialogOpen(true);
  };

  // Generate days for the month view
  const generateMonthDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startOffset = firstDay.getDay(); // 0 = Sunday
    
    // Create an array for all days in the view
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getClassesCountForDate = (date: Date | null) => {
    if (!date) return 0;
    return getClassesForDate(date).length;
  };

  // Format monthly calendar CSS grid
  const getMonthGridStyle = () => {
    const days = generateMonthDays();
    const rows = Math.ceil(days.length / 7);
    
    return {
      gridTemplateRows: `repeat(${rows}, minmax(100px, 1fr))`
    };
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Quadro de Aulas" 
        description="Visualize a agenda de aulas da escola"
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={goToToday}>
            Hoje
          </Button>
        </div>
      </PageHeader>
      
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" onClick={goToPreviousPeriod}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-medium text-lg">{formatPeriodDisplay()}</div>
                <Button variant="outline" size="icon" onClick={goToNextPeriod}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Tabs 
                defaultValue="week" 
                value={currentView} 
                onValueChange={(value) => setCurrentView(value as 'day' | 'week' | 'month')}
                className="w-auto"
              >
                <TabsList>
                  <TabsTrigger value="day">Dia</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div>Carregando...</div>
              </div>
            ) : (
              <>
                {/* Day View */}
                {currentView === 'day' && (
                  <div 
                    ref={currentTimeRef}
                    className="flex-1 flex flex-col overflow-y-auto" 
                    style={{ height: 'calc(100vh - 300px)' }}
                  >
                    <div className="flex-1 grid grid-cols-1">
                      <div className="col-span-1 relative">
                        {timeSlots.map((time, index) => (
                          <div key={time} className="absolute w-full" style={{ top: `${index * 100}px` }}>
                            <div className="border-t py-2 pl-2 text-xs text-muted-foreground sticky left-0">
                              {time}
                            </div>
                            
                            <div className="h-[100px] relative border-t">
                              {getClassesForDate(selectedDate)
                                .filter(classItem => isClassInTimeSlot(classItem, time))
                                .map((classItem) => (
                                  <div 
                                    key={classItem.id}
                                    onClick={() => openClassDetails(classItem)}
                                    className="absolute inset-x-0 mt-1 mx-2 p-2 rounded-md bg-blue-100 border-l-4 border-blue-500 cursor-pointer overflow-hidden"
                                    style={{ height: "calc(100% - 8px)" }}
                                  >
                                    <div className="font-medium text-sm truncate">{classItem.courseName}</div>
                                    <div className="text-xs truncate">{classItem.teacherName}</div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {classItem.startTime} - {classItem.endTime} • {classItem.location}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Week View */}
                {currentView === 'week' && (
                  <div 
                    className="flex-1 overflow-auto"
                    style={{ height: 'calc(100vh - 300px)' }}
                  >
                    <div className="grid grid-cols-8 min-w-[800px]">
                      {/* Time column */}
                      <div className="col-span-1">
                        <div className="h-12 border-b"></div>
                        {timeSlots.map((time) => (
                          <div key={time} className="h-24 border-b">
                            <div className="py-2 pl-2 text-xs text-muted-foreground sticky left-0">
                              {time}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Day columns */}
                      {currentWeek.map((day) => (
                        <div key={day.toISOString()} className="col-span-1 border-l">
                          {/* Day header */}
                          <div className={cn(
                            "h-12 border-b p-2 text-center",
                            isSameDay(day, new Date()) && "bg-blue-50"
                          )}>
                            <div className="font-medium">{format(day, 'EEEE', { locale: ptBR })}</div>
                            <div className="text-sm text-muted-foreground">{format(day, 'dd/MM')}</div>
                          </div>
                          
                          {/* Time cells */}
                          {timeSlots.map((time) => {
                            const dayClasses = getClassesForDate(day)
                              .filter(classItem => isClassInTimeSlot(classItem, time));
                            
                            return (
                              <div key={time} className="h-24 border-b relative">
                                {dayClasses.map((classItem) => (
                                  <div
                                    key={classItem.id}
                                    onClick={() => openClassDetails(classItem)}
                                    className="absolute inset-x-0 mt-1 mx-1 p-2 rounded-md bg-blue-100 border-l-4 border-blue-500 cursor-pointer overflow-hidden"
                                    style={{ height: "calc(100% - 8px)" }}
                                  >
                                    <div className="font-medium text-xs truncate">{classItem.courseName}</div>
                                    <div className="text-xs truncate">{classItem.teacherName}</div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {classItem.startTime} - {classItem.endTime}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Month View */}
                {currentView === 'month' && (
                  <div className="p-4">
                    <div 
                      className="grid grid-cols-7 gap-1"
                      style={getMonthGridStyle()}
                    >
                      {/* Day headers */}
                      {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => (
                        <div key={day} className="text-center py-2 text-sm font-medium">
                          {day}
                        </div>
                      ))}
                      
                      {/* Calendar days */}
                      {generateMonthDays().map((day, index) => (
                        <div
                          key={index}
                          className={cn(
                            "border rounded-md p-2 min-h-24",
                            day && isSameDay(day, new Date()) && "bg-blue-50",
                            !day && "bg-gray-50 opacity-50"
                          )}
                          onClick={() => day && setSelectedDate(day)}
                        >
                          {day && (
                            <>
                              <div className="font-medium mb-1">{format(day, 'd')}</div>
                              {getClassesCountForDate(day) > 0 && (
                                <div 
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full inline-flex items-center"
                                >
                                  <CalendarCheck className="h-3 w-3 mr-1" />
                                  {getClassesCountForDate(day)} aulas
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Class Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Aula</DialogTitle>
            <DialogDescription>
              Informações completas sobre a aula selecionada.
            </DialogDescription>
          </DialogHeader>
          
          {selectedClass && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <div className="text-sm font-medium text-muted-foreground">Curso</div>
                  <div className="text-lg font-semibold">{selectedClass.courseName}</div>
                </div>
                
                <div className="col-span-4">
                  <div className="text-sm font-medium text-muted-foreground">Professor</div>
                  <div>{selectedClass.teacherName}</div>
                </div>
                
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">Horário</div>
                  <div>{selectedClass.startTime} - {selectedClass.endTime}</div>
                </div>
                
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">Local</div>
                  <div>{selectedClass.location}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
