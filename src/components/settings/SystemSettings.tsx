import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

export function SystemSettings() {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  
  // Keep darkMode state in sync with theme
  useEffect(() => {
    setDarkMode(theme === 'dark');
  }, [theme]);
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the settings here
    toast.success('Configurações do sistema atualizadas!');
  };

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    setTheme(checked ? 'dark' : 'light');
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
            onCheckedChange={handleDarkModeChange}
          />
        </div>
        
        <Button type="submit">Salvar configurações</Button>
      </form>
    </div>
  );
}
