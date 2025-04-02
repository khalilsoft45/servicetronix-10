
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AccountPage from "@/components/account/AccountPage";
import { useLanguage } from "@/context/LanguageContext";

const FixerAccount = () => {
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t('fixer.account')} role="fixer">
      <AccountPage role="fixer" />
    </DashboardLayout>
  );
};

export default FixerAccount;
