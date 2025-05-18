
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Piano } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-music-accent mb-2">
          <Piano className="h-6 w-6 text-music-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">MusicSchool</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Entre com suas credenciais para acessar o sistema
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="seunome@exemplo.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                required
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                placeholder="Sua senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoCapitalize="none"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full mt-3">
              Entrar
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-muted-foreground text-center mt-2">
          Para demonstração, use:
        </p>
        <p className="text-xs text-muted-foreground text-center">
          admin@musicschool.com, teacher@musicschool.com, ou student@musicschool.com
        </p>
        <p className="text-xs text-muted-foreground text-center">
          (Senha pode ser qualquer valor)
        </p>
      </CardFooter>
    </Card>
  );
}
