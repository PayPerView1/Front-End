import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home({ params, searchParams }) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const tokenFromUrl = resolvedSearchParams?.token;
  const userFromUrl = resolvedSearchParams?.user;

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (tokenFromUrl) {
    const redirectUrl = `/${locale}/login?token=${encodeURIComponent(tokenFromUrl)}${userFromUrl ? `&user=${encodeURIComponent(userFromUrl)}` : ""}`;
    redirect(redirectUrl);
  }

  if (token && userCookie) {
    let role = null;
    try {
      const decoded = decodeURIComponent(userCookie);
      let parsedUser = JSON.parse(decoded);
      // Handle double-stringified edge case
      if (typeof parsedUser === "string") {
        parsedUser = JSON.parse(parsedUser);
      }
      role = (parsedUser?.role || "").toUpperCase();
    } catch {
      // ignore JSON parse error
    }

    if (role === "BRAND") {
      redirect(`/${locale}/advertiser/dashboard`);
    } else {
      redirect(`/${locale}/creator/dashboard`);
    }
  } else {
    redirect(`/${locale}/login`);
  }
}

