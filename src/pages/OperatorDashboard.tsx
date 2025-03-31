
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const OperatorDashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('operator.dashboard')}</h2>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Link to="/">
              <Button>{t('app.back.home')}</Button>
            </Link>
          </div>
        </div>
        <Tabs defaultValue="new" className="space-y-4">
          <TabsList>
            <TabsTrigger value="new">{t('operator.new.requests')}</TabsTrigger>
            <TabsTrigger value="confirmed">{t('operator.confirmed.requests')}</TabsTrigger>
          </TabsList>
          <TabsContent value="new" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('operator.new.requests')}</CardTitle>
                <CardDescription>{t('operator.waiting.confirmation')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('operator.display.here')}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="confirmed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('operator.confirmed.requests')}</CardTitle>
                <CardDescription>{t('operator.history')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('operator.history.display')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OperatorDashboard;
