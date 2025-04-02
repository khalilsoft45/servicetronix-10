
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AccountPage from "@/components/account/AccountPage";
import { useLanguage } from "@/context/LanguageContext";

const OperatorAccount = () => {
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t('operator.account')} role="operator">
      <AccountPage role="operator" />
    </DashboardLayout>
  );
};

export default OperatorAccount;
