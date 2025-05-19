
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Check, X } from 'lucide-react';
import { Class } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ClassAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: Class | null;
  onUpdateAttendance: (classId: string, attended: boolean) => void;
  onReschedule: (classId: string, newDate: string, startTime: string, endTime: string) => void;
}

export function ClassAttendanceDialog({ 
  open, 
  onOpenChange, 
  classData, 
  onUpdateAttendance,
  onReschedule
}: ClassAttendanceDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isRescheduling, setIsRescheduling] = useState(false);

  if (!classData) return null;

  const handleAttendanceUpdate = (attended: boolean) => {
    onUpdateAttendance(classData.id, attended);
    onOpenChange(false);
  };

  const handleReschedule = () => {
    if (!selectedDate || !classData) return;
    
    onReschedule(
      classData.id, 
      format(selectedDate, 'yyyy-MM-dd'),
      startTime,
      endTime
    );
    
    setIsRescheduling(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isRescheduling ? "Remarcar Aula" : "Registro de Presença"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {!isRescheduling ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{classData.courseName}</h3>
                <p className="text-sm text-muted-foreground">
                  {classData.isOneTime && classData.date
                    ? format(new Date(classData.date), "EEEE, dd 'de' MMMM", { locale: ptBR })
                    : `${classData.teacherName} - ${classData.startTime} às ${classData.endTime}`}
                </p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <p className="text-sm">A aula foi realizada?</p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleAttendanceUpdate(true)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Sim
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleAttendanceUpdate(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Não
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={() => setIsRescheduling(true)}
              >
                Remarcar Aula
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Nova Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, 'PP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Horário de Início</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">Horário de Término</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsRescheduling(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleReschedule}
                >
                  Confirmar Remarcação
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
