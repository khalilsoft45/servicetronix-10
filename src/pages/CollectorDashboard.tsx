
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const CollectorDashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('collector.dashboard')}</h2>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Link to="/">
              <Button>{t('app.back.home')}</Button>
            </Link>
          </div>
        </div>
        <Tabs defaultValue="pickup" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pickup">{t('collector.pickup.requests')}</TabsTrigger>
            <TabsTrigger value="collected">{t('collector.collected.devices')}</TabsTrigger>
          </TabsList>
          <TabsContent value="pickup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('collector.pickup.requests')}</CardTitle>
                <CardDescription>{t('collector.waiting.collection')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('collector.display.here')}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="collected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('collector.collected.devices')}</CardTitle>
                <CardDescription>{t('collector.history')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('collector.history.display')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollectorDashboard;
