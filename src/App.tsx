
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para proteção de rotas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Index />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/students" element={
        <ProtectedRoute>
          <Layout>
            <Students />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Adicione outras rotas protegidas aqui */}
      <Route path="/teachers" element={
        <ProtectedRoute>
          <Layout>
            <div className="p-4 text-center">
              <h1 className="text-xl font-bold">Página de Professores</h1>
              <p className="text-muted-foreground mt-2">
                Esta página será implementada em breve.
              </p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/courses" element={
        <ProtectedRoute>
          <Layout>
            <div className="p-4 text-center">
              <h1 className="text-xl font-bold">Página de Cursos</h1>
              <p className="text-muted-foreground mt-2">
                Esta página será implementada em breve.
              </p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/enrollments" element={
        <ProtectedRoute>
          <Layout>
            <div className="p-4 text-center">
              <h1 className="text-xl font-bold">Página de Matrículas</h1>
              <p className="text-muted-foreground mt-2">
                Esta página será implementada em breve.
              </p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/financial" element={
        <ProtectedRoute>
          <Layout>
            <div className="p-4 text-center">
              <h1 className="text-xl font-bold">Página Financeira</h1>
              <p className="text-muted-foreground mt-2">
                Esta página será implementada em breve.
              </p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <div className="p-4 text-center">
              <h1 className="text-xl font-bold">Configurações</h1>
              <p className="text-muted-foreground mt-2">
                Esta página será implementada em breve.
              </p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
