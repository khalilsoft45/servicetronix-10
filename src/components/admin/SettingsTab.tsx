
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";

const SettingsTab = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.site.settings')}</CardTitle>
        <CardDescription>{t('admin.manage.site.settings')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="siteName">{t('admin.site.name')}</Label>
          <Input id="siteName" defaultValue="Sala7li" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo">{t('admin.site.logo')}</Label>
          <div className="flex items-center gap-2">
            <Input id="logo" type="file" />
            <Button variant="outline">{t('admin.upload')}</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryColor">{t('admin.primary.color')}</Label>
          <div className="flex items-center gap-2">
            <Input id="primaryColor" defaultValue="#9b87f5" />
            <div className="w-10 h-10 rounded-full bg-sala7li-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="about">{t('admin.about.text')}</Label>
          <textarea
            id="about"
            className="w-full min-h-[100px] p-2 border border-input rounded-md resize-y"
            defaultValue="Sala7li is a platform connecting clients with repair technicians."
          />
        </div>
        <Button>{t('admin.save.settings')}</Button>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
