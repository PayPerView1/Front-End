import { redirect } from "@/i18n/navigation";

export default async function LegacyDraftsPage({ params }) {
  const { locale } = await params;
  redirect({ href: "/advertiser/drafts", locale });
}
