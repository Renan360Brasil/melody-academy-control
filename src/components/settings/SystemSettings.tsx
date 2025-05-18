
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function SystemSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the settings here
    toast.success('Configurações do sistema atualizadas!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações do Sistema</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações globais do sistema
        </p>
      </div>
      
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="email-notifications">Notificações por email</Label>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="auto-backup">Backup automático</Label>
          <Switch
            id="auto-backup"
            checked={autoBackup}
            onCheckedChange={setAutoBackup}
          />
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="dark-mode">Modo escuro</Label>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>
        
        <Button type="submit">Salvar configurações</Button>
      </form>
    </div>
  );
}
