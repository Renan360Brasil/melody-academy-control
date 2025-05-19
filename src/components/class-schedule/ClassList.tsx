
import React from 'react';
import { Class } from '@/types';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, CalendarX } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface ClassListProps {
  classes: Class[];
  view: 'day' | 'week' | 'month';
  onAttendanceClick: (classItem: Class) => void;
}

export function ClassList({ classes, view, onAttendanceClick }: ClassListProps) {
  const getDayName = (dayOfWeek: number): string => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayOfWeek];
  };

  if (classes.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Nenhuma aula encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {classes.map((cls) => (
        <div key={cls.id} className="p-3 border rounded-md shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{cls.courseName}</h4>
            <div className="flex items-center gap-2">
              {cls.attended !== undefined && (
                <Badge className={cls.attended ? "bg-green-500" : "bg-red-500"}>
                  {cls.attended ? (
                    <CalendarCheck className="h-3 w-3 mr-1" />
                  ) : (
                    <CalendarX className="h-3 w-3 mr-1" />
                  )}
                  {cls.attended ? "Realizada" : "Não realizada"}
                </Badge>
              )}
              
              {cls.isOneTime && cls.date && (
                <Badge variant="outline">
                  {format(new Date(cls.date), "dd/MM", { locale: ptBR })}
                </Badge>
              )}
              
              {!cls.isOneTime && (
                <Badge variant="outline" className="text-xs">
                  {getDayName(cls.dayOfWeek)}
                </Badge>
              )}
              
              <Badge className="bg-music-primary">
                {cls.startTime} - {cls.endTime}
              </Badge>
            </div>
          </div>
          
          <div className="mt-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-1">
            <p className="text-muted-foreground">Professor: {cls.teacherName}</p>
            <p className="text-muted-foreground">Local: {cls.location}</p>
          </div>
          
          <div className="mt-2 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAttendanceClick(cls)}
            >
              Registrar presença
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
