
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AccountPage from "@/components/account/AccountPage";
import { useLanguage } from "@/context/LanguageContext";

const AdminAccount = () => {
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t('admin.account')} role="admin">
      <AccountPage role="admin" />
    </DashboardLayout>
  );
};

export default AdminAccount;
