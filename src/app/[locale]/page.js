import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home({ params, searchParams }) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const tokenFromUrl = resolvedSearchParams?.token;
  const userFromUrl = resolvedSearchParams?.user;

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const user = cookieStore.get("user")?.value;

  if (tokenFromUrl) {
    const redirectUrl = `/${locale}/login?token=${encodeURIComponent(tokenFromUrl)}${userFromUrl ? `&user=${encodeURIComponent(userFromUrl)}` : ""}`;
    redirect(redirectUrl);
  }

  if (token && user) {
    redirect(`/${locale}/dashboard`);
  } else {
    redirect(`/${locale}/login`);
  }
}
