import AccountSettings from "@/features/profile/AccountSettings";

export const metadata = {
  title: "إعدادات الحساب | Pay Per View",
  description: "إعدادات الحساب وتعديل الملف الشخصي - Pay Per View",
};

export default async function AccountSettingsPage({ params, searchParams }) {
  const { locale = "ar" } = (await params) || {};
  const { tab = "profile" } = (await searchParams) || {};

  return <AccountSettings locale={locale} initialTab={tab} standalone={true} />;
}

