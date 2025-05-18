
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main 
        className={cn(
          "flex-1 transition-all duration-300", 
          isMobile ? "w-full" : "ml-64"
        )}
      >
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
