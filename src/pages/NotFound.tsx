
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Piano } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-music-accent flex items-center justify-center">
            <Piano className="h-8 w-8 text-music-primary" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4 text-music-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! Esta página não está no nosso repertório musical.
        </p>
        <Button asChild>
          <a href="/">Voltar para a Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
