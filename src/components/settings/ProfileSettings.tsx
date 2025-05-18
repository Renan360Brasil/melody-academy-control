
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ProfileSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the updated profile here
    toast.success('Perfil atualizado com sucesso!');
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{user?.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{user?.role || 'Usuário'}</p>
        </div>
      </div>
      
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu.email@exemplo.com"
          />
        </div>
        
        <Button type="submit">Salvar alterações</Button>
      </form>
    </div>
  );
}
