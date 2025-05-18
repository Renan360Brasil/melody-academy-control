
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  UserPlus, 
  BookOpenCheck, 
  CreditCard, 
  Settings, 
  Piano, 
  Menu, 
  X, 
  CalendarCheck 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { name: 'Dashboard', href: '/', icon: BookOpen },
  { name: 'Alunos', href: '/students', icon: Users },
  { name: 'Professores', href: '/teachers', icon: UserPlus },
  { name: 'Cursos', href: '/courses', icon: BookOpenCheck },
  { name: 'Matrículas', href: '/enrollments', icon: Calendar },
  { name: 'Quadro de Aulas', href: '/schedule', icon: CalendarCheck },
  { name: 'Financeiro', href: '/financial', icon: CreditCard },
  { name: 'Configurações', href: '/settings', icon: Settings }
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 w-full bg-sidebar z-50 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Piano className="h-6 w-6 text-music-primary" />
            <h1 className="text-lg font-bold text-music-primary">MusicSchool</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      )}

      <div
        className={cn(
          "h-screen bg-sidebar border-r fixed top-0 left-0 bottom-0 z-40 transition-all duration-300",
          isMobile ? (isMobileMenuOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full") : "w-64"
        )}
      >
        {!isMobile && (
          <div className="h-16 flex items-center px-6 border-b">
            <Piano className="h-6 w-6 text-music-primary mr-2" />
            <h1 className="text-lg font-bold text-music-primary">MusicSchool</h1>
          </div>
        )}
        
        {/* User info */}
        <div className="px-6 py-6 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-music-accent flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
              ) : (
                <Users className="h-5 w-5 text-music-primary" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Não autenticado'}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-music-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={isMobile ? toggleMobileMenu : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Logout button */}
        <div className="absolute bottom-4 px-6 w-full">
          <Button variant="outline" className="w-full" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </>
  );
}
