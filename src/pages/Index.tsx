
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { StatsCard } from '@/components/ui-custom/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, BookOpen, Calendar, CreditCard, UserPlus, BookOpenCheck, Piano } from 'lucide-react';
import { DashboardStats, Payment, Class } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dados de demonstração
const mockStats: DashboardStats = {
  totalStudents: 145,
  activeStudents: 128,
  totalTeachers: 12,
  totalCourses: 24,
  upcomingClasses: 38,
  monthlyRevenue: 18750,
  pendingPayments: 4200
};

const mockPayments: Payment[] = [
  {
    id: '1',
    enrollmentId: 'e1',
    studentName: 'Ana Silva',
    courseName: 'Piano Intermediário',
    amount: 340,
    dueDate: '2025-05-20',
    paidDate: '2025-05-18',
    status: 'paid',
    createdAt: '2025-05-01'
  },
  {
    id: '2',
    enrollmentId: 'e2',
    studentName: 'Carlos Mendes',
    courseName: 'Violão Avançado',
    amount: 420,
    dueDate: '2025-05-21',
    status: 'pending',
    createdAt: '2025-05-02'
  },
  {
    id: '3',
    enrollmentId: 'e3',
    studentName: 'Marina Costa',
    courseName: 'Bateria Iniciante',
    amount: 380,
    dueDate: '2025-05-15',
    status: 'overdue',
    createdAt: '2025-05-01'
  },
  {
    id: '4',
    enrollmentId: 'e4',
    studentName: 'Paulo Rodrigues',
    courseName: 'Canto Coral',
    amount: 290,
    dueDate: '2025-05-25',
    status: 'pending',
    createdAt: '2025-05-03'
  }
];

const mockClasses: Class[] = [
  {
    id: '1',
    courseId: 'c1',
    courseName: 'Piano Iniciante',
    teacherId: 't1',
    teacherName: 'Prof. Roberto Almeida',
    startTime: '14:00',
    endTime: '15:30',
    dayOfWeek: 1,
    location: 'Sala 101'
  },
  {
    id: '2',
    courseId: 'c2',
    courseName: 'Violão Popular',
    teacherId: 't2',
    teacherName: 'Profa. Fernanda Lima',
    startTime: '16:00',
    endTime: '17:30',
    dayOfWeek: 1,
    location: 'Sala 202'
  },
  {
    id: '3',
    courseId: 'c3',
    courseName: 'Teoria Musical',
    teacherId: 't3',
    teacherName: 'Prof. Marcelo Santos',
    startTime: '09:00',
    endTime: '10:30',
    dayOfWeek: 2,
    location: 'Sala 303'
  },
  {
    id: '4',
    courseId: 'c4',
    courseName: 'Percussão',
    teacherId: 't4',
    teacherName: 'Prof. André Gomes',
    startTime: '18:00',
    endTime: '19:30',
    dayOfWeek: 3,
    location: 'Sala 104'
  }
];

const revenueData = [
  { name: 'Jan', revenue: 12500 },
  { name: 'Fev', revenue: 15000 },
  { name: 'Mar', revenue: 16800 },
  { name: 'Abr', revenue: 17200 },
  { name: 'Mai', revenue: 18750 },
  { name: 'Jun', revenue: 0 }
];

const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function Index() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  useEffect(() => {
    // Simulando carregamento de dados
    setTimeout(() => {
      setStats(mockStats);
      setPayments(mockPayments);
      setClasses(mockClasses);
    }, 500);
  }, []);

  if (!stats) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={`Bem-vindo, ${user?.name || 'Usuário'}!`} 
        description="Painel de controle da MusicSchool"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Alunos Ativos"
          value={stats.activeStudents}
          icon={<Users className="h-5 w-5 text-music-primary" />}
          description={`De um total de ${stats.totalStudents} alunos`}
        />
        <StatsCard
          title="Professores"
          value={stats.totalTeachers}
          icon={<UserPlus className="h-5 w-5 text-music-primary" />}
        />
        <StatsCard
          title="Cursos Ativos"
          value={stats.totalCourses}
          icon={<BookOpenCheck className="h-5 w-5 text-music-primary" />}
        />
        <StatsCard
          title="Receita Mensal"
          value={`R$ ${stats.monthlyRevenue.toLocaleString()}`}
          icon={<CreditCard className="h-5 w-5 text-music-primary" />}
          description={`Pagamentos Pendentes: R$ ${stats.pendingPayments.toLocaleString()}`}
          trend={{ value: 8, isPositive: true }}
        />
      </div>
      
      <div className="grid gap-4 mt-6 md:grid-cols-12">
        <Card className="md:col-span-7">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                  <Bar dataKey="revenue" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Próximas Aulas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Dia</TableHead>
                  <TableHead>Horário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell className="font-medium">{classItem.courseName}</TableCell>
                    <TableCell>{weekdays[classItem.dayOfWeek]}</TableCell>
                    <TableCell>{`${classItem.startTime} - ${classItem.endTime}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Pagamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.studentName}</TableCell>
                    <TableCell>{payment.courseName}</TableCell>
                    <TableCell>R$ {payment.amount}</TableCell>
                    <TableCell>{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className={
                        payment.status === 'paid' 
                          ? 'status-active' 
                          : payment.status === 'pending' 
                            ? 'status-pending' 
                            : 'status-inactive'
                      }>
                        {payment.status === 'paid' 
                          ? 'Pago' 
                          : payment.status === 'pending' 
                            ? 'Pendente' 
                            : 'Atrasado'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
