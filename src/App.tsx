
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Enrollments from "./pages/Enrollments";
import Financial from "./pages/Financial";
import ClassSchedule from "./pages/ClassSchedule";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";

const queryClient = new QueryClient();

// Componente para proteção de rotas
function ProtectedRoute({ 
  children, 
  path 
}: { 
  children: React.ReactNode,
  path: string 
}) {
  const { isAuthenticated, canAccessRoute } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!canAccessRoute(path)) {
    toast.error("Você não tem permissão para acessar esta página");
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute path="/">
          <Layout>
            <Index />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/students" element={
        <ProtectedRoute path="/students">
          <Layout>
            <Students />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/teachers" element={
        <ProtectedRoute path="/teachers">
          <Layout>
            <Teachers />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/courses" element={
        <ProtectedRoute path="/courses">
          <Layout>
            <Courses />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/enrollments" element={
        <ProtectedRoute path="/enrollments">
          <Layout>
            <Enrollments />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/financial" element={
        <ProtectedRoute path="/financial">
          <Layout>
            <Financial />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/schedule" element={
        <ProtectedRoute path="/schedule">
          <Layout>
            <ClassSchedule />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute path="/settings">
          <Layout>
            <Settings />
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
