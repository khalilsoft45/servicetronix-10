
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const FixerDashboardHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">{t('fixer.dashboard')}</h2>
      <div className="flex items-center space-x-2">
        <LanguageSwitcher />
        <Link to="/">
          <Button>{t('app.back.home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default FixerDashboardHeader;
