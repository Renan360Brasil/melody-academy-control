
import { useState } from 'react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/context/AuthContext';
import { Class } from '@/types';

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Filter classes based on user role
  const filteredClasses = filterClassesByUserRole(MOCK_CLASSES, user);
  
  // Get day name
  const getDayName = (dayOfWeek: number): string => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayOfWeek];
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="day" className="space-y-4">
              <TabsList>
                <TabsTrigger value="day">Dia</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
              </TabsList>
              
              <TabsContent value="day" className="space-y-4">
                <h3 className="text-lg font-medium">Aulas do dia</h3>
                {filteredClasses.length > 0 ? (
                  <div className="space-y-3">
                    {filteredClasses.map((cls) => (
                      <div key={cls.id} className="p-3 border rounded-md shadow-sm">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{cls.courseName}</h4>
                          <span className="text-sm bg-music-accent text-music-primary px-2 py-1 rounded-md">
                            {cls.startTime} - {cls.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Professor: {cls.teacherName}</p>
                        <p className="text-sm text-muted-foreground">Local: {cls.location}</p>
                        <p className="text-sm text-muted-foreground">Dia: {getDayName(cls.dayOfWeek)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma aula encontrada</p>
                )}
              </TabsContent>
              
              <TabsContent value="week" className="space-y-4">
                <h3 className="text-lg font-medium">Aulas da semana</h3>
                {filteredClasses.length > 0 ? (
                  <div className="space-y-3">
                    {filteredClasses.map((cls) => (
                      <div key={cls.id} className="p-3 border rounded-md shadow-sm">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{cls.courseName}</h4>
                          <span className="text-sm bg-music-accent text-music-primary px-2 py-1 rounded-md">
                            {cls.startTime} - {cls.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Professor: {cls.teacherName}</p>
                        <p className="text-sm text-muted-foreground">Local: {cls.location}</p>
                        <p className="text-sm text-muted-foreground">Dia: {getDayName(cls.dayOfWeek)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma aula encontrada</p>
                )}
              </TabsContent>
              
              <TabsContent value="month" className="space-y-4">
                <h3 className="text-lg font-medium">Aulas do mês</h3>
                {filteredClasses.length > 0 ? (
                  <div className="space-y-3">
                    {filteredClasses.map((cls) => (
                      <div key={cls.id} className="p-3 border rounded-md shadow-sm">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{cls.courseName}</h4>
                          <span className="text-sm bg-music-accent text-music-primary px-2 py-1 rounded-md">
                            {cls.startTime} - {cls.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Professor: {cls.teacherName}</p>
                        <p className="text-sm text-muted-foreground">Local: {cls.location}</p>
                        <p className="text-sm text-muted-foreground">Dia: {getDayName(cls.dayOfWeek)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma aula encontrada</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
