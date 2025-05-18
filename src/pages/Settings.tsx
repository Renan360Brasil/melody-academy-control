
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { useAuth } from '@/context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Configurações" 
        description="Gerencie as configurações do sistema"
      />
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              {user?.role === 'admin' && (
                <TabsTrigger value="system">Sistema</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
            {user?.role === 'admin' && (
              <TabsContent value="system">
                <SystemSettings />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
