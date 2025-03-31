
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const FixerDashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('fixer.dashboard')}</h2>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Link to="/">
              <Button>{t('app.back.home')}</Button>
            </Link>
          </div>
        </div>
        <Tabs defaultValue="assigned" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assigned">{t('fixer.assigned.repairs')}</TabsTrigger>
            <TabsTrigger value="completed">{t('fixer.completed.repairs')}</TabsTrigger>
          </TabsList>
          <TabsContent value="assigned" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('fixer.assigned.repairs')}</CardTitle>
                <CardDescription>{t('fixer.assigned.devices')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('fixer.display.here')}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('fixer.completed.repairs')}</CardTitle>
                <CardDescription>{t('fixer.completed.history')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('fixer.history.display')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FixerDashboard;
